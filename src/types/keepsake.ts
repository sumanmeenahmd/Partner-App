export type Language = 'hinglish' | 'en';

export type ShayariPaperTheme = 'alabaster' | 'plum' | 'rosewater' | 'ink';

export type ShayariMood = 'ishq' | 'muskaan' | 'intezaar' | 'waada' | 'yaad';

export type ShayariPhotoLayout = 'none' | 'framed' | 'backdrop';

export interface ShayariItem {
  id: string;
  title: string;
  lines: string;
  mood: ShayariMood;
  theme: ShayariPaperTheme;
  imageUrl?: string;
  photoLayout?: ShayariPhotoLayout;
  createdAt: string;
  isFavorite: boolean;
}

export interface LoveLetter {
  id: string;
  prompt: string;
  body: string;
  signOff: string;
  imageUrl?: string;
  createdAt: string;
  opened: boolean;
}

export interface LoveReason {
  id: string;
  text: string;
}

export interface LoveVoucher {
  id: string;
  title: string;
  detail: string;
  validFor: string;
  redeemed: boolean;
  redeemedAt?: string;
}

export interface MemoryItem {
  id: string;
  dateLabel: string;
  place: string;
  title: string;
  story: string;
  imageUrl?: string;
}

export interface KeepsakeProfile {
  partnerName: string;
  senderName: string;
  milestoneDate: string;
  dedication: string;
}

export interface KeepsakeData {
  profile: KeepsakeProfile;
  shayaris: ShayariItem[];
  letters: LoveLetter[];
  reasons: LoveReason[];
  vouchers: LoveVoucher[];
  memories: MemoryItem[];
}
