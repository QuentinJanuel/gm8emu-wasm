pub mod audio;
pub mod time;
pub mod logger;

use std::sync::Arc;
use gm8emulator::external as ext;

pub struct External {
    audio: Arc<audio::Audio>,
    time: Arc<time::Time>,
    logger: Arc<logger::Logger>,
}

impl External {
    pub fn new(
        verbose: bool,
        js_audio: audio::IAudio,
    ) -> Self {
        let logger = logger::Logger::new(
            if verbose {
                logger::VerboseLevel::All
            } else {
                logger::VerboseLevel::Error
            }
        );
        let time = time::Time;
        let audio = audio::Audio::from_js(js_audio);
        Self {
            logger: Arc::new(logger),
            time: Arc::new(time),
            audio: Arc::new(audio),
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
}
