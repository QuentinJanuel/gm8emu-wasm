use gm8emulator::external as ext;
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

pub struct Renderer {
    ctx: CanvasRenderingContext2d,
}

unsafe impl Send for Renderer {}
unsafe impl Sync for Renderer {}

impl Renderer {
    pub fn new(ctx: CanvasRenderingContext2d) -> Self {
        ctx.set_fill_style(&JsValue::from_str("#F00"));
        Self { ctx }
    }
}

impl ext::renderer::Renderer for Renderer {
    fn clear(&self) {
        self.ctx.clear_rect(0., 0., 800., 608.);
    }
    fn draw_rect(&self, x: f64, y: f64, w: f64, h: f64) {
        self.ctx.fill_rect(
            x.round(),
            y.round(),
            w.round(),
            h.round(),
        );
    }
}
