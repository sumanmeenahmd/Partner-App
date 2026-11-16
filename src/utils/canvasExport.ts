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

export function downloadShayariCardPng(
  shayari: ShayariItem,
  senderName: string,
  partnerName: string,
  lang: Language
): void {
  const palette = PAPER_THEME_META[shayari.theme];
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Paper background
  ctx.fillStyle = palette.canvasBg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle editorial double frame
  ctx.strokeStyle = palette.canvasMuted;
  ctx.globalAlpha = 0.28;
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 64, canvas.width - 128, canvas.height - 128);
  ctx.globalAlpha = 0.14;
  ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160);
  ctx.globalAlpha = 1;

  // Top mood kicker
  ctx.fillStyle = palette.canvasAccent;
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  const moodLabel = MOOD_LABELS[shayari.mood][lang];
  ctx.fillText(`${moodLabel}  ·  ${shayari.createdAt}`, canvas.width / 2, 165);

  // Title
  ctx.fillStyle = palette.canvasText;
  ctx.font = '700 46px "Noto Serif Devanagari", Georgia, serif';
  ctx.fillText(shayari.title || (lang === 'hi' ? 'तुम्हारे नाम' : 'For You'), canvas.width / 2, 260);

  // Thin rule
  ctx.strokeStyle = palette.canvasAccent;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 48, 305);
  ctx.lineTo(canvas.width / 2 + 48, 305);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Shayari poetry lines
  ctx.fillStyle = palette.canvasText;
  ctx.font = '400 40px "Noto Serif Devanagari", Georgia, serif';
  const wrapped = wrapLines(ctx, shayari.lines, 860);
  const lineHeight = 74;
  const totalHeight = wrapped.length * lineHeight;
  let startY = Math.max(410, (canvas.height - totalHeight) / 2 + 20);

  for (const line of wrapped) {
    ctx.fillText(line, canvas.width / 2, startY);
    startY += lineHeight;
  }

  // Signature footer
  ctx.fillStyle = palette.canvasMuted;
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  const dedication =
    lang === 'hi'
      ? `${senderName} की ओर से ${partnerName} के नाम`
      : `Written by ${senderName} for ${partnerName}`;
  ctx.fillText(dedication, canvas.width / 2, canvas.height - 170);

  ctx.fillStyle = palette.canvasAccent;
  ctx.font = '600 22px "Noto Serif Devanagari", Georgia, serif';
  ctx.fillText('Mehfil', canvas.width / 2, canvas.height - 122);

  const link = document.createElement('a');
  const slug = (shayari.title || 'shayari').toLowerCase().replace(/\s+/g, '-').slice(0, 32);
  link.download = `mehfil-${slug}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
