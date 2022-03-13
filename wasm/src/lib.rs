mod utils;
mod external;

use wasm_bindgen::prelude::*;
use external as ext;

#[wasm_bindgen]
pub fn init(js_external: external::IExternal) {
    utils::set_panic_hook();
    let external = ext::External::from_js(js_external);
    gm8emulator::external::init(external);
}

#[wasm_bindgen]
pub async fn run(
    data: Vec<u8>,
    ctx: web_sys::CanvasRenderingContext2d,
) -> i32 {
    gm8emulator::run(
        &data[..],
        ctx,
    ).await
}
