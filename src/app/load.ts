export const load = function (): Promise<File> {
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
