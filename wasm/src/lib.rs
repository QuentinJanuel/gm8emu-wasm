mod utils;

use wasm_bindgen::prelude::*;
use gm8emulator::jsutils;
use std::sync::Arc;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init() {
    utils::set_panic_hook();
}

#[wasm_bindgen]
pub async fn run(
    data: Vec<u8>,
    waiter: js_sys::Function,
    on_frame: js_sys::Function,
    get_pressed: js_sys::Function,
    get_released: js_sys::Function,
) -> i32 {
    gm8emulator::run(
        &data[..],
        Arc::new(|msg| {
            log(msg);
        }),
        jsutils::JsWaiter::new(waiter),
        Arc::new(move |data| {
            let this = JsValue::null();
            let data = JsValue::from_serde(&data)
                .unwrap_or(JsValue::null());
            on_frame.call1(&this, &data)
                .expect("Failed to call on_frame");
        }),
        Arc::new(move || {
            let this = JsValue::null();
            get_pressed.call0(&this)
                .expect("Failed to call get_pressed")
        }),
        Arc::new(move || {
            let this = JsValue::null();
            get_released.call0(&this)
                .expect("Failed to call get_released")
        }),
    ).await
}
