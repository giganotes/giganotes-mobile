package com.giganotes.app

import android.R
import android.content.Context
import android.util.Base64
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import com.giganotes.app.Core.handleRequest
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import org.json.JSONException
import org.json.JSONObject
import java.lang.reflect.InvocationTargetException
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors


class WebAppInterface internal constructor(var webView: WebView, var activity: MainActivity) {

    val DEFAULT_THREAD_POOL_SIZE = 4

    var executorService: ExecutorService = Executors.newFixedThreadPool(DEFAULT_THREAD_POOL_SIZE)

    var runAsyncResults: MutableMap<String, String> = ConcurrentHashMap()

    @JavascriptInterface
    fun runAsync(rand: String, funcName: String?, jsonParams: String?) {
        val wai = this

        executorService.execute(object : Runnable {
            override fun run() {
                try {
                    val params = JSONObject(jsonParams)
                    val result = wai.javaClass.getMethod(funcName, JSONObject::class.java)
                            .invoke(wai, params) as String
                    wai.jsResolve(rand, true, result)
                } catch (ite: InvocationTargetException) { // exceptions inside the funcName function
                    wai.jsResolve(rand, false, ite.cause.toString())
                } catch (e: Exception) {
                    wai.jsResolve(rand, false, e.toString())
                }

            }
        })
    }

    private fun jsResolve(
            rand: String,
            isSuccess: Boolean,
            result: String
    ) { // notify that result is ready
        runAsyncResults[rand] = result
        val url = "javascript:$rand.callback($isSuccess)"
        Log.i("LOG_TAG", "calling js method with url $url")
        webView.post { webView.loadUrl(url) }
    }

    @JavascriptInterface
    fun runAsyncResult(rand: String): String? { // returns the result from runAsync to JS
        val result = runAsyncResults[rand]
        runAsyncResults.remove(rand)
        return result
    }

    fun runCoreCommand(params: JSONObject): String {
        return try {
            val command = params["command"] as Int
            var data: ByteArray? = byteArrayOf()
            if (params.has("data")) {
                val dataBase64 = params["data"] as String
                data = Base64.decode(dataBase64, Base64.NO_WRAP)
            }
            val result = handleRequest(command, data!!)
            Base64.encodeToString(result, Base64.NO_WRAP)
        } catch (ex: JSONException) {
            ""
        }
    }

    fun googleSignIn(params: JSONObject): String  {
        activity.signIn();
        activity.signInLatch.await()
        var resMap = HashMap<String, String>()
        resMap.put("idToken", activity.googleSignInAccount?.idToken!!)
        resMap.put("email", activity.googleSignInAccount?.email!!)
        return JSONObject(resMap as Map<*, *>).toString();
    }
}