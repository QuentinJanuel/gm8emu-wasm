use gm8emulator::external as ext;
use std::time;
use js_sys::{
    Promise,
    Date,
};
use wasm_bindgen_futures::JsFuture;

pub struct Time;

impl ext::time::Time for Time {
    fn now_as_timestamp_nanos(&self) -> u128 {
        let now = Date::now() as u128;
        now * 1_000_000
    }
    fn wait(&self, dur: time::Duration) -> ext::Fut {
        let secs = dur.as_secs() as f64;
        let nanos = dur.subsec_nanos() as f64;
        let ms = (secs * 1_000.0) + (nanos / 1_000_000.0);
        let promise = Promise::new(&mut |resolve, _| {
            web_sys::window()
                .expect("Failed to get window")
                .set_timeout_with_callback_and_timeout_and_arguments_0(
                    &resolve,
                    ms.floor() as i32,
                )
                .expect("Failed to set timeout");
        });
        let future = JsFuture::from(promise);
        Box::pin(async {
            future.await.expect("Failed to wait");
        })
    }
}
