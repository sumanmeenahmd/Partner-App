import { KeepsakeData } from '../types/keepsake';

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64ToUtf8(b64: string): string {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeKeepsakeToUrl(data: KeepsakeData): string {
  // Strip inline base64 uploaded photos if large so share links stay clean and reliable
  const sanitized: KeepsakeData = {
    ...data,
    memories: data.memories.map((m) => ({
      ...m,
      imageUrl:
        m.imageUrl && m.imageUrl.startsWith('data:') && m.imageUrl.length > 8000
          ? undefined
          : m.imageUrl,
    })),
  };
  const payload = utf8ToBase64(JSON.stringify(sanitized));
  const url = new URL(window.location.href);
  url.hash = `gift=${payload}`;
  return url.toString();
}

export function decodeKeepsakeFromHash(): KeepsakeData | null {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#gift=')) return null;
    const raw = hash.slice('#gift='.length);
    if (!raw) return null;
    const parsed = JSON.parse(base64ToUtf8(raw)) as KeepsakeData;
    if (!parsed || !parsed.profile || !Array.isArray(parsed.shayaris)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
