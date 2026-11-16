import { useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Download,
  Edit2,
  Heart,
  ImagePlus,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  ASSET_IMAGES,
  MOOD_LABELS,
  PAPER_THEME_META,
  POETIC_STARTERS,
  RHYME_LEXICON,
} from '../data/defaults';
import {
  Language,
  ShayariItem,
  ShayariMood,
  ShayariPaperTheme,
  ShayariPhotoLayout,
} from '../types/keepsake';
import { downloadShayariCardPng } from '../utils/canvasExport';
import { resizeImageFile } from '../utils/imageHelper';
import { ResilientImage } from './ResilientImage';

interface ShayariStudioProps {
  lang: Language;
  shayaris: ShayariItem[];
  partnerName: string;
  senderName: string;
  onAddShayari: (item: Omit<ShayariItem, 'id' | 'createdAt'>) => void;
  onUpdateShayari: (item: ShayariItem) => void;
  onDeleteShayari: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const MOODS: ShayariMood[] = ['ishq', 'muskaan', 'intezaar', 'waada', 'yaad'];
const THEMES: ShayariPaperTheme[] = ['alabaster', 'rosewater', 'plum', 'ink'];

export function ShayariStudio({
  lang,
  shayaris,
  partnerName,
  senderName,
  onAddShayari,
  onUpdateShayari,
  onDeleteShayari,
  onToggleFavorite,
}: ShayariStudioProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [lines, setLines] = useState('');
  const [mood, setMood] = useState<ShayariMood>('ishq');
  const [theme, setTheme] = useState<ShayariPaperTheme>('alabaster');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [photoLayout, setPhotoLayout] = useState<ShayariPhotoLayout>('framed');
  const [showLexicon, setShowLexicon] = useState(false);
  const [filterMood, setFilterMood] = useState<'all' | ShayariMood>('all');
  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedWhatsAppId, setCopiedWhatsAppId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeTheme = PAPER_THEME_META[theme];

  const handleReset = () => {
    setEditingId(null);
    setTitle('');
    setLines('');
    setMood('ishq');
    setTheme('alabaster');
    setImageUrl(undefined);
    setPhotoLayout('framed');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await resizeImageFile(file, 720, 0.78);
      setImageUrl(compressed);
      if (photoLayout === 'none') {
        setPhotoLayout('framed');
      }
    } catch {
      // ignore invalid file
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLines = lines.trim();
    if (!trimmedLines) return;
    const finalTitle =
      title.trim() || (lang === 'hinglish' ? `${partnerName} Ke Naam` : `For ${partnerName}`);
    const finalLayout: ShayariPhotoLayout = imageUrl
      ? photoLayout === 'none'
        ? 'framed'
        : photoLayout
      : 'none';

    if (editingId) {
      const existing = shayaris.find((s) => s.id === editingId);
      if (existing) {
        onUpdateShayari({
          ...existing,
          title: finalTitle,
          lines: trimmedLines,
          mood,
          theme,
          imageUrl,
          photoLayout: finalLayout,
        });
      }
      setEditingId(null);
    } else {
      onAddShayari({
        title: finalTitle,
        lines: trimmedLines,
        mood,
        theme,
        imageUrl,
        photoLayout: finalLayout,
        isFavorite: false,
      });
    }

    setTitle('');
    setLines('');
    setImageUrl(undefined);
    setPhotoLayout('framed');
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2200);
  };

