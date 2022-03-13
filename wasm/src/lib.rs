mod utils;
mod external;

use wasm_bindgen::prelude::*;
use external as ext;
use std::sync::Arc;

#[wasm_bindgen]
pub fn init() {
    utils::set_panic_hook();
}

#[wasm_bindgen]
pub async fn run(
    data: Vec<u8>,
    verbose: bool,
    ctx: web_sys::CanvasRenderingContext2d,
    get_pressed: js_sys::Function,
    get_released: js_sys::Function,
    js_audio: ext::audio::IAudio,
) -> i32 {
    let external = ext::External::new(
        verbose,
        js_audio,
    );
    gm8emulator::external::init(external);
    gm8emulator::run(
        &data[..],
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
    ).await
}
