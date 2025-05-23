import type { LoadedSource } from "./loadSources";

export const scaleMedia = (ctx: CanvasRenderingContext2D, loadedSource: LoadedSource): LoadedSource => {
    if (loadedSource.type === 'video') {
        const height = ctx.canvas.width / loadedSource.width * loadedSource.height / window.devicePixelRatio;
        

        return {
            type: loadedSource.type,
            media: loadedSource.media,
            height,
            width: loadedSource.width / window.devicePixelRatio,
            posterImg: loadedSource.posterImg ? scaleMedia(ctx, loadedSource.posterImg) : undefined,
            outlineImg: loadedSource.outlineImg ? scaleMedia(ctx, loadedSource.outlineImg) : undefined
        }
    } 

    const height = ctx.canvas.width / loadedSource.width * loadedSource.height / window.devicePixelRatio;

    return {
        type: loadedSource.type,
        media: loadedSource.media,
        height,
        width: loadedSource.width / window.devicePixelRatio,
    }
}

export const scaleBackgroundImg = (ctx: CanvasRenderingContext2D, loadedSource: LoadedSource): LoadedSource => {
    const width = loadedSource.width / window.devicePixelRatio;

    return {
        type: loadedSource.type,
        media: loadedSource.media,
        width,
        height: ctx.canvas.height / window.devicePixelRatio,
    }
}