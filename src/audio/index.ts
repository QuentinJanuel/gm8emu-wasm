interface List {
	[id: number]: AudioPlayer;
}

export class AudioPlayer {
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
	public static async load(id: number, data: Array<number>) {
		if (AudioPlayer.list[id] !== undefined)
			return;
		// console.log("Loading sound", id);
		const buffer = new Uint8Array(data).buffer;
		const blob = new Blob([buffer], { type: "audio/wav" });
		const url = window.URL.createObjectURL(blob);
		const audio = document.createElement("audio");
		audio.src = url;
		audio.load();
		AudioPlayer.list[id] = new AudioPlayer(id, audio);
	}
	public static get(id: number): AudioPlayer | undefined {
		return AudioPlayer.list[id];
	}
	public static stopAll() {
		for (const id in AudioPlayer.list)
			AudioPlayer.list[id].stop();
	}
}
