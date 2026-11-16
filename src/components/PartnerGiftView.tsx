import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Heart,
  LockOpen,
  Mail,
  Ticket,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ASSET_IMAGES, MOOD_LABELS, PAPER_THEME_META } from '../data/defaults';
import { KeepsakeData, Language } from '../types/keepsake';
import { ambientEngine } from '../utils/ambientSound';
import { downloadShayariCardPng } from '../utils/canvasExport';
import { ResilientImage } from './ResilientImage';

interface PartnerGiftViewProps {
  lang: Language;
  data: KeepsakeData;
  isSharedLinkMode: boolean;
  onExitGiftMode: () => void;
  onToggleShayariFavorite: (id: string) => void;
  onRedeemVoucher: (id: string) => void;
  onOpenLetter: (id: string) => void;
}

export function PartnerGiftView({
  lang,
  data,
  isSharedLinkMode,
  onExitGiftMode,
  onToggleShayariFavorite,
  onRedeemVoucher,
  onOpenLetter,
}: PartnerGiftViewProps) {
  const [unsealedCover, setUnsealedCover] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [activeShayariIdx, setActiveShayariIdx] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [replyCopied, setReplyCopied] = useState(false);

  useEffect(() => {
    return () => {
      ambientEngine.stopAmbient();
    };
  }, []);

  const handleOpenCover = () => {
    ambientEngine.playSealChime();
    setUnsealedCover(true);
  };

  const handleToggleMusic = () => {
    const next = ambientEngine.toggleAmbient();
    setMusicOn(next);
  };

  const handleExit = () => {
    ambientEngine.stopAmbient();
    setMusicOn(false);
    onExitGiftMode();
  };

  const handleCopyReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await navigator.clipboard.writeText(
        `Hey ${data.profile.senderName}, I just opened your Mehfil gift ❤️\n\n"${replyText.trim()}"`
      );
      setReplyCopied(true);
      window.setTimeout(() => setReplyCopied(false), 2600);
    } catch {
      // ignore
    }
  };

  const safeIdx =
    data.shayaris.length > 0 ? Math.min(activeShayariIdx, data.shayaris.length - 1) : 0;
  const activeShayari = data.shayaris[safeIdx];

  if (!unsealedCover) {
    return (
      <div className="min-h-screen bg-[#FAF8F9] flex flex-col justify-between px-6 py-8">
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
          <span className="font-serif text-lg font-bold text-[#1B1518]">Mehfil</span>
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B5E65] hover:text-[#1B1518] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {isSharedLinkMode
                ? lang === 'hinglish'
                  ? 'Studio Kholo'
                  : 'Open Studio'
                : lang === 'hinglish'
                  ? 'Studio Wapas Jao'
                  : 'Back to Studio'}
            </span>
          </button>
        </div>

        <div className="max-w-2xl w-full mx-auto my-10 bg-white border border-[#E6DFE3] rounded-2xl overflow-hidden">
          <div className="aspect-[16/9] w-full overflow-hidden bg-[#EFEAEF]">
            <ResilientImage
              src={ASSET_IMAGES.waxEnvelope}
              alt="Sealed envelope with crimson wax seal"
              fallbackTitle={data.profile.partnerName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 md:p-10 text-center space-y-5">
            <p className="text-xs font-medium text-[#C81E4C]">
              {lang === 'hinglish'
                ? `${data.profile.senderName} ki taraf se ek special gift`
                : `A Personal Keepsake From ${data.profile.senderName}`}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1B1518] [text-wrap:balance]">
              {lang === 'hinglish'
                ? `Sirf Tumhare Liye, ${data.profile.partnerName}`
                : `Especially for You, ${data.profile.partnerName}`}
            </h1>
            <p className="text-sm text-[#5A4E54] max-w-md mx-auto leading-relaxed">
              {lang === 'hinglish'
                ? 'Isme tumhare naam likhi shayari, photos, sealed letters, sweet promises aur hamari pyari yaadein save ki gayi hain.'
                : 'Inside are handwritten Shayari, photo cards, sealed letters waiting for you, love promises, and cherished memories.'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenCover}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#C81E4C] hover:bg-[#AD1740] rounded-lg transition-colors cursor-pointer"
              >
                <LockOpen className="w-4 h-4" />
                <span>{lang === 'hinglish' ? 'Gift Open Karo' : 'Unseal & Open'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-[#6B5E65]">{data.profile.milestoneDate}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F9] text-[#1B1518]">
      {/* Clean Top Bar for Gift View */}
      <header className="sticky top-0 z-30 bg-[#FAF8F9]/95 backdrop-blur-sm border-b border-[#E6DFE3]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#5A4E54] hover:text-[#1B1518] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {isSharedLinkMode
                ? lang === 'hinglish'
                  ? 'Studio Mein Edit Karo'
                  : 'Edit in Studio'
                : lang === 'hinglish'
                  ? 'Studio Wapas Jao'
                  : 'Back to Studio'}
            </span>
          </button>

          <span className="font-serif text-lg font-bold text-[#1B1518] whitespace-nowrap shrink-0">
            {data.profile.partnerName} &amp; {data.profile.senderName}
          </span>

          <button
            type="button"
            onClick={handleToggleMusic}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#1B1518] bg-white border border-[#DED5DA] hover:border-[#C81E4C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {musicOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#C81E4C]" />
                <span>{lang === 'hinglish' ? 'Music Off' : 'Mute'}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#6B5E65]" />
                <span>{lang === 'hinglish' ? 'Soft Music' : 'Ambient Chime'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Dedication Header */}
        <section className="text-center space-y-5 pb-12 border-b border-[#E6DFE3]">
          <p className="text-xs font-medium text-[#C81E4C]">
            {data.profile.senderName}
            <span aria-hidden="true" className="mx-1.5">·</span>
            {data.profile.milestoneDate}
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#1B1518] [text-wrap:balance]">
            {lang === 'hinglish'
              ? `Dear ${data.profile.partnerName}, Yeh Sirf Tumhare Liye Hai`
              : `Dear ${data.profile.partnerName}, This Is For You`}
          </h1>
          <p className="font-serif text-base md:text-lg text-[#5A4E54] max-w-2xl mx-auto leading-relaxed">
            “{data.profile.dedication}”
          </p>
        </section>

        {/* Interactive Shayari Reader */}
        {activeShayari && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#C81E4C] mb-1">
                  {lang === 'hinglish' ? 'Tumhare Naam Shayari' : 'Shayari Written for You'}
                </p>
                <h2 className="font-serif text-2xl font-bold text-[#1B1518]">
                  {lang === 'hinglish' ? 'Dil Se Likhi Hui Lines' : 'Verses From the Heart'}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#6B5E65] tabular-nums">
                <button
                  type="button"
                  onClick={() =>
                    setActiveShayariIdx((i) =>
                      i === 0 ? data.shayaris.length - 1 : i - 1
                    )
                  }
                  aria-label="Previous Shayari"
                  className="p-2 bg-white border border-[#DED5DA] hover:border-[#C81E4C] rounded-lg cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-medium">
                  {safeIdx + 1} / {data.shayaris.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveShayariIdx((i) => (i + 1) % data.shayaris.length)
                  }
                  aria-label="Next Shayari"
                  className="p-2 bg-white border border-[#DED5DA] hover:border-[#C81E4C] rounded-lg cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {(() => {
              const pTheme = PAPER_THEME_META[activeShayari.theme];
              const layout = activeShayari.imageUrl
                ? activeShayari.photoLayout || 'framed'
                : 'none';

              if (layout === 'backdrop' && activeShayari.imageUrl) {
                return (
                  <div className="relative rounded-2xl border border-[#E6DFE3] overflow-hidden min-h-[440px] p-8 md:p-12 text-center flex flex-col justify-between text-white">
                    <ResilientImage
                      src={activeShayari.imageUrl}
                      alt={activeShayari.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40"
                      aria-hidden="true"
                    />
                    <div className="relative z-10 text-xs text-white/80">
                      {MOOD_LABELS[activeShayari.mood][lang]}
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      {activeShayari.createdAt}
                    </div>
                    <div className="relative z-10 space-y-5 my-8">
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {activeShayari.title}
                      </h3>
                      <div className="w-12 h-px mx-auto bg-[#F48CA7]" />
                      <p className="font-serif text-lg md:text-xl leading-[2] whitespace-pre-line max-w-xl mx-auto text-white">
                        {activeShayari.lines}
                      </p>
                    </div>
                    <div className="relative z-10 pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => onToggleShayariFavorite(activeShayari.id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          activeShayari.isFavorite
                            ? 'border-[#C81E4C] bg-[#C81E4C] text-white'
                            : 'border-white/30 text-white hover:border-[#F48CA7]'
                        }`}
                      >
                        <Heart
                          className="w-3.5 h-3.5"
                          fill={activeShayari.isFavorite ? 'currentColor' : 'none'}
                        />
                        <span>
                          {activeShayari.isFavorite
                            ? lang === 'hinglish'
                              ? 'Dil Ko Chhoo Gayi'
                              : 'Loved This'
                            : lang === 'hinglish'
                              ? 'Pasand Aayi'
                              : 'Love This'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void downloadShayariCardPng(
                            activeShayari,
                            data.profile.senderName,
                            data.profile.partnerName,
                            lang
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-white/30 text-white hover:border-[#F48CA7] transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{lang === 'hinglish' ? 'Card Save Karo' : 'Save Card'}</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  className={`rounded-2xl border overflow-hidden transition-colors ${pTheme.bgClass} ${pTheme.borderClass}`}
                >
                  {layout === 'framed' && activeShayari.imageUrl && (
                    <div className="aspect-[16/9] max-h-[380px] w-full overflow-hidden bg-[#EFEAEF]">
                      <ResilientImage
                        src={activeShayari.imageUrl}
                        alt={activeShayari.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 md:p-12 text-center space-y-6">
                    <div className={`text-xs ${pTheme.mutedClass}`}>
                      {MOOD_LABELS[activeShayari.mood][lang]}
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      {activeShayari.createdAt}
                    </div>
                    <h3 className={`font-serif text-2xl font-bold ${pTheme.textClass}`}>
                      {activeShayari.title}
                    </h3>
                    <div className="w-12 h-px mx-auto bg-[#C81E4C]/50" />
                    <p
                      className={`font-serif text-lg md:text-xl leading-[2] whitespace-pre-line max-w-xl mx-auto ${pTheme.textClass}`}
                    >
                      {activeShayari.lines}
                    </p>
                    <div className="pt-6 border-t border-current/10 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => onToggleShayariFavorite(activeShayari.id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          activeShayari.isFavorite
                            ? 'border-[#C81E4C] bg-[#C81E4C] text-white'
                            : `border-current/20 ${pTheme.textClass} hover:border-[#C81E4C]`
                        }`}
                      >
                        <Heart
                          className="w-3.5 h-3.5"
                          fill={activeShayari.isFavorite ? 'currentColor' : 'none'}
                        />
                        <span>
                          {activeShayari.isFavorite
                            ? lang === 'hinglish'
                              ? 'Dil Ko Chhoo Gayi'
                              : 'Loved This'
                            : lang === 'hinglish'
                              ? 'Pasand Aayi'
                              : 'Love This'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void downloadShayariCardPng(
                            activeShayari,
                            data.profile.senderName,
                            data.profile.partnerName,
                            lang
                          )
                        }
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-current/20 ${pTheme.textClass} hover:border-[#C81E4C] transition-colors cursor-pointer`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{lang === 'hinglish' ? 'Card Save Karo' : 'Save Card'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* Sealed Letters */}
        {data.letters.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-[#E6DFE3]">
            <div>
              <p className="text-xs font-medium text-[#C81E4C] mb-1">
                {lang === 'hinglish' ? 'Dil Ki Letters' : 'Sealed Letters'}
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#1B1518]">
                {lang === 'hinglish'
                  ? 'Har Envelope Par Click Karke Open Karo'
                  : 'Click Each Envelope to Unseal'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.letters.map((letter) => (
                <div
                  key={letter.id}
                  className="bg-white border border-[#E6DFE3] rounded-2xl p-6 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#6B5E65]">
                      <Mail className="w-3.5 h-3.5 text-[#C81E4C]" />
                      <span>
                        {letter.opened
                          ? lang === 'hinglish'
                            ? 'Open Ho Gaya'
                            : 'Unsealed'
                          : lang === 'hinglish'
                            ? 'Sealed Letter'
                            : 'Sealed'}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#1B1518]">
                      {letter.prompt}
                    </h3>

                    {letter.opened ? (
                      <div className="space-y-3 pt-2">
                        {letter.imageUrl && (
                          <div className="aspect-[16/9] rounded-xl overflow-hidden border border-[#E6DFE3]">
                            <ResilientImage
                              src={letter.imageUrl}
                              alt={letter.prompt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="font-serif text-sm text-[#1B1518] leading-relaxed whitespace-pre-line">
                          {letter.body}
                        </p>
                        <p className="text-xs font-medium text-[#C81E4C]">
                          — {letter.signOff}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-[#6B5E65]">
                        {lang === 'hinglish'
                          ? 'Yeh letter tumhare liye seal karke rakha gaya hai.'
                          : 'Waiting behind its wax seal for you to open.'}
                      </p>
                    )}
                  </div>

                  {!letter.opened && (
                    <button
                      type="button"
                      onClick={() => {
                        ambientEngine.playSealChime();
                        onOpenLetter(letter.id);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1B1518] hover:bg-[#31262C] rounded-lg transition-colors cursor-pointer"
                    >
                      <LockOpen className="w-3.5 h-3.5" />
                      <span>{lang === 'hinglish' ? 'Letter Open Karo' : 'Break Wax Seal'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reasons I Adore You */}
        {data.reasons.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-[#E6DFE3]">
            <div>
              <p className="text-xs font-medium text-[#C81E4C] mb-1">
                {lang === 'hinglish' ? 'Why You Are Special' : 'Why You Matter'}
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#1B1518]">
                {lang === 'hinglish'
                  ? 'Chhoti-Chhoti Baatein Jo Tumhe Sabse Special Banati Hain'
                  : 'Little Things I Adore About You'}
              </h2>
            </div>

            <div className="bg-white border border-[#E6DFE3] rounded-2xl p-6 md:p-8">
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {data.reasons.map((r, i) => (
                  <li key={r.id} className="flex items-baseline gap-3 py-2 border-b border-[#F3EEF2]">
                    <span className="font-serif text-xs font-bold text-[#C81E4C] tabular-nums shrink-0">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <span className="text-sm text-[#1B1518] leading-relaxed">{r.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Redeemable Love Vouchers */}
        {data.vouchers.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-[#E6DFE3]">
            <div>
              <p className="text-xs font-medium text-[#C81E4C] mb-1">
                {lang === 'hinglish' ? 'Pyar Ke Waade' : 'Love Vouchers'}
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#1B1518]">
                {lang === 'hinglish'
                  ? 'Jab Dil Kare, Inme Se Koi Bhi Promise Claim Kar Lena'
                  : 'Claim Any Promise Whenever You Wish'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-white border border-[#E6DFE3] rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#6B5E65]">
                      <Ticket className="w-3.5 h-3.5 text-[#C81E4C]" />
                      <span>{voucher.validFor}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#1B1518]">
                      {voucher.title}
                    </h3>
                    <p className="text-sm text-[#5A4E54] leading-relaxed">{voucher.detail}</p>
                  </div>

                  {voucher.redeemed ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C81E4C] pt-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {lang === 'hinglish' ? 'Promise Claim Ho Gaya' : 'Claimed with Love'}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        ambientEngine.playSealChime();
                        onRedeemVoucher(voucher.id);
                      }}
                      className="w-full py-2 px-4 text-xs font-semibold text-white bg-[#C81E4C] hover:bg-[#AD1740] rounded-lg transition-colors cursor-pointer"
                    >
                      {lang === 'hinglish' ? 'Promise Claim Karo' : 'Claim Promise'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Memory Timeline */}
        {data.memories.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-[#E6DFE3]">
            <div>
              <p className="text-xs font-medium text-[#C81E4C] mb-1">
                {lang === 'hinglish' ? 'Hamari Yaadein' : 'Memory Timeline'}
              </p>
              <h2 className="font-serif text-2xl font-bold text-[#1B1518]">
                {lang === 'hinglish' ? 'Kuch Unforgettable Moments' : 'Moments We Carry With Us'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.memories.map((memory) => (
                <article
                  key={memory.id}
                  className="bg-white border border-[#E6DFE3] rounded-2xl overflow-hidden"
                >
                  {memory.imageUrl && (
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#EFEAEF]">
                      <ResilientImage
                        src={memory.imageUrl}
                        alt={memory.title}
                        fallbackTitle={memory.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-2">
                    <div className="text-xs text-[#6B5E65]">
                      {memory.dateLabel}
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      {memory.place}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#1B1518]">
                      {memory.title}
                    </h3>
                    <p className="text-sm text-[#5A4E54] leading-relaxed">{memory.story}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Sweet Reply Note Box for Partner */}
        <section className="pt-8 border-t border-[#E6DFE3]">
          <form
            onSubmit={handleCopyReply}
            className="bg-white border border-[#E6DFE3] rounded-2xl p-6 md:p-8 space-y-4"
          >
            <div>
              <p className="text-xs font-medium text-[#C81E4C] mb-1">
                {lang === 'hinglish' ? 'Tumhara Reply' : 'Send a Note Back'}
              </p>
              <h2 className="font-serif text-xl font-bold text-[#1B1518]">
                {lang === 'hinglish'
                  ? `${data.profile.senderName} ke liye ek chhota sa reply likho`
                  : `Write a sweet reply for ${data.profile.senderName}`}
              </h2>
            </div>

            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              maxLength={400}
              placeholder={
                lang === 'hinglish'
                  ? 'Yeh padh kar kaisa laga, yahan likho aur WhatsApp par bhej do...'
                  : 'Write how this made you feel, then copy and send it back...'
              }
              className="w-full px-4 py-3 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C] resize-none"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#C81E4C] hover:bg-[#AD1740] rounded-lg transition-colors cursor-pointer"
              >
                {replyCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'hinglish'
                        ? 'Reply Copy Ho Gaya! WhatsApp Pe Paste Karo'
                        : 'Copied! Ready for WhatsApp'}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'hinglish' ? 'WhatsApp Reply Copy Karo' : 'Copy Reply for WhatsApp'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
