use gm8emulator::external as ext;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn error(s: &str);
}

#[allow(dead_code)]
pub enum VerboseLevel {
    None,
    Error,
    All,
}

pub struct Logger {
    v: VerboseLevel,
}

impl Logger {
    pub fn new(v: VerboseLevel) -> Self {
        Self { v }
    }
}

impl ext::logger::Logger for Logger {
    fn log(&self, msg: &str) {
        match self.v {
            VerboseLevel::None => (),
            VerboseLevel::Error => (),
            VerboseLevel::All => log(msg),
        };
    }
    fn err(&self, msg: &str) {
        match self.v {
            VerboseLevel::None => (),
            VerboseLevel::Error => error(msg),
            VerboseLevel::All => error(msg),
        };
    }
}
