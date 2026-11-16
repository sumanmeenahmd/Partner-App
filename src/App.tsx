import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LettersSection } from './components/LettersSection';
import { PartnerGiftView } from './components/PartnerGiftView';
import { ShayariStudio } from './components/ShayariStudio';
import { VouchersAndMemories } from './components/VouchersAndMemories';
import { DEFAULT_KEEPSAKE_DATA } from './data/defaults';
import {
  KeepsakeData,
  KeepsakeProfile,
  Language,
  LoveLetter,
  LoveVoucher,
  MemoryItem,
  ShayariItem,
} from './types/keepsake';
import { decodeKeepsakeFromHash, encodeKeepsakeToUrl } from './utils/shareCodec';

const STORAGE_KEY = 'mehfil_keepsake_studio_v1';
const LANG_STORAGE_KEY = 'mehfil_lang_v1';

function formatToday(lang: Language): string {
  try {
    return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  } catch {
    return new Date().toLocaleDateString();
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      return saved === 'en' ? 'en' : 'hi';
    } catch {
      return 'hi';
    }
  });

  const [isSharedLinkMode, setIsSharedLinkMode] = useState<boolean>(() => {
    return decodeKeepsakeFromHash() !== null;
  });

  const [giftMode, setGiftMode] = useState<boolean>(() => {
    return decodeKeepsakeFromHash() !== null;
  });

  const [data, setData] = useState<KeepsakeData>(() => {
    const fromHash = decodeKeepsakeFromHash();
    if (fromHash) return fromHash;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as KeepsakeData;
        if (parsed && parsed.profile && Array.isArray(parsed.shayaris)) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_KEEPSAKE_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    if (isSharedLinkMode) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota issues
    }
  }, [data, isSharedLinkMode]);

  const handleUpdateProfile = (profile: KeepsakeProfile) => {
    setData((prev) => ({ ...prev, profile }));
  };

  const handleAddShayari = (item: Omit<ShayariItem, 'id' | 'createdAt'>) => {
    const newItem: ShayariItem = {
      ...item,
      id: `sh-${Date.now()}`,
      createdAt: formatToday(lang),
    };
    setData((prev) => ({ ...prev, shayaris: [newItem, ...prev.shayaris] }));
  };

  const handleUpdateShayari = (updated: ShayariItem) => {
    setData((prev) => ({
      ...prev,
      shayaris: prev.shayaris.map((s) => (s.id === updated.id ? updated : s)),
    }));
  };

  const handleDeleteShayari = (id: string) => {
    setData((prev) => ({
      ...prev,
      shayaris: prev.shayaris.filter((s) => s.id !== id),
    }));
  };

  const handleToggleShayariFavorite = (id: string) => {
    setData((prev) => ({
      ...prev,
      shayaris: prev.shayaris.map((s) =>
        s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
      ),
    }));
  };

  const handleAddLetter = (letter: Omit<LoveLetter, 'id' | 'createdAt' | 'opened'>) => {
    const newLetter: LoveLetter = {
      ...letter,
      id: `lt-${Date.now()}`,
      createdAt: formatToday(lang),
      opened: false,
    };
    setData((prev) => ({ ...prev, letters: [newLetter, ...prev.letters] }));
  };

  const handleDeleteLetter = (id: string) => {
    setData((prev) => ({
      ...prev,
      letters: prev.letters.filter((l) => l.id !== id),
    }));
  };

  const handleOpenLetter = (id: string) => {
    setData((prev) => ({
      ...prev,
      letters: prev.letters.map((l) => (l.id === id ? { ...l, opened: true } : l)),
    }));
  };

  const handleAddReason = (text: string) => {
    setData((prev) => ({
      ...prev,
      reasons: [...prev.reasons, { id: `rs-${Date.now()}`, text }],
    }));
  };

  const handleDeleteReason = (id: string) => {
    setData((prev) => ({
      ...prev,
      reasons: prev.reasons.filter((r) => r.id !== id),
    }));
  };

  const handleAddVoucher = (voucher: Omit<LoveVoucher, 'id' | 'redeemed'>) => {
    const newVoucher: LoveVoucher = {
      ...voucher,
      id: `vc-${Date.now()}`,
      redeemed: false,
    };
    setData((prev) => ({ ...prev, vouchers: [newVoucher, ...prev.vouchers] }));
  };

  const handleDeleteVoucher = (id: string) => {
    setData((prev) => ({
      ...prev,
      vouchers: prev.vouchers.filter((v) => v.id !== id),
    }));
  };

  const handleRedeemVoucher = (id: string) => {
    setData((prev) => ({
      ...prev,
      vouchers: prev.vouchers.map((v) =>
        v.id === id ? { ...v, redeemed: true, redeemedAt: formatToday(lang) } : v
      ),
    }));
  };

  const handleResetVoucher = (id: string) => {
    setData((prev) => ({
      ...prev,
      vouchers: prev.vouchers.map((v) =>
        v.id === id ? { ...v, redeemed: false, redeemedAt: undefined } : v
      ),
    }));
  };

  const handleAddMemory = (memory: Omit<MemoryItem, 'id'>) => {
    const newMemory: MemoryItem = {
      ...memory,
      id: `mm-${Date.now()}`,
    };
    setData((prev) => ({ ...prev, memories: [newMemory, ...prev.memories] }));
  };

  const handleDeleteMemory = (id: string) => {
    setData((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
  };

  const handleCopyShareLink = async (): Promise<boolean> => {
    try {
      const shareUrl = encodeKeepsakeToUrl(data);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        return true;
      }
      window.location.hash = new URL(shareUrl).hash;
      return true;
    } catch {
      return false;
    }
  };

  if (giftMode) {
    return (
      <PartnerGiftView
        lang={lang}
        data={data}
        isSharedLinkMode={isSharedLinkMode}
        onExitGiftMode={() => {
          setGiftMode(false);
          if (isSharedLinkMode) {
            setIsSharedLinkMode(false);
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        onToggleShayariFavorite={handleToggleShayariFavorite}
        onRedeemVoucher={handleRedeemVoucher}
        onOpenLetter={handleOpenLetter}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F9] text-[#1B1518]">
      <Header lang={lang} onOpenGift={() => setGiftMode(true)} />

      <main>
        <HeroSection
          lang={lang}
          onChangeLang={setLang}
          data={data}
          onUpdateProfile={handleUpdateProfile}
          onCopyShareLink={handleCopyShareLink}
        />

        <ShayariStudio
          lang={lang}
          shayaris={data.shayaris}
          partnerName={data.profile.partnerName}
          senderName={data.profile.senderName}
          onAddShayari={handleAddShayari}
          onUpdateShayari={handleUpdateShayari}
          onDeleteShayari={handleDeleteShayari}
          onToggleFavorite={handleToggleShayariFavorite}
        />

        <LettersSection
          lang={lang}
          letters={data.letters}
          reasons={data.reasons}
          partnerName={data.profile.partnerName}
          onAddLetter={handleAddLetter}
          onDeleteLetter={handleDeleteLetter}
          onAddReason={handleAddReason}
          onDeleteReason={handleDeleteReason}
        />

        <VouchersAndMemories
          lang={lang}
          vouchers={data.vouchers}
          memories={data.memories}
          onAddVoucher={handleAddVoucher}
          onDeleteVoucher={handleDeleteVoucher}
          onResetVoucher={handleResetVoucher}
          onAddMemory={handleAddMemory}
          onDeleteMemory={handleDeleteMemory}
        />
      </main>

      <footer className="border-t border-[#E6DFE3] py-8 mt-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B5E65]">
          <span className="font-serif text-sm font-semibold text-[#1B1518]">Mehfil</span>
          <span>
            {lang === 'hi'
              ? `${data.profile.senderName} और ${data.profile.partnerName} की यादों का कोना`
              : `A private keepsake created by ${data.profile.senderName} for ${data.profile.partnerName}`}
          </span>
          <button
            type="button"
            onClick={() => setGiftMode(true)}
            className="font-medium text-[#C81E4C] hover:underline underline-offset-4 cursor-pointer"
          >
            {lang === 'hi' ? 'पार्टनर व्यू खोलें' : 'Open Partner Gift View'}
          </button>
        </div>
      </footer>
    </div>
  );
}
