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
}
