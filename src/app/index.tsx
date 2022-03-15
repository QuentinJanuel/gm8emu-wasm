import React, { useEffect } from "react";
import { init, run } from "gm8emu-wasm";

import { getExternal, load, Inputs } from "../gm8emu";

import styles from "./index.module.scss";

enum State {
	Playing,
	Ready,
	NotReady,
}

const resizeCanvas = function (canvas: HTMLCanvasElement) {
	const ratio = canvas.width / canvas.height;
	const cssDimensions = {
		x: window.innerWidth,
		y: window.innerHeight,
	};
	if (window.innerWidth / window.innerHeight > ratio)
		cssDimensions.x = window.innerHeight * ratio;
	else
		cssDimensions.y = window.innerWidth / ratio;
	canvas.style.width = `${ cssDimensions.x }px`;
	canvas.style.height = `${ cssDimensions.y }px`;
	const left = (window.innerWidth - cssDimensions.x) / 2;
	const top = (window.innerHeight - cssDimensions.y) / 2;
	canvas.style.left = `${ left }px`;
	canvas.style.top = `${ top }px`;
};

export const App = function () {
	const canvas = React.useRef<HTMLCanvasElement>(null);
	const [state, setState] = React.useState(State.NotReady);
	const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
	useEffect(() => {
		if (!ctx || !canvas.current)
			return;
		if (state != State.NotReady)
			return;
		init(getExternal(ctx));
		window.addEventListener("keydown", e => Inputs.onKeyDown(e.key));
		window.addEventListener("keyup", e => Inputs.onKeyUp(e.key));
		window.addEventListener("resize", () => resizeCanvas(canvas.current!));
		resizeCanvas(canvas.current);
		setState(State.Ready);
	}, [ctx]);
	useEffect(() => {
		setCtx(canvas.current?.getContext("2d") ?? undefined);
	}, [canvas]);
	return <div className={ styles.container }>
		{ state == State.Ready ? <button
				onClick={ () => {
					(async () => {
						const data = await load();
						console.log("Running...");
						setState(State.Playing);
						console.log(await run(data));
					})()
					.catch(console.error);
				} }
			>Load assets</button> : null
		}
		<canvas
			ref={ canvas }
			width={ 800 }
			height={ 608 }
			hidden={ state != State.Playing }
		></canvas>
	</div>;
}
