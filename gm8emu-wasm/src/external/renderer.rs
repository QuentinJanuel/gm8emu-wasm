use gm8emulator::external as ext;
use wasm_bindgen::{
    Clamped,
    prelude::*,
    JsCast,
};
use web_sys::{
    CanvasRenderingContext2d,
    ImageData,
    window,
    HtmlCanvasElement,
};

struct Sprite {
    canvas: HtmlCanvasElement,
}

pub struct Renderer {
    ctx: CanvasRenderingContext2d,
    sprites: Vec<Sprite>,
}

unsafe impl Send for Renderer {}
unsafe impl Sync for Renderer {}

impl Renderer {
    pub fn new(ctx: CanvasRenderingContext2d) -> Self {
        ctx.set_fill_style(&JsValue::from_str("#F00"));
        Self {
            ctx,
            sprites: vec![],
        }
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
    fn load_sprites(&mut self, atl: ext::renderer::atlas::AtlasBuilder) {
        let try_load_sprites = || -> Result<(), JsValue> {
            let (_, sprites) = atl.into_inner();
            for (rect, data) in sprites {
                let data = Clamped(&*data);
                let sw = data.len() as u32 / 4 / rect.h as u32;
                let data = ImageData::new_with_u8_clamped_array(data, sw)?;
                let canvas2 = window()
                    .unwrap()
                    .document()
                    .unwrap()
                    .create_element("canvas")?
                    .dyn_into::<HtmlCanvasElement>()?;
                canvas2.set_width(rect.w as u32);
                canvas2.set_height(rect.h as u32);
                let ctx2 = canvas2.get_context("2d")?
                    .unwrap()
                    .dyn_into::<CanvasRenderingContext2d>()?;
                ctx2.put_image_data(&data, 0., 0.)?;
                self.sprites.push(Sprite {
                    canvas: canvas2,
                });
            };
            Ok(())
            // self.ctx
            //     .draw_image_with_html_canvas_element(
            //         &canvas2,
            //         0.,
            //         0.,
            //     )
            //     .expect("Failed to draw image");
        };
        if let Err(e) = try_load_sprites() {
            panic!(
                "Failed to load sprites: {}",
                e.as_string().unwrap_or("unknown error".into())
            );
        }
    }
}
