import type { LoadedSource } from "./loadSources";

export const scaleMedia = (ctx: CanvasRenderingContext2D, loadedSource: LoadedSource) => {
    if (loadedSource.type === 'video') {
        const height = ctx.canvas.width / loadedSource.width * loadedSource.height / window.devicePixelRatio;
        
        return {
            media: loadedSource.media,
            height,
            width: loadedSource.width / window.devicePixelRatio,
            outlineImg: loadedSource.outlineImg ? scaleMedia(ctx, loadedSource.outlineImg) : undefined
        }
    } 

    const height = ctx.canvas.width / loadedSource.width * loadedSource.height / window.devicePixelRatio;

    return {
        media: loadedSource.media,
        height,
        width: loadedSource.width / window.devicePixelRatio,
    }
}
