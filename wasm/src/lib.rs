mod utils;
mod time;

use wasm_bindgen::prelude::*;
use gm8emulator::jsutils;
use std::sync::Arc;

mod audio;

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
    ctx: web_sys::CanvasRenderingContext2d,
    get_pressed: js_sys::Function,
    get_released: js_sys::Function,
    js_audio: audio::IAudio,
    waiter: time::IWaiter,
) -> i32 {
    let audio = audio::Audio::from_js(js_audio);
    let time = time::Time::new(waiter);
    gm8emulator::run(
        &data[..],
        Arc::new(|msg| {
            log(msg);
        }),
        ctx,
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
        Arc::new(audio),
        Arc::new(time),
    ).await
}
