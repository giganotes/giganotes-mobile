extern crate jni;
extern crate giganotes_core;
extern crate android_logger;
#[macro_use] extern crate log;

use log::Level;
use android_logger::{Config,FilterBuilder};
use jni::JNIEnv;
use jni::objects::{JClass, JObject};
use jni::sys::{jint, jbyteArray};
use giganotes_core::core::*;

#[no_mangle]
#[allow(non_snake_case)]
pub extern "C" fn Java_com_giganotes_app_Core_initLogging(env: JNIEnv, _class: JClass) {
    android_logger::init_once(
        Config::default()
            .with_min_level(Level::Trace) // limit log level
            .with_tag("mytag") // logs will show under mytag tag
            .with_filter( // configure messages for specific crate
                FilterBuilder::new()
                    .parse("debug,hello::crate=error")
                    .build())
    );
}

#[no_mangle]
#[allow(non_snake_case)]
pub extern "C" fn Java_com_giganotes_app_Core_handleRequest(env: JNIEnv,
                                                                                  _class: JClass,
                                                                                  command: jint,
                                                                                  input: jbyteArray,
                                                                                  callback: JObject) -> jbyteArray {

    info!("JNI call handleRequest with command {}", command as i8);
    let _input = env.convert_byte_array(input).unwrap();
    let output_data = handle_command(command as i8, &_input, _input.len() as usize);;
    let output = env.byte_array_from_slice(&output_data).unwrap();
    output
}