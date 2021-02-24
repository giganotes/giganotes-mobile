# GigaNotes

[GigaNotes](https://giganotes.com) is an open source data management and note taking app.

## Features

* Note-taking app with faster and handier operation
* Notes can be taken work both in online and offline
* Able to work without the server ('offline' mode)
* Synchronizes notes among all connected devices
* Works in both Windows and Linux 
* Powerful searching capabilites that allow to reach any note pretty fast
* Rich editor for texts including cross-references
* Works as resourceful personal wiki
* Has a [web version](https://web.giganotes.com) that works directly from the browser
* Has a [mobile version](https://play.google.com/store/apps/details?id=com.thetapad.app) for Android
* Open source [API backend](https://github.com/giganotes/giganotes-backend) allows Giganotes to be used as a full self-hosted solution
  
## Application architecture

![Giganotes](/docs/giganotes-mobile-diagram.png)

GigaNotes an Android application that is using [native core component](https://github.com/giganotes/giganotes-core) written in [Rust](https://www.rust-lang.org/) system programming language for faster data processing.
Applying native code allows to reach essential performance boost, especially for data synchronization and another tasks like advanced document analysis, link extraction and many others.