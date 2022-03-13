pub mod audio;
pub mod time;
pub mod logger;
pub mod input;

use std::sync::Arc;
use gm8emulator::external as ext;
use js_sys::Reflect;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(typescript_custom_section)]
const IEXTERNAL: &'static str = r#"
interface IExternal {
    verbose: boolean,
    audio: IAudio,
    input: IInput,
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "IExternal")]
    pub type IExternal;
}

pub struct External {
    audio: Arc<audio::Audio>,
    time: Arc<time::Time>,
    logger: Arc<logger::Logger>,
    input: Arc<input::Input>,
}

impl External {
    pub fn from_js(js_external: IExternal) -> Self {
        let verbose = Reflect::get(
            &js_external,
            &JsValue::from("verbose"),
        ).unwrap();
        let verbose = verbose.as_bool().unwrap();
        let logger = logger::Logger::new(
            if verbose {
                logger::VerboseLevel::All
            } else {
                logger::VerboseLevel::Error
            }
        );
        let time = time::Time;
        let js_audio = Reflect::get(
            &js_external,
            &JsValue::from("audio"),
        ).unwrap();
        let audio = audio::Audio::from_js(js_audio);
        let js_input = Reflect::get(
            &js_external,
            &JsValue::from("input"),
        ).unwrap();
        let input = input::Input::from_js(js_input);
        Self {
            logger: Arc::new(logger),
            time: Arc::new(time),
            audio: Arc::new(audio),
            input: Arc::new(input),
        }
    }
}

impl ext::External for External {
    fn audio(&self) -> Arc<dyn ext::audio::Audio> {
        self.audio.clone()
    }
    fn time(&self) -> Arc<dyn ext::time::Time> {
        self.time.clone()
    }
    fn logger(&self) -> Arc<dyn ext::logger::Logger> {
        self.logger.clone()
    }
    fn input(&self) -> Arc<dyn ext::input::Input> {
        self.input.clone()
    }
}