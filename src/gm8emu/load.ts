export const load = async function (): Promise<Uint8Array> {
	const file: File = await new Promise(resolve => {
		const input = document.createElement("input");
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
	const buffer = await file.arrayBuffer();
	return new Uint8Array(buffer);
}
