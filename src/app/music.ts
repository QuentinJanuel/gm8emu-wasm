interface List {
    [id: number]: Music;
}

export class Music {
    private _audio: HTMLAudioElement;
    public constructor(id: number, audio: HTMLAudioElement) {
        this._audio = audio;
    }
    public get audio() {
        return this._audio;
    }
    public play(loop: boolean) {
        this.audio.loop = loop;
        this.audio.play();
    }
    public stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
    // 
    private static list: List = {};
    public static async register(id: number, data: Array<number> | 0) {
        if (!data)
            return;
        if (Music.list[id] !== undefined)
            return;
        console.log("Loading music", id);
        const buffer = new Uint8Array(data).buffer;
        const blob = new Blob([buffer], { type: "audio/wav" });
        const url = window.URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.load();
        Music.list[id] = new Music(id, audio);
    }
    public static get(id: number): Music | undefined {
        return Music.list[id];
    }
    public static stopAll() {
        for (const id in Music.list)
            Music.list[id].stop();
    }
}
