import { IExternal } from "wasm";
import { audio } from "./audio";
import { input } from "./input";

export const external: IExternal = {
    verbose: true,
    audio,
    input,
};
