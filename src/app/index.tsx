import React, { useEffect } from "react";
import { init, run } from "wasm";
import { Inputs } from "./inputs";
import { load } from "./load";
import { AudioPlayer } from "../wasm/audio-player";
import { audio } from "../wasm/ffi/audio";

import styles from "./index.module.scss";

export const App = function () {
	const canvas = React.useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
	useEffect(init, []);
	useEffect(() => {
		if (canvas.current === null)
			return;
		const ctx = canvas.current.getContext("2d");
		if (ctx === null)
			return;
		setCtx(ctx);
	}, [canvas]);
	return <div className={ styles.container }>
		<button
			onClick={ () => {
				(async () => {
					if (ctx === undefined)
						return;
					const file = await load();
					const buffer = await file.arrayBuffer();
					const data = new Uint8Array(buffer);
					console.log("Running...");
					const code = await run(
						data,
						(secs: number) => new Promise(
							resolve => setTimeout(resolve, secs * 1000)
						),
						ctx,
						Inputs.getPressed,
						Inputs.getReleased,
						audio,
					);
					console.log(code);
				})()
				.catch(console.error);
			} }
		>Load file</button>
		<canvas
			ref={ canvas }
			width={ 800 }
			height={ 608 }
			style={{
				border: "1px solid black",
			}}
			onKeyDown={ (e) => {
				if (Inputs.getPressedJS(e.key))
					return;
				Inputs.setPressedJS(e.key, true);
				if (e.key === "Shift")
					Inputs.pushPressed("jump");
				if (e.key === "ArrowLeft")
					Inputs.pushPressed("left");
				if (e.key === "ArrowRight")
					Inputs.pushPressed("right");
				if (e.key === "r")
					Inputs.pushPressed("r");
			} }
			onKeyUp={ (e) => {
				Inputs.setPressedJS(e.key, false);
				if (e.key === "Shift")
					Inputs.pushReleased("jump");
				if (e.key === "ArrowLeft")
					Inputs.pushReleased("left");
				if (e.key === "ArrowRight")
					Inputs.pushReleased("right");
				if (e.key === "r")
					Inputs.pushReleased("r");
			} }
			tabIndex={ 0 }
		></canvas>
	</div>;
}
