import { IInput } from "gm8emu-wasm";

export class Inputs {
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
	// 
	public static onKeyDown(key: string): void {
		if (!key)
			return;
		if (Inputs.getPressedJS(key))
			return;
		Inputs.setPressedJS(key, true);
		Inputs.pushPressed(key);
	}
	public static onKeyUp(key: string): void {
		if (!key)
			return;
		Inputs.setPressedJS(key, false);
		Inputs.pushReleased(key);
	}
}

export const input: IInput = {
	pressed: Inputs.getPressed,
	released: Inputs.getReleased,
};
