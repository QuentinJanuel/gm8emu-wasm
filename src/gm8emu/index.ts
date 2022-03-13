import { IExternal } from "gm8emu-wasm";
import { audio } from "./audio";
import { input } from "./input";

export * from "./audio";
export * from "./input";
export * from "./load";

export const getExternal = function(ctx: CanvasRenderingContext2D): IExternal {
    return {
        verbose: true,
        audio,
        input,
        ctx,
    };
}
