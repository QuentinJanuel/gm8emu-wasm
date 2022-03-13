import { AudioPlayer } from "../audio";
import { IAudio } from "wasm";

export const audio: IAudio = {
    load: async sounds => {
        const loaders = sounds
            .map(({ id, data }) => AudioPlayer.load(id, data));
        await Promise.all(loaders);
    },
    play: (id, loop) => AudioPlayer.get(id)?.play(loop),
    stop: id => AudioPlayer.get(id)?.stop(),
    stopAll: AudioPlayer.stopAll,
};
