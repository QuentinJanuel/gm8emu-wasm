import React, { useEffect } from "react";
import { init, run } from "gm8emu-wasm";

import { getExternal, load, Inputs } from "../gm8emu";

import styles from "./index.module.scss";

export const App = function () {
	const canvas = React.useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
	const [ready, setReady] = React.useState(false);
	useEffect(() => {
		if (!ctx)
			return;
		if (ready)
			return;
		init(getExternal(ctx));
		setReady(true);
	}, [ctx]);
	useEffect(() => {
		setCtx(canvas.current?.getContext("2d") ?? undefined);
	}, [canvas]);
	return <div className={ styles.container }>
		<button
			onClick={ () => {
				(async () => {
					if (!ready)
						return;
					const data = await load();
					console.log("Running...");
					console.log(await run(data));
				})()
				.catch(console.error);
			} }
		>Load file</button>
		<canvas
			ref={ canvas }
			width={ 800 }
			height={ 608 }
			style={ { border: "1px solid black" } }
			onKeyDown={ e => Inputs.onKeyDown(e.key) }
			onKeyUp={ e => Inputs.onKeyUp(e.key) }
			tabIndex={ 0 }
		></canvas>
	</div>;
}
