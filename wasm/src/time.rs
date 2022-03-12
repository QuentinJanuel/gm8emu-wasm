use wasm_bindgen::prelude::*;
use gm8emulator::jsutils;
use std::time;
use js_sys::{
    Function,
    Promise,
    Date,
};
use wasm_bindgen_futures::JsFuture;

#[wasm_bindgen(typescript_custom_section)]
const IWAITER: &'static str = r#"
type IWaiter = (seconds: number) => Promise<void>;
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "IWaiter")]
    pub type IWaiter;
}

pub struct Time {
    waiter: Function,
}

impl Time {
    pub fn new(waiter: IWaiter) -> Self {
        let waiter = JsValue::from(waiter);
        let waiter = Function::from(waiter);
        Self { waiter }
    }
}

impl jsutils::Time for Time {
    fn now_as_timestamp_nanos(&self) -> u128 {
        let now = Date::now() as u128;
        now * 1_000_000
    }
    fn wait(&self, dur: time::Duration) -> jsutils::Fut {
        let this = JsValue::null();
        let secs = dur.as_secs() as f64;
        let nanos = dur.subsec_nanos() as f64;
        let secs = secs + nanos / 1_000_000_000.0;
        let secs = JsValue::from(secs);
        let promise = self
            .waiter
            .call1(&this, &secs)
            .expect("Failed to call waiter");
        let promise = Promise::from(promise);
        let future = JsFuture::from(promise);
        Box::pin(async {
            future.await.expect("Failed to wait");
        })
    }
}
