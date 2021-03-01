package com.giganotes.app

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.tasks.Task
import java.util.concurrent.CountDownLatch


class MainActivity : AppCompatActivity() {

    lateinit var signInLatch: CountDownLatch
    var googleSignInAccount: GoogleSignInAccount? = null

    // A magic number we will use to know that our sign-in error
    // resolution activity has completed.
    private val REQUEST_CODE = 49404

    lateinit var mGoogleSignInClient : GoogleSignInClient
    lateinit var myWebView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken("991995282025-4159nc4q0l83fkapl4j3qav55asa38g6.apps.googleusercontent.com")
                .requestEmail()
                .build()

        // Build a GoogleSignInClient with the options specified by gso.
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        Core.init(applicationContext.applicationInfo.dataDir)

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        myWebView = findViewById(R.id.webkit)
        myWebView.settings.javaScriptEnabled = true
        myWebView.settings.domStorageEnabled = true
        myWebView.settings.allowFileAccessFromFileURLs = true

        myWebView.addJavascriptInterface(WebAppInterface(myWebView, this), "Android")
        myWebView.loadUrl("file:///android_asset/index.html");
    }

    fun signIn() {
        signInLatch = CountDownLatch(1)
        val signInIntent: Intent = mGoogleSignInClient.getSignInIntent()
        startActivityForResult(signInIntent, REQUEST_CODE)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == REQUEST_CODE) {
            // The Task returned from this call is always completed, no need to attach
            // a listener.
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            handleSignInResult(task)
        }
    }

    fun handleSignInResult(completedTask: Task<GoogleSignInAccount>) {
        try {
            googleSignInAccount = completedTask.getResult(ApiException::class.java)
        } catch (e: ApiException) {
        }

        signInLatch.countDown()
    }
}