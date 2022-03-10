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
		Inputs.pressedBuffer.push(value);
	}
	public static getReleased(): Array<string> {
		const result = Inputs.releasedBuffer;
		Inputs.releasedBuffer = [];
		return result;
	}
	public static pushReleased(value: string): void {
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
	// const canvasGL = React.useRef<HTMLCanvasElement>(null);
	const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
	// const [gl, setGl] = React.useState<WebGLRenderingContext>();
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
	// useEffect(() => {
	// 	if (canvasGL.current === null)
	// 		return;
	// 	let gl = canvasGL.current.getContext("webgl");
	// 	if (gl === null)
	// 		gl = canvasGL.current.getContext("experimental-webgl") as any;
	// 	if (gl === null)
	// 		return;
	// 	setGl(gl);
	// }, [canvasGL]);
	// useEffect(() => {
	// 	if (gl === undefined)
	// 		return;
	// 	console.log(gl);
	// 	gl.clearColor(.75, .85, .8, 1);
	// 	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	// 	const vertexShaderText = `
	// 		precision mediump float;
	// 		attribute vec2 vertPosition;
	// 		attribute vec3 vertColor;
	// 		varying vec3 fragColor;
	// 		void main() {
	// 			fragColor = vertColor;
	// 			gl_Position = vec4(vertPosition, 0, 1);
	// 		}
	// 	`;
	// 	const fragmentShaderText = `
	// 		precision mediump float;
	// 		varying vec3 fragColor;
	// 		void main() {
	// 			gl_FragColor = vec4(fragColor, 1);
	// 		}
	// 	`;
	// 	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	// 	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	// 	if (vertexShader === null || fragmentShader === null)
	// 		throw new Error("Failed to create shaders");
	// 	gl.shaderSource(vertexShader, vertexShaderText);
	// 	gl.shaderSource(fragmentShader, fragmentShaderText);
	// 	gl.compileShader(vertexShader);
	// 	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
	// 		throw new Error(gl.getShaderInfoLog(vertexShader) ?? "Failed to compile vertex shader");
	// 	gl.compileShader(fragmentShader);
	// 	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
	// 		throw new Error(gl.getShaderInfoLog(fragmentShader) ?? "Failed to compile fragment shader");
	// 	const program = gl.createProgram();
	// 	if (program === null)
	// 		throw new Error("Failed to create program");
	// 	gl.attachShader(program, vertexShader);
	// 	gl.attachShader(program, fragmentShader);
	// 	gl.linkProgram(program);
	// 	if (!gl.getProgramParameter(program, gl.LINK_STATUS))
	// 		throw new Error(gl.getProgramInfoLog(program) ?? "Failed to link program");
	// 	gl.validateProgram(program);
	// 	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
	// 		throw new Error(gl.getProgramInfoLog(program) ?? "Failed to validate program");
	// 	const triangleVertices = new Float32Array([
	// 		  0,  .5,  1, 1,  0,
	// 		-.5, -.5, .7, 0,  1,
	// 		 .5, -.5, .1, 1, .6,
	// 	]);
	// 	const triangleVertexBufferObject = gl.createBuffer();
	// 	if (triangleVertexBufferObject === null)
	// 		throw new Error("Failed to create buffer");
	// 	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	// 	gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
	// 	const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
	// 	const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
	// 	gl.vertexAttribPointer(
	// 		positionAttribLocation,
	// 		2,
	// 		gl.FLOAT,
	// 		false,
	// 		5 * Float32Array.BYTES_PER_ELEMENT,
	// 		0,
	// 	);
	// 	gl.vertexAttribPointer(
	// 		colorAttribLocation,
	// 		3,
	// 		gl.FLOAT,
	// 		false,
	// 		5 * Float32Array.BYTES_PER_ELEMENT,
	// 		2 * Float32Array.BYTES_PER_ELEMENT,
	// 	);
	// 	gl.enableVertexAttribArray(positionAttribLocation);
	// 	gl.enableVertexAttribArray(colorAttribLocation);
	// 	gl.useProgram(program);
	// 	gl.drawArrays(gl.TRIANGLES, 0, 3);
	// }, [gl]);
	return <div className={ styles.container }>
		{/* <canvas
			ref={ canvasGL }
			width={ 800 }
			height={ 600 }
			style={ {
				border: "1px solid black",
			} }
		></canvas> */}
		Hello, World!
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
						// (data: Array<[number, number]>) => {
						// 	if (ctx === undefined)
						// 		return;
						// 	ctx.fillStyle = "#000";
						// 	ctx.fillRect(0, 0, 800, 608);
						// 	ctx.fillStyle = "#F00";
						// 	data.forEach(point => {
						// 		ctx.fillRect(point[0], point[1], 31, 31);
						// 	});
						// },
						ctx,
						Inputs.getPressed,
						Inputs.getReleased,
						(music: any) => {
							console.log("Playing music...", music);
						},
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
