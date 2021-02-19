package com.giganotes.app

import gigamessages.Messages

object Core {

    external fun handleRequest(command: Int, input: ByteArray): ByteArray
    external fun initLogging();

    fun init(dataDir : String) {
        System.loadLibrary("rust")

        initLogging()

        val initCommand = Messages.InitData.newBuilder()
            .setApiPath("https://backend.giganotes.com")
            .setDataPath(dataDir)
            .build()

        handleRequest(1, initCommand.toByteArray())
    }
}