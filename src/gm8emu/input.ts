import { IKey, IInput } from "gm8emu-wasm";

export class Inputs {
	private static pressedBuffer: Array<IKey> = [];
	private static releasedBuffer: Array<IKey> = [];
	public static getPressed(): Array<IKey> {
		const result = Inputs.pressedBuffer;
		Inputs.pressedBuffer = [];
		return result;
	}
	public static pushPressed(value: IKey): void {
		Inputs.pressedBuffer.push(value);
	}
	public static getReleased(): Array<IKey> {
		const result = Inputs.releasedBuffer;
		Inputs.releasedBuffer = [];
		return result;
	}
	public static pushReleased(value: IKey): void {
		Inputs.releasedBuffer.push(value);
	}
	// 
	private static pressedJS: { [key: string]: boolean | undefined } = {};
	public static setPressedJS(key: IKey, value: boolean): void {
		Inputs.pressedJS[key] = value;
	}
	public static getPressedJS(key: IKey): boolean {
		return Inputs.pressedJS[key] ?? false;
	}
	// 
	private static getKey(ev_key: string): IKey | undefined {
		if (ev_key == "Shift")
			return "Shift";
		if (ev_key == "ArrowLeft")
			return "Left";
		if (ev_key == "ArrowRight")
			return "Right";
		if (ev_key == "r")
			return "R";
		return undefined;
	}
	public static onKeyDown(ev_key: string): void {
		const key = Inputs.getKey(ev_key);
		if (!key)
			return;
		if (Inputs.getPressedJS(key))
			return;
		Inputs.setPressedJS(key, true);
		Inputs.pushPressed(key);
	}
	public static onKeyUp(ev_key: string): void {
		const key = Inputs.getKey(ev_key);
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
