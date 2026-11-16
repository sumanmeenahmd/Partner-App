import { MOOD_LABELS, PAPER_THEME_META } from '../data/defaults';
import { Language, ShayariItem } from '../types/keepsake';

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push('');
      continue;
    }
    const words = para.split(' ');
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const imgRatio = img.width / img.height;
  const targetRatio = dw / dh;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgRatio > targetRatio) {
    sw = img.height * targetRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / targetRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

export async function downloadShayariCardPng(
  shayari: ShayariItem,
  senderName: string,
  partnerName: string,
  lang: Language
): Promise<void> {
  const palette = PAPER_THEME_META[shayari.theme];
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const layout = shayari.imageUrl ? shayari.photoLayout || 'framed' : 'none';
  const loadedImg = shayari.imageUrl ? await loadImage(shayari.imageUrl) : null;

  // Base fill
  ctx.fillStyle = palette.canvasBg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let textColor = palette.canvasText;
  let mutedColor = palette.canvasMuted;
  let accentColor = palette.canvasAccent;

  if (layout === 'backdrop' && loadedImg) {
    drawCoverImage(ctx, loadedImg, 0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, 'rgba(18, 12, 16, 0.48)');
    grad.addColorStop(0.5, 'rgba(18, 12, 16, 0.62)');
    grad.addColorStop(1, 'rgba(18, 12, 16, 0.84)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    textColor = '#FFFFFF';
    mutedColor = 'rgba(255, 255, 255, 0.78)';
    accentColor = '#F48CA7';
  }

  // Subtle editorial border frame
  ctx.strokeStyle = mutedColor;
  ctx.globalAlpha = 0.28;
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 64, canvas.width - 128, canvas.height - 128);
  ctx.globalAlpha = 1;

  const moodLabel = MOOD_LABELS[shayari.mood][lang];

  if (layout === 'framed' && loadedImg) {
    // Draw framed photo in upper half
    const frameX = 110;
    const frameY = 120;
    const frameW = canvas.width - 220;
    const frameH = 540;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(frameX, frameY, frameW, frameH, 20);
    ctx.clip();
    drawCoverImage(ctx, loadedImg, frameX, frameY, frameW, frameH);
    ctx.restore();

    ctx.fillStyle = accentColor;
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${moodLabel}  ·  ${shayari.createdAt}`, canvas.width / 2, 725);

    ctx.fillStyle = textColor;
    ctx.font = '700 42px "Noto Serif Devanagari", Georgia, serif';
    ctx.fillText(shayari.title || `For ${partnerName}`, canvas.width / 2, 795);

    ctx.strokeStyle = accentColor;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 44, 830);
    ctx.lineTo(canvas.width / 2 + 44, 830);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = textColor;
    ctx.font = '400 34px "Noto Serif Devanagari", Georgia, serif';
    const wrapped = wrapLines(ctx, shayari.lines, 900);
    let y = 900;
    for (const line of wrapped.slice(0, 7)) {
      ctx.fillText(line, canvas.width / 2, y);
      y += 60;
    }
  } else {
    // Text-only or Full Backdrop
    ctx.fillStyle = accentColor;
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${moodLabel}  ·  ${shayari.createdAt}`, canvas.width / 2, 165);

    ctx.fillStyle = textColor;
    ctx.font = '700 46px "Noto Serif Devanagari", Georgia, serif';
    ctx.fillText(shayari.title || `For ${partnerName}`, canvas.width / 2, 260);

    ctx.strokeStyle = accentColor;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 48, 305);
    ctx.lineTo(canvas.width / 2 + 48, 305);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = textColor;
    ctx.font = '400 40px "Noto Serif Devanagari", Georgia, serif';
    const wrapped = wrapLines(ctx, shayari.lines, 860);
    const lineHeight = 72;
    const totalHeight = wrapped.length * lineHeight;
    let startY = Math.max(410, (canvas.height - totalHeight) / 2 + 20);

    for (const line of wrapped) {
      ctx.fillText(line, canvas.width / 2, startY);
      startY += lineHeight;
    }
  }

  // Signature footer
  ctx.fillStyle = mutedColor;
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  const dedication =
    lang === 'hinglish'
      ? `${senderName} ki taraf se ${partnerName} ke liye`
      : `Written by ${senderName} for ${partnerName}`;
  ctx.fillText(dedication, canvas.width / 2, canvas.height - 155);

  ctx.fillStyle = accentColor;
  ctx.font = '600 22px "Noto Serif Devanagari", Georgia, serif';
  ctx.fillText('Mehfil', canvas.width / 2, canvas.height - 110);

  const link = document.createElement('a');
  const slug = (shayari.title || 'shayari').toLowerCase().replace(/\s+/g, '-').slice(0, 32);
  link.download = `mehfil-${slug}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
