type Radius = number | { tl?: number; tr?: number; br?: number; bl?: number };

export const drawRoundedMedia = (
  ctx: CanvasRenderingContext2D,
  media: HTMLImageElement | HTMLVideoElement,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: Radius = 15
) => {
  const r = normalizeRadii(radius, width, height);

  // Учет HiDPI
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + width - r.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r.tr);
  ctx.lineTo(x + width, y + height - r.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
  ctx.lineTo(x + r.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(media, x, y, width, height);

  ctx.restore();
};

function normalizeRadii(radius: Radius, width: number, height: number) {
  let r = {
    tl: 0,
    tr: 0,
    br: 0,
    bl: 0,
  };

  if (typeof radius === 'number') {
    r = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    r = {
      tl: radius.tl ?? 0,
      tr: radius.tr ?? 0,
      br: radius.br ?? 0,
      bl: radius.bl ?? 0,
    };
  }

  const scale = Math.min(
    1,
    width / (r.tl + r.tr),
    width / (r.bl + r.br),
    height / (r.tl + r.bl),
    height / (r.tr + r.br)
  );

  if (scale < 1) {
    r.tl *= scale;
    r.tr *= scale;
    r.br *= scale;
    r.bl *= scale;
  }

  return r;
}
