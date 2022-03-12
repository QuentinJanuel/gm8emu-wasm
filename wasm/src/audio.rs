use std::iter::FromIterator;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use js_sys::{
    Reflect,
    Function,
    Promise,
    Array,
    Object,
};
use gm8emulator::jsutils;

#[wasm_bindgen(typescript_custom_section)]
const IAUDIO: &'static str = r#"
interface ISound {
    id: number;
    data: Array<number>;
}

interface IAudio {
    load: (sounds: Array<ISound>) => Promise<void>;
    play: (id: number, loop: boolean) => void;
    stop: (id: number) => void;
    stopAll: () => void;
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "IAudio")]
    pub type IAudio;
}

pub struct Audio {
    js_audio: IAudio,
}

impl Audio {
    pub fn from_js(js_audio: IAudio) -> Self {
        Self { js_audio }
    }
}

fn sound_to_js(sound: &jsutils::Sound) -> JsValue {
    let id = JsValue::from(sound.id);
    let data = JsValue::from_serde(&sound.data).unwrap();
    let js_sound = Object::new();
    Reflect::set(
        &js_sound,
        &JsValue::from("id"),
        &id,
    ).unwrap();
    Reflect::set(
        &js_sound,
        &JsValue::from("data"),
        &data,
    ).unwrap();
    JsValue::from(js_sound)
}

impl jsutils::Audio for Audio {
    fn load(&self, sounds: Vec<jsutils::Sound>) -> jsutils::Fut {
        let this = JsValue::null();
        let load = Reflect::get(
            &self.js_audio,
            &JsValue::from("load"),
        ).unwrap();
        let load = Function::from(load);
        let sounds = sounds
            .iter()
            .map(sound_to_js);
        let sounds = Array::from_iter(sounds);
        let sounds = JsValue::from(sounds);
        let promise = load.call1(&this, &sounds)
            .expect("Failed to call load");
        let promise = Promise::from(promise);
        let future = JsFuture::from(promise);
        Box::pin(async {
            future.await
                .expect("Failed to load sounds");
        })
    }
    fn play(&self, id: i32, loop_: bool) {
        let this = JsValue::null();
        let play = Reflect::get(
            &self.js_audio,
            &JsValue::from("play"),
        ).unwrap();
        let play = Function::from(play);
        let id = JsValue::from(id);
        let loop_ = JsValue::from(loop_);
        play.call2(&this, &id, &loop_)
            .expect("Failed to call play");
    }
    fn stop(&self, id: i32) {
        let this = JsValue::null();
        let stop = Reflect::get(
            &self.js_audio,
            &JsValue::from("stop"),
        ).unwrap();
        let stop = Function::from(stop);
        let id = JsValue::from(id);
        stop.call1(&this, &id)
            .expect("Failed to call stop");
    }
    fn stop_all(&self) {
        let this = JsValue::null();
        let stop_all = Reflect::get(
            &self.js_audio,
            &JsValue::from("stopAll"),
        ).unwrap();
        let stop_all = Function::from(stop_all);
        stop_all.call0(&this)
            .expect("Failed to call stop_all");
    }
}
