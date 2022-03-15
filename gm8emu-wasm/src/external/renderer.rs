use std::{
    collections::HashMap,
    sync::Mutex,
};
use gm8emulator::external::{
    self as ext,
    renderer::{
        atlas::{
            AtlasBuilder,
            AtlasRef,
            AtlasRect,
        },
        Colour,
    },
};
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
    rect: AtlasRect,
}

#[derive(Default)]
struct View {
    src_x: i32,
    src_y: i32,
    src_w: i32,
    src_h: i32,
    src_angle: f64,
    port_x: i32,
    port_y: i32,
    port_w: i32,
    port_h: i32,
}

pub struct Renderer {
    ctx: CanvasRenderingContext2d,
    sprites: Mutex<HashMap<i32, Sprite>>,
    view: Mutex<View>,
}

unsafe impl Send for Renderer {}
unsafe impl Sync for Renderer {}

impl Renderer {
    pub fn new(ctx: CanvasRenderingContext2d) -> Self {
        Self {
            ctx,
            sprites: Mutex::from(HashMap::new()),
            view: Mutex::from(View::default()),
        }
    }
}

impl ext::renderer::Renderer for Renderer {
    fn clear(&self, col: Colour) {
        let red = (col.r * 255.) as u8;
        let green = (col.g * 255.) as u8;
        let blue = (col.b * 255.) as u8;
        let col = format!("rgb({}, {}, {})", red, green, blue);
        self.ctx.set_fill_style(&JsValue::from_str(&col));
        self.ctx.fill_rect(0., 0., 800., 608.);
    }
    fn load_sprites(&self, atl: AtlasBuilder) {
        let try_load_sprites = || -> Result<(), JsValue> {
            let mut cur_sprites = self.sprites
                .lock()
                .expect("Lock poisoned");
            let (_, sprites) = atl.into_inner();
            for (i, (rect, data)) in sprites
                .into_iter()
                .enumerate()
            {
                let data = data
                    .chunks(4)
                    .flat_map(|chunk| {
                        let b = chunk[0];
                        let g = chunk[1];
                        let r = chunk[2];
                        let a = chunk[3];
                        [r, g, b, a]
                    })
                    .collect::<Vec<_>>();
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
                let id = i as i32;
                let sprite = Sprite {
                    canvas: canvas2,
                    rect,
                };
                cur_sprites.insert(id, sprite);
            };
            Ok(())
        };
        if let Err(e) = try_load_sprites() {
            panic!(
                "Failed to load sprites: {}",
                e.as_string().unwrap_or("unknown error".into())
            );
        }
    }
    fn get_rect(&self, atl: AtlasRef) -> Option<AtlasRect> {
        self.sprites
            .lock()
            .expect("Lock poisoned")
            .get(&atl.0)
            .map(|s| &s.rect)
            .cloned()
    }
    fn draw_sprite_general(
        &self,
        texture: AtlasRef,
        part_x: f64,
        part_y: f64,
        part_w: f64,
        part_h: f64,
        x: f64,
        y: f64,
        xscale: f64,
        yscale: f64,
        angle: f64,
        col1: i32,
        col2: i32,
        col3: i32,
        col4: i32,
        alpha: f64,
        use_origin: bool,
    ) {
        let sprites = self
            .sprites
            .lock()
            .expect("Lock poisoned");
        let sprite = sprites
            .get(&texture.0);
        if let None = sprite {
            return;
        }
        let view = self.view
            .lock()
            .unwrap();
        self.ctx.save();
        self.ctx.translate(
            -view.src_x as f64,
            -view.src_y as f64,
        ).expect("Failed to translate");
        let sprite = sprite.unwrap();
        let rect = &sprite.rect;
        let width = xscale * part_w;
        let height = yscale * part_h;
        let (x, y) = if use_origin {
            let x = x - rect.origin_x as f64 * width;
            let y = y - rect.origin_y as f64 * height;
            (x, y)
        } else {
            (x, y)
        };
        self.ctx
            .translate(x, y)
            .expect("Failed to translate");
        self.ctx
            .scale(width, height)
            .expect("Failed to scale");
        self.ctx
            .draw_image_with_html_canvas_element_and_sw_and_sh_and_dx_and_dy_and_dw_and_dh(
            &sprite.canvas,
            part_x, part_y,
            part_w, part_h,
            0., 0.,
            1., 1.,
        )
            .expect("Failed to draw sprite");
        self.ctx.restore();
    }
    fn set_view(
        &self,
        src_x: i32,
        src_y: i32,
        src_w: i32,
        src_h: i32,
        src_angle: f64,
        port_x: i32,
        port_y: i32,
        port_w: i32,
        port_h: i32,
    ) {
        let mut view = self.view
            .lock()
            .expect("Lock poisoned");
        *view = View {
            src_x,
            src_y,
            src_w,
            src_h,
            src_angle,
            port_x,
            port_y,
            port_w,
            port_h,
        };
    }
}