  const handleStartEdit = (item: ShayariItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setLines(item.lines);
    setMood(item.mood);
    setTheme(item.theme);
    setImageUrl(item.imageUrl);
    setPhotoLayout(item.photoLayout || (item.imageUrl ? 'framed' : 'none'));
    const el = document.getElementById('shayari-composer');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCopyWhatsApp = async (item: ShayariItem) => {
    const formatted = `*${item.title}*\n\n${item.lines}\n\n— ${senderName} ki taraf se ${partnerName} ke liye`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedWhatsAppId(item.id);
      window.setTimeout(() => setCopiedWhatsAppId(null), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const insertWord = (word: string) => {
    setLines((prev) =>
      prev ? `${prev}${prev.endsWith('\n') || prev.endsWith(' ') ? '' : ' '}${word}` : word
    );
  };

  const previewLayout: ShayariPhotoLayout = imageUrl
    ? photoLayout === 'none'
      ? 'framed'
      : photoLayout
    : 'none';

  const previewItem: ShayariItem = {
    id: editingId || 'preview',
    title:
      title.trim() ||
      (lang === 'hinglish' ? 'Tumhari Shayari Ka Title' : 'Your Shayari Title'),
    lines:
      lines.trim() ||
      (lang === 'hinglish'
        ? 'Tumhari yaadon ka mausam kuch is tarah chhaya hai,\nHar lafz mein aaj phir tumhara naam aaya hai.'
        : 'Every quiet line written here carries a piece of your warmth,\nTurning ordinary evenings into poetry.'),
    mood,
    theme,
    imageUrl,
    photoLayout: previewLayout,
    createdAt: lang === 'hinglish' ? 'Aaj' : 'Today',
    isFavorite: false,
  };

  const filteredShayaris =
    filterMood === 'all' ? shayaris : shayaris.filter((s) => s.mood === filterMood);

  return (
    <section id="shayari-studio" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-[#C81E4C] mb-2">
              {lang === 'hinglish' ? '01. Shayari + Photo Studio' : '01. Shayari Studio'}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1B1518] [text-wrap:balance]">
              {lang === 'hinglish'
                ? 'Apni shayari likho aur usi card mein photo lagao'
                : 'Write Your Shayari & Attach Your Photo'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowLexicon((v) => !v)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#1B1518] bg-white border border-[#DED5DA] hover:border-[#C81E4C]/50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C81E4C]" />
            <span>
              {showLexicon
                ? lang === 'hinglish'
                  ? 'Words Helper Band Karo'
                  : 'Hide Poetic Words'
                : lang === 'hinglish'
                  ? 'Shayari Words & Ideas'
                  : 'Poetic Words & Starters'}
            </span>
          </button>
        </div>

        {/* Optional Poetic Lexicon & Starters Helper */}
        {showLexicon && (
          <div className="mb-8 p-5 bg-white border border-[#E6DFE3] rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-[#1B1518]">
              {lang === 'hinglish'
                ? 'Click karke pyare words ya starting lines apni shayari mein add karo:'
                : 'Click a poetic word or starter line to insert into your draft:'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {RHYME_LEXICON.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => insertWord(word)}
                  className="px-3 py-1.5 text-xs font-serif text-[#1B1518] bg-[#FAF8F9] border border-[#E6DFE3] hover:border-[#C81E4C] rounded-md transition-colors cursor-pointer"
                >
                  + {word}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#F0EAEF]">
              {POETIC_STARTERS.map((starter, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMood(starter.mood);
                    setLines(lang === 'hinglish' ? starter.hinglish : starter.en);
                  }}
                  className="text-left p-3 rounded-lg bg-[#FAF8F9] border border-[#E6DFE3] hover:border-[#C81E4C] transition-colors cursor-pointer"
                >
                  <div className="text-xs text-[#C81E4C] mb-1">
                    {MOOD_LABELS[starter.mood][lang]}
                  </div>
                  <div className="font-serif text-sm text-[#1B1518] whitespace-pre-line">
                    {lang === 'hinglish' ? starter.hinglish : starter.en}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Split Workspace: Composer + Live Card Preview */}
        <div
          id="shayari-composer"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left: Editor Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-6 bg-white border border-[#E6DFE3] rounded-2xl p-6 flex flex-col justify-between gap-5"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hinglish' ? 'Shayari Ka Title' : 'Shayari Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  placeholder={
                    lang === 'hinglish'
                      ? 'Jaise: Pehli Baarish Aur Tum'
                      : 'e.g. Evening Tea & Your Smile'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hinglish' ? 'Mood Select Karo' : 'Mood'}
                </span>
                <div className="flex flex-wrap gap-1.5 p-1 bg-[#F3EEF2] rounded-lg">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        mood === m
                          ? 'bg-white text-[#1B1518] shadow-xs'
                          : 'text-[#6B5E65] hover:text-[#1B1518]'
                      }`}
                    >
                      {MOOD_LABELS[m][lang]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hinglish' ? 'Apni Shayari Yahan Likho' : 'Write Your Shayari Lines'}
                </label>
                <textarea
                  rows={5}
                  required
                  value={lines}
                  onChange={(e) => setLines(e.target.value)}
                  maxLength={800}
                  placeholder={
                    lang === 'hinglish'
                      ? 'Apne dil ki lines yahan likho (Hinglish, English ya Hindi mein)...'
                      : 'Write your couplets or poem lines here...'
                  }
                  className="w-full px-4 py-3 font-serif text-base leading-relaxed bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C] resize-y"
                />
              </div>

              {/* Photo Attachment & Layout Controls */}
              <div className="p-4 rounded-xl bg-[#FAF8F9] border border-[#E6DFE3] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[#1B1518]">
                    {lang === 'hinglish'
                      ? 'Card Mein Photo Lagao (Optional)'
                      : 'Attach Photo to Card (Optional)'}
                  </span>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl(undefined)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#C81E4C] hover:underline cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{lang === 'hinglish' ? 'Photo Hatao' : 'Remove Photo'}</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1B1518] hover:bg-[#31262C] rounded-lg transition-colors cursor-pointer"
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>{lang === 'hinglish' ? 'Gallery Se Photo Lagao' : 'Upload Photo'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(ASSET_IMAGES.teaEvening);
                      if (photoLayout === 'none') setPhotoLayout('framed');
                    }}
                    className="px-2.5 py-1.5 text-xs text-[#5A4E54] bg-white border border-[#DED5DA] hover:border-[#C81E4C] rounded-lg cursor-pointer"
                  >
                    {lang === 'hinglish' ? 'Chai Evening' : 'Chai Preset'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(ASSET_IMAGES.starlightLantern);
                      if (photoLayout === 'none') setPhotoLayout('framed');
                    }}
                    className="px-2.5 py-1.5 text-xs text-[#5A4E54] bg-white border border-[#DED5DA] hover:border-[#C81E4C] rounded-lg cursor-pointer"
                  >
                    {lang === 'hinglish' ? 'Lantern Night' : 'Lantern Preset'}
                  </button>
                </div>

                {imageUrl && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-[#6B5E65]">
                      {lang === 'hinglish' ? 'Photo Style:' : 'Photo Layout:'}
                    </span>
                    <div className="inline-flex p-1 bg-[#EFEAEF] rounded-lg">
                      <button
                        type="button"
                        onClick={() => setPhotoLayout('framed')}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                          photoLayout !== 'backdrop'
                            ? 'bg-white text-[#1B1518] shadow-xs'
                            : 'text-[#6B5E65]'
                        }`}
                      >
                        {lang === 'hinglish' ? 'Photo Upar' : 'Photo Top'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoLayout('backdrop')}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                          photoLayout === 'backdrop'
                            ? 'bg-white text-[#1B1518] shadow-xs'
                            : 'text-[#6B5E65]'
                        }`}
                      >
                        {lang === 'hinglish' ? 'Photo Background' : 'Full Backdrop'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <span className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hinglish' ? 'Card Theme' : 'Card Paper Style'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors text-center whitespace-nowrap truncate cursor-pointer ${
                        theme === t
                          ? 'border-[#C81E4C] bg-[#FDF4F6] text-[#1B1518]'
                          : 'border-[#E6DFE3] bg-white text-[#6B5E65] hover:border-[#C81E4C]/40'
                      }`}
                    >
                      {PAPER_THEME_META[t].label[lang]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F0EAEF]">
              <div>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3.5 py-2 text-xs font-medium text-[#6B5E65] hover:text-[#1B1518] cursor-pointer"
                  >
                    {lang === 'hinglish' ? 'Naya Likho' : 'Cancel Edit'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {savedNotice && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#C81E4C]">
                    <Check className="w-3.5 h-3.5" />
                    {lang === 'hinglish' ? 'Save Ho Gaya!' : 'Saved!'}
                  </span>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#C81E4C] hover:bg-[#AD1740] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {editingId
                      ? lang === 'hinglish'
                        ? 'Changes Save Karo'
                        : 'Save Changes'
                      : lang === 'hinglish'
                        ? 'Shayari Save Karo'
                        : 'Save Shayari'}
                  </span>
                </button>
              </div>
            </div>
          </form>

          {/* Right: Live Typeset Card Preview */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {previewLayout === 'backdrop' && previewItem.imageUrl ? (
              <div className="relative flex-1 min-h-[460px] rounded-2xl overflow-hidden border border-[#E6DFE3] flex flex-col justify-between p-8 md:p-10 text-white">
                <ResilientImage
                  src={previewItem.imageUrl}
                  alt={previewItem.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex items-center justify-between text-xs text-white/80">
                  <span>
                    {MOOD_LABELS[mood][lang]}
                    <span aria-hidden="true" className="mx-1.5">·</span>
                    {lang === 'hinglish' ? 'Live Preview' : 'Live Preview'}
                  </span>
                  <span className="font-serif">Mehfil</span>
                </div>

                <div className="relative z-10 my-8 text-center space-y-5">
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-white">
                    {previewItem.title}
                  </h3>
                  <div className="w-12 h-px mx-auto bg-[#F48CA7]" />
                  <p className="font-serif text-base md:text-lg leading-[1.9] whitespace-pre-line max-w-md mx-auto text-white">
                    {previewItem.lines}
                  </p>
                </div>

                <div className="relative z-10 text-center text-xs pt-4 border-t border-white/20 text-white/85">
                  {lang === 'hinglish'
                    ? `${senderName} ki taraf se ${partnerName} ke liye`
                    : `Written by ${senderName} for ${partnerName}`}
                </div>
              </div>
            ) : (
              <div
                className={`flex-1 rounded-2xl border overflow-hidden flex flex-col justify-between transition-colors ${activeTheme.bgClass} ${activeTheme.borderClass}`}
              >
                {previewLayout === 'framed' && previewItem.imageUrl && (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-[#EFEAEF]">
                    <ResilientImage
                      src={previewItem.imageUrl}
                      alt={previewItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-7 md:p-9 flex-1 flex flex-col justify-between gap-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className={activeTheme.mutedClass}>
                      {MOOD_LABELS[mood][lang]}
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      {lang === 'hinglish' ? 'Live Preview' : 'Live Preview'}
                    </span>
                    <span className={`font-serif ${activeTheme.mutedClass}`}>Mehfil</span>
                  </div>

                  <div className="text-center space-y-4">
                    <h3
                      className={`font-serif text-xl md:text-2xl font-bold ${activeTheme.textClass}`}
                    >
                      {previewItem.title}
                    </h3>
                    <div className="w-12 h-px mx-auto bg-[#C81E4C]/50" />
                    <p
                      className={`font-serif text-base md:text-lg leading-[1.9] whitespace-pre-line max-w-md mx-auto ${activeTheme.textClass}`}
                    >
                      {previewItem.lines}
                    </p>
                  </div>

                  <div
                    className={`text-center text-xs pt-4 border-t border-current/10 ${activeTheme.mutedClass}`}
                  >
                    {lang === 'hinglish'
                      ? `${senderName} ki taraf se ${partnerName} ke liye`
                      : `Written by ${senderName} for ${partnerName}`}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <p className="text-xs text-[#6B5E65]">
                {lang === 'hinglish'
                  ? 'WhatsApp par bhejne ke liye PNG download ya text copy karo'
                  : 'Export this photo + shayari card as PNG or copy text'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyWhatsApp(previewItem)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1B1518] bg-white border border-[#DED5DA] hover:border-[#C81E4C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedWhatsAppId === previewItem.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C81E4C]" />
                      <span>{lang === 'hinglish' ? 'Text Copy Hua' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#6B5E65]" />
                      <span>{lang === 'hinglish' ? 'WhatsApp Text' : 'Copy Text'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    void downloadShayariCardPng(previewItem, senderName, partnerName, lang)
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1B1518] bg-white border border-[#DED5DA] hover:border-[#C81E4C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#C81E4C]" />
                  <span>{lang === 'hinglish' ? 'Download PNG' : 'Download PNG'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Anthology Collection Grid */}
        <div className="mt-14 pt-10 border-t border-[#E6DFE3]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="font-serif text-xl font-bold text-[#1B1518]">
              {lang === 'hinglish'
                ? `Saved Shayari (${filteredShayaris.length})`
                : `Saved Shayari Anthology (${filteredShayaris.length})`}
            </h3>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EFEAEF] rounded-lg">
              <button
                type="button"
                onClick={() => setFilterMood('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterMood === 'all'
                    ? 'bg-white text-[#1B1518] shadow-xs'
                    : 'text-[#6B5E65] hover:text-[#1B1518]'
                }`}
              >
                {lang === 'hinglish' ? 'All' : 'All'}
              </button>
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFilterMood(m)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filterMood === m
                      ? 'bg-white text-[#1B1518] shadow-xs'
                      : 'text-[#6B5E65] hover:text-[#1B1518]'
                  }`}
                >
                  {MOOD_LABELS[m][lang]}
                </button>
              ))}
            </div>
          </div>

          {filteredShayaris.length === 0 ? (
            <div className="p-10 bg-white border border-[#E6DFE3] rounded-2xl text-center">
              <p className="font-serif text-base text-[#1B1518] mb-1">
                {lang === 'hinglish'
                  ? 'Is mood mein abhi koi shayari nahi hai.'
                  : 'No Shayari in this mood yet.'}
              </p>
              <p className="text-xs text-[#6B5E65]">
                {lang === 'hinglish'
                  ? 'Upar wale studio se apni pehli shayari + photo add karo.'
                  : 'Use the composer above to write your first couplet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShayaris.map((item) => {
                const pTheme = PAPER_THEME_META[item.theme];
                const layout = item.imageUrl ? item.photoLayout || 'framed' : 'none';

                return (
                  <article
                    key={item.id}
                    className={`rounded-2xl border overflow-hidden flex flex-col justify-between ${
                      layout === 'backdrop'
                        ? 'relative text-white border-[#E6DFE3] min-h-[360px]'
                        : `${pTheme.bgClass} ${pTheme.borderClass}`
                    }`}
                  >
                    {layout === 'backdrop' && item.imageUrl && (
                      <>
                        <ResilientImage
                          src={item.imageUrl}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40"
                          aria-hidden="true"
                        />
                      </>
                    )}

                    {layout === 'framed' && item.imageUrl && (
                      <div className="aspect-[16/10] w-full overflow-hidden bg-[#EFEAEF]">
                        <ResilientImage
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className={`p-6 flex-1 flex flex-col justify-between gap-6 ${
                        layout === 'backdrop' ? 'relative z-10' : ''
                      }`}
                    >
                      <div>
                        <div
                          className={`text-xs mb-3 ${
                            layout === 'backdrop' ? 'text-white/75' : pTheme.mutedClass
                          }`}
                        >
                          <span>{MOOD_LABELS[item.mood][lang]}</span>
                          <span aria-hidden="true" className="mx-1.5">·</span>
                          <span>{item.createdAt}</span>
                        </div>
                        <h4
                          className={`font-serif text-lg font-bold mb-3 ${
                            layout === 'backdrop' ? 'text-white' : pTheme.textClass
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p
                          className={`font-serif text-sm leading-[1.85] whitespace-pre-line ${
                            layout === 'backdrop' ? 'text-white/95' : pTheme.textClass
                          }`}
                        >
                          {item.lines}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-current/15 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onToggleFavorite(item.id)}
                            aria-label="Toggle favorite"
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              item.isFavorite
                                ? 'text-[#F48CA7]'
                                : layout === 'backdrop'
                                  ? 'text-white/75 hover:text-white'
                                  : `${pTheme.mutedClass} hover:text-[#C81E4C]`
                            }`}
                          >
                            <Heart
                              className="w-4 h-4"
                              fill={item.isFavorite ? 'currentColor' : 'none'}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyWhatsApp(item)}
                            aria-label="Copy WhatsApp text"
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              copiedWhatsAppId === item.id
                                ? 'text-[#C81E4C]'
                                : layout === 'backdrop'
                                  ? 'text-white/75 hover:text-white'
                                  : `${pTheme.mutedClass} hover:text-[#C81E4C]`
                            }`}
                          >
                            {copiedWhatsAppId === item.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              void downloadShayariCardPng(item, senderName, partnerName, lang)
                            }
                            aria-label="Download PNG"
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              layout === 'backdrop'
                                ? 'text-white/75 hover:text-white'
                                : `${pTheme.mutedClass} hover:text-[#C81E4C]`
                            }`}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            aria-label="Edit"
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              layout === 'backdrop'
                                ? 'text-white/75 hover:text-white'
                                : `${pTheme.mutedClass} hover:text-[#C81E4C]`
                            }`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>

                        {confirmDeleteId === item.id ? (
                          <div className="flex items-center gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteShayari(item.id);
                                setConfirmDeleteId(null);
                              }}
                              className="font-semibold text-[#F48CA7] hover:underline cursor-pointer"
                            >
                              {lang === 'hinglish' ? 'Delete' : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className={`${
                                layout === 'backdrop' ? 'text-white/75' : pTheme.mutedClass
                              } hover:underline cursor-pointer`}
                            >
                              {lang === 'hinglish' ? 'No' : 'Cancel'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(item.id)}
                            aria-label="Delete"
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              layout === 'backdrop'
                                ? 'text-white/75 hover:text-white'
                                : `${pTheme.mutedClass} hover:text-[#C81E4C]`
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
