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

export function encodeKeepsakeToUrl(data: KeepsakeData): { url: string; strippedPhotos: number } {
  let strippedPhotos = 0;

  // Keep built-in asset URLs; only strip large uploaded data URLs if total size would break browser URL limits
  const fullPayload = utf8ToBase64(JSON.stringify(data));
  let finalData = data;

  if (fullPayload.length > 24000) {
    finalData = {
      ...data,
      shayaris: data.shayaris.map((s) => {
        if (s.imageUrl && s.imageUrl.startsWith('data:') && s.imageUrl.length > 6000) {
          strippedPhotos += 1;
          return { ...s, imageUrl: undefined, photoLayout: 'none' };
        }
        return s;
      }),
      letters: data.letters.map((l) => {
        if (l.imageUrl && l.imageUrl.startsWith('data:') && l.imageUrl.length > 6000) {
          strippedPhotos += 1;
          return { ...l, imageUrl: undefined };
        }
        return l;
      }),
      memories: data.memories.map((m) => {
        if (m.imageUrl && m.imageUrl.startsWith('data:') && m.imageUrl.length > 6000) {
          strippedPhotos += 1;
          return { ...m, imageUrl: undefined };
        }
        return m;
      }),
    };
  }

  const payload = utf8ToBase64(JSON.stringify(finalData));
  const url = new URL(window.location.href);
  url.hash = `gift=${payload}`;
  return { url: url.toString(), strippedPhotos };
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
