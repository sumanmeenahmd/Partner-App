import { useState } from 'react';
import { BookOpen, Check, Download, Edit2, Heart, Plus, Trash2 } from 'lucide-react';
import {
  MOOD_LABELS,
  PAPER_THEME_META,
  POETIC_STARTERS,
  RHYME_LEXICON,
} from '../data/defaults';
import { Language, ShayariItem, ShayariMood, ShayariPaperTheme } from '../types/keepsake';
import { downloadShayariCardPng } from '../utils/canvasExport';

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
  const [showLexicon, setShowLexicon] = useState(false);
  const [filterMood, setFilterMood] = useState<'all' | ShayariMood>('all');
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const activeTheme = PAPER_THEME_META[theme];

  const handleReset = () => {
    setEditingId(null);
    setTitle('');
    setLines('');
    setMood('ishq');
    setTheme('alabaster');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedLines = lines.trim();
    if (!trimmedLines) return;
    const finalTitle =
      title.trim() || (lang === 'hi' ? `${partnerName} के नाम` : `For ${partnerName}`);

    if (editingId) {
      const existing = shayaris.find((s) => s.id === editingId);
      if (existing) {
        onUpdateShayari({
          ...existing,
          title: finalTitle,
          lines: trimmedLines,
          mood,
          theme,
        });
      }
      setEditingId(null);
    } else {
      onAddShayari({
        title: finalTitle,
        lines: trimmedLines,
        mood,
        theme,
        isFavorite: false,
      });
    }

    setTitle('');
    setLines('');
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2200);
  };

  const handleStartEdit = (item: ShayariItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setLines(item.lines);
    setMood(item.mood);
    setTheme(item.theme);
    const el = document.getElementById('shayari-composer');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const insertWord = (word: string) => {
    setLines((prev) => (prev ? `${prev}${prev.endsWith('\n') || prev.endsWith(' ') ? '' : ' '}${word}` : word));
  };

  const previewItem: ShayariItem = {
    id: editingId || 'preview',
    title: title.trim() || (lang === 'hi' ? 'आपकी शायरी का शीर्षक' : 'Your Shayari Title'),
    lines:
      lines.trim() ||
      (lang === 'hi'
        ? 'तुम्हारी यादों का मौसम कुछ इस तरह छाया है,\nहर लफ़्ज़ में आज फिर तुम्हारा नाम आया है।'
        : 'Every quiet line written here carries a piece of your warmth,\nTurning ordinary evenings into poetry.'),
    mood,
    theme,
    createdAt: lang === 'hi' ? 'आज' : 'Today',
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
              {lang === 'hi' ? '01. शायरी स्टूडियो' : '01. Shayari Studio'}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1B1518] [text-wrap:balance]">
              {lang === 'hi'
                ? 'अपने दिल की शायरी लिखें और कार्ड बनाएं'
                : 'Write Your Own Shayari & Design Keepsake Cards'}
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
                ? lang === 'hi'
                  ? 'लफ़्ज़ कोश बंद करें'
                  : 'Hide Poetic Words'
                : lang === 'hi'
                  ? 'शायरी लफ़्ज़ व शुरुआत'
                  : 'Poetic Words & Starters'}
            </span>
          </button>
        </div>

        {/* Optional Poetic Lexicon & Starters Helper */}
        {showLexicon && (
          <div className="mb-8 p-5 bg-white border border-[#E6DFE3] rounded-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[#1B1518]">
                {lang === 'hi'
                  ? 'लिखने में मदद के लिए ख़ूबसूरत लफ़्ज़ (क्लिक करके जोड़ें)'
                  : 'Click a poetic word or starter line to insert into your draft'}
              </h3>
            </div>
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
                    setLines(lang === 'hi' ? starter.hi : starter.en);
                  }}
                  className="text-left p-3 rounded-lg bg-[#FAF8F9] border border-[#E6DFE3] hover:border-[#C81E4C] transition-colors cursor-pointer"
                >
                  <div className="text-xs text-[#C81E4C] mb-1">
                    {MOOD_LABELS[starter.mood][lang]}
                  </div>
                  <div className="font-serif text-sm text-[#1B1518] whitespace-pre-line">
                    {lang === 'hi' ? starter.hi : starter.en}
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
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hi' ? 'शायरी का शीर्षक (उनवान)' : 'Shayari Title'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  placeholder={
                    lang === 'hi'
                      ? 'जैसे: पहली बारिश और तुम'
                      : 'e.g. Evening Tea & Your Smile'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hi' ? 'अहसास चुनें (Mood)' : 'Mood'}
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
                  {lang === 'hi' ? 'अपनी शायरी यहाँ लिखें' : 'Write Your Shayari Lines'}
                </label>
                <textarea
                  rows={6}
                  required
                  value={lines}
                  onChange={(e) => setLines(e.target.value)}
                  maxLength={800}
                  placeholder={
                    lang === 'hi'
                      ? 'यहाँ हिंदी, उर्दू या हिंग्लिश में अपनी शायरी की पंक्तियाँ लिखें...'
                      : 'Write your couplets or poem lines here (Hindi, Urdu, Hinglish, or English)...'
                  }
                  className="w-full px-4 py-3 font-serif text-base leading-relaxed bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C] resize-y"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hi' ? 'कार्ड का काग़ज़ (Paper Style)' : 'Card Paper Style'}
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
              <div className="flex items-center gap-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3.5 py-2 text-xs font-medium text-[#6B5E65] hover:text-[#1B1518] cursor-pointer"
                  >
                    {lang === 'hi' ? 'नया लिखें' : 'Cancel Edit'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {savedNotice && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#C81E4C]">
                    <Check className="w-3.5 h-3.5" />
                    {lang === 'hi' ? 'संग्रह में जोड़ा गया' : 'Saved'}
                  </span>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#C81E4C] hover:bg-[#AD1740] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {editingId
                      ? lang === 'hi'
                        ? 'बदलाव सेव करें'
                        : 'Save Changes'
                      : lang === 'hi'
                        ? 'शायरी सेव करें'
                        : 'Save Shayari'}
                  </span>
                </button>
              </div>
            </div>
          </form>

          {/* Right: Live Typeset Card Preview */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            <div
              className={`flex-1 rounded-2xl border p-8 md:p-10 flex flex-col justify-between transition-colors ${activeTheme.bgClass} ${activeTheme.borderClass}`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={activeTheme.mutedClass}>
                  {MOOD_LABELS[mood][lang]}
                  <span aria-hidden="true" className="mx-1.5">·</span>
                  {lang === 'hi' ? 'लाइव झलक' : 'Live Preview'}
                </span>
                <span className={`font-serif ${activeTheme.mutedClass}`}>Mehfil</span>
              </div>

              <div className="my-8 text-center space-y-5">
                <h3 className={`font-serif text-xl md:text-2xl font-bold ${activeTheme.textClass}`}>
                  {previewItem.title}
                </h3>
                <div className="w-12 h-px mx-auto bg-[#C81E4C]/50" />
                <p
                  className={`font-serif text-base md:text-lg leading-[1.9] whitespace-pre-line max-w-md mx-auto ${activeTheme.textClass}`}
                >
                  {previewItem.lines}
                </p>
              </div>

              <div className={`text-center text-xs pt-4 border-t border-current/10 ${activeTheme.mutedClass}`}>
                {lang === 'hi'
                  ? `${senderName} की ओर से ${partnerName} के लिए`
                  : `Written by ${senderName} for ${partnerName}`}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 px-1">
              <p className="text-xs text-[#6B5E65]">
                {lang === 'hi'
                  ? 'इस कार्ड को सीधे इमेज के रूप में डाउनलोड करें'
                  : 'Export this card as a high-resolution PNG'}
              </p>
              <button
                type="button"
                onClick={() => downloadShayariCardPng(previewItem, senderName, partnerName, lang)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#1B1518] bg-white border border-[#DED5DA] hover:border-[#C81E4C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#C81E4C]" />
                <span>{lang === 'hi' ? 'PNG डाउनलोड करें' : 'Download PNG'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Anthology Collection Grid */}
        <div className="mt-14 pt-10 border-t border-[#E6DFE3]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="font-serif text-xl font-bold text-[#1B1518]">
              {lang === 'hi'
                ? `सहेजी गई शायरी (${filteredShayaris.length})`
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
                {lang === 'hi' ? 'सभी' : 'All'}
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
                {lang === 'hi'
                  ? 'इस मिज़ाज में अभी कोई शायरी नहीं है।'
                  : 'No Shayari in this mood yet.'}
              </p>
              <p className="text-xs text-[#6B5E65]">
                {lang === 'hi'
                  ? 'ऊपर दिए गए स्टूडियो से अपनी पहली शायरी जोड़ें।'
                  : 'Use the composer above to write your first couplet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShayaris.map((item) => {
                const pTheme = PAPER_THEME_META[item.theme];
                return (
                  <article
                    key={item.id}
                    className={`rounded-2xl border p-6 flex flex-col justify-between gap-6 ${pTheme.bgClass} ${pTheme.borderClass}`}
                  >
                    <div>
                      <div className={`text-xs mb-3 ${pTheme.mutedClass}`}>
                        <span>{MOOD_LABELS[item.mood][lang]}</span>
                        <span aria-hidden="true" className="mx-1.5">·</span>
                        <span>{item.createdAt}</span>
                      </div>
                      <h4 className={`font-serif text-lg font-bold mb-3 ${pTheme.textClass}`}>
                        {item.title}
                      </h4>
                      <p
                        className={`font-serif text-sm leading-[1.85] whitespace-pre-line ${pTheme.textClass}`}
                      >
                        {item.lines}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-current/10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(item.id)}
                          aria-label={lang === 'hi' ? 'पसंदीदा चिह्नित करें' : 'Toggle favorite'}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            item.isFavorite
                              ? 'text-[#C81E4C]'
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
                          onClick={() =>
                            downloadShayariCardPng(item, senderName, partnerName, lang)
                          }
                          aria-label={lang === 'hi' ? 'PNG डाउनलोड करें' : 'Download PNG'}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${pTheme.mutedClass} hover:text-[#C81E4C]`}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          aria-label={lang === 'hi' ? 'संपादित करें' : 'Edit'}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${pTheme.mutedClass} hover:text-[#C81E4C]`}
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
                            className="font-semibold text-[#C81E4C] hover:underline cursor-pointer"
                          >
                            {lang === 'hi' ? 'हटाएं' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className={`${pTheme.mutedClass} hover:underline cursor-pointer`}
                          >
                            {lang === 'hi' ? 'नहीं' : 'Cancel'}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          aria-label={lang === 'hi' ? 'हटाएं' : 'Delete'}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${pTheme.mutedClass} hover:text-[#C81E4C]`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
