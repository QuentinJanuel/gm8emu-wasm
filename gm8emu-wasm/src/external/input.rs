use gm8emulator::external as ext;
use wasm_bindgen::prelude::*;
use js_sys::{
    Reflect,
    Function,
    Array,
};

#[wasm_bindgen(typescript_custom_section)]
const IINPUT: &'static str = r#"
interface IInput {
    pressed: () => Array<string>;
    released: () => Array<string>;
}
"#;

fn key_from_js(js_key: JsValue) -> gm8emulator::input::Button {
    let js_key = js_key.as_string()
        .expect("Failed to convert js_key to string");
    match js_key.as_ref() {
        "ArrowLeft" => gm8emulator::input::Button::LeftArrow,
        "ArrowRight" => gm8emulator::input::Button::RightArrow,
        "Shift" => gm8emulator::input::Button::Shift,
        "r" => gm8emulator::input::Button::R,
        _ => panic!("Unknown key: {}", js_key),
    }
}

pub struct Input {
    js_input: JsValue,
}

unsafe impl Sync for Input {}
unsafe impl Send for Input {}

impl Input {
    pub fn from_js(js_input: JsValue) -> Self {
        Self { js_input }
    }
}

impl ext::input::Input for Input {
    fn pressed(&self) -> Vec<gm8emulator::input::Button> {
        let this = JsValue::null();
        let pressed = Reflect::get(
            &self.js_input,
            &JsValue::from("pressed"),
        ).unwrap();
        let pressed = Function::from(pressed);
        let pressed = pressed.call0(&this)
            .expect("Failed to call pressed");
        Array::from(&pressed).iter()
            .map(key_from_js)
            .collect()
    }
    fn released(&self) -> Vec<gm8emulator::input::Button> {
        let this = JsValue::null();
        let released = Reflect::get(
            &self.js_input,
            &JsValue::from("released"),
        ).unwrap();
        let released = Function::from(released);
        let released = released.call0(&this)
            .expect("Failed to call released");
        Array::from(&released).iter()
            .map(key_from_js)
            .collect()
    }
}
