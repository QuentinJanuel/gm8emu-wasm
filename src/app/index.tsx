import React, { useEffect } from "react";
import { init, run } from "wasm";

import styles from "./index.module.scss";

class Inputs {
	private static pressedBuffer: Array<string> = [];
	private static releasedBuffer: Array<string> = [];
	public static getPressed(): Array<string> {
		const result = Inputs.pressedBuffer;
		Inputs.pressedBuffer = [];
		return result;
	}
	public static pushPressed(value: string): void {
		console.log("Pressed " + value);
		Inputs.pressedBuffer.push(value);
	}
	public static getReleased(): Array<string> {
		const result = Inputs.releasedBuffer;
		Inputs.releasedBuffer = [];
		return result;
	}
	public static pushReleased(value: string): void {
		console.log("Released " + value);
		Inputs.releasedBuffer.push(value);
	}
	// 
	private static pressedJS: { [key: string]: boolean | undefined } = {};
	public static setPressedJS(key: string, value: boolean): void {
		Inputs.pressedJS[key] = value;
	}
	public static getPressedJS(key: string): boolean {
		return Inputs.pressedJS[key] ?? false;
	}
}

const load = function (): Promise<File> {
	return new Promise(resolve => {
		const input = document.createElement('input');
		input.type = "file";
		input.multiple = false;
		input.accept = ".map";
		input.onchange = () => {
			if (input.files === null)
				return;
			const files = Array.from(input.files);
			resolve(files[0]);
		};
		input.click();
	});
}

export const App = function () {
	const canvas = React.useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
	useEffect(() => {
		init();
	}, []);
	useEffect(() => {
		if (canvas.current === null)
			return;
		const ctx = canvas.current.getContext("2d");
		if (ctx === null)
			return;
		setCtx(ctx);
	}, [canvas]);
	return <div className={ styles.container }>
		Hello, World!
		<button
			onClick={ () => {
				(async () => {
					console.log("Loading file...");
					const file = await load();
					const buffer = await file.arrayBuffer();
					const data = new Uint8Array(buffer);
					console.log(data);
					const code = await run(
						data,
						(secs: number) => new Promise(
							resolve => setTimeout(resolve, secs * 1000)
						),
						(data: Array<[number, number]>) => {
							if (ctx === undefined)
								return;
							ctx.fillStyle = "#000";
							ctx.fillRect(0, 0, 800, 608);
							ctx.fillStyle = "#F00";
							data.forEach(point => {
								ctx.fillRect(point[0], point[1], 31, 31);
							});
						},
						Inputs.getPressed,
						Inputs.getReleased,
					);
					console.log(code);
				})()
				.catch(console.error);
			} }
		>
			Load file
		</button>
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
			} }
			onKeyUp={ (e) => {
				Inputs.setPressedJS(e.key, false);
				if (e.key === "Shift")
					Inputs.pushReleased("jump");
				if (e.key === "ArrowLeft")
					Inputs.pushReleased("left");
				if (e.key === "ArrowRight")
					Inputs.pushReleased("right");
			} }
			tabIndex={ 0 }
		></canvas>
	</div>;
}
