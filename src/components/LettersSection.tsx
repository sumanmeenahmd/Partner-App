import { useRef, useState } from 'react';
import { ImagePlus, Mail, Plus, Trash2, X } from 'lucide-react';
import { ASSET_IMAGES } from '../data/defaults';
import { Language, LoveLetter, LoveReason } from '../types/keepsake';
import { resizeImageFile } from '../utils/imageHelper';
import { ResilientImage } from './ResilientImage';

interface LettersSectionProps {
  lang: Language;
  letters: LoveLetter[];
  reasons: LoveReason[];
  partnerName: string;
  onAddLetter: (letter: Omit<LoveLetter, 'id' | 'createdAt' | 'opened'>) => void;
  onDeleteLetter: (id: string) => void;
  onAddReason: (text: string) => void;
  onDeleteReason: (id: string) => void;
}

export function LettersSection({
  lang,
  letters,
  reasons,
  partnerName,
  onAddLetter,
  onDeleteLetter,
  onAddReason,
  onDeleteReason,
}: LettersSectionProps) {
  const [prompt, setPrompt] = useState('');
  const [body, setBody] = useState('');
  const [signOff, setSignOff] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [reasonText, setReasonText] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await resizeImageFile(file, 640, 0.78);
      setImageUrl(compressed);
    } catch {
      // ignore invalid file
    } finally {
      e.target.value = '';
    }
  };

  const handleLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !body.trim()) return;
    onAddLetter({
      prompt: prompt.trim(),
      body: body.trim(),
      signOff: signOff.trim() || (lang === 'hinglish' ? 'Always yours' : 'Always yours'),
      imageUrl,
    });
    setPrompt('');
    setBody('');
    setSignOff('');
    setImageUrl(undefined);
  };

  const handleReasonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonText.trim()) return;
    onAddReason(reasonText.trim());
    setReasonText('');
  };

  return (
    <section id="love-letters" className="py-12 md:py-16 border-t border-[#E6DFE3]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-12">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-medium text-[#C81E4C] mb-2">
              {lang === 'hinglish' ? '02. Dil Ki Letters' : '02. Sealed Letters'}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1B1518] mb-3 [text-wrap:balance]">
              {lang === 'hinglish'
                ? `${partnerName} ke special moments ke liye Sealed “Open When…” Letters`
                : `Sealed “Open When…” Letters for ${partnerName}`}
            </h2>
            <p className="text-sm md:text-base text-[#5A4E54] leading-relaxed max-w-2xl">
              {lang === 'hinglish'
                ? 'Kuch baatein tab padhne mein sabse pyari lagti hain jab unki sabse zyada zaroorat ho. Alag-alag moments ke liye letters likh kar seal karo (chaaho to photo bhi attach karo) — Gift Mode mein woh click karke open kar sakenge.'
                : 'Write intimate letters tied to specific moments—when they miss you, feel tired, or need a smile. You can even attach a photo inside each sealed envelope.'}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="h-56 lg:h-full rounded-2xl overflow-hidden border border-[#E6DFE3]">
              <ResilientImage
                src={ASSET_IMAGES.waxEnvelope}
                alt="Ivory cotton paper envelope sealed with deep crimson wax and white jasmine"
                fallbackTitle="Sealed Envelope"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Letter Composer + Saved Sealed Envelopes */}
          <div className="lg:col-span-7 space-y-6">
            <form
              onSubmit={handleLetterSubmit}
              className="bg-white border border-[#E6DFE3] rounded-2xl p-6 space-y-4"
            >
              <h3 className="font-serif text-lg font-bold text-[#1B1518]">
                {lang === 'hinglish' ? 'Naya Letter Likho' : 'Write a New Letter'}
              </h3>

              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hinglish' ? 'Kab Open Karna Hai (Title)' : 'Open When Prompt'}
                </label>
                <input
                  type="text"
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  maxLength={100}
                  placeholder={
                    lang === 'hinglish'
                      ? 'Jaise: Jab tumhe meri bahut yaad aaye...'
                      : 'e.g. Open when you miss me at midnight...'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hinglish' ? 'Letter Ka Message' : 'Letter Message'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={1200}
                  placeholder={
                    lang === 'hinglish'
                      ? 'Dil se jo kehna chahte ho, yahan likho...'
                      : 'Write something comforting, honest, and deeply personal...'
                  }
                  className="w-full px-3.5 py-2.5 font-serif text-sm leading-relaxed bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C] resize-y"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1B1518] bg-[#FAF8F9] border border-[#DED5DA] hover:border-[#C81E4C] rounded-lg cursor-pointer"
                >
                  <ImagePlus className="w-3.5 h-3.5 text-[#C81E4C]" />
                  <span>{lang === 'hinglish' ? 'Letter Mein Photo Lagao' : 'Attach Photo'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {imageUrl && (
                  <div className="flex items-center gap-2">
                    <img
                      src={imageUrl}
                      alt="Attached preview"
                      className="w-9 h-9 rounded object-cover border border-[#E6DFE3]"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl(undefined)}
                      className="inline-flex items-center gap-1 text-xs text-[#C81E4C] hover:underline cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{lang === 'hinglish' ? 'Remove' : 'Remove'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                    {lang === 'hinglish' ? 'Last Line (Sign-off)' : 'Sign-off'}
                  </label>
                  <input
                    type="text"
                    value={signOff}
                    onChange={(e) => setSignOff(e.target.value)}
                    maxLength={60}
                    placeholder={lang === 'hinglish' ? 'Jaise: Always yours' : 'e.g. Forever yours'}
                    className="w-full px-3.5 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1B1518] hover:bg-[#31262C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'hinglish' ? 'Letter Seal Karo' : 'Seal Letter'}</span>
                </button>
              </div>
            </form>

            {/* Existing Letters List */}
            <div className="space-y-4">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  className="bg-white border border-[#E6DFE3] rounded-xl p-5 flex items-start justify-between gap-4"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-[#6B5E65]">
                      <Mail className="w-3.5 h-3.5 text-[#C81E4C]" />
                      <span>{letter.createdAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>{letter.signOff}</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-[#1B1518]">
                      {letter.prompt}
                    </h4>
                    {letter.imageUrl && (
                      <div className="aspect-[16/9] max-w-sm rounded-lg overflow-hidden border border-[#E6DFE3]">
                        <ResilientImage
                          src={letter.imageUrl}
                          alt={letter.prompt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-sm text-[#5A4E54] leading-relaxed">{letter.body}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteLetter(letter.id)}
                    aria-label="Delete letter"
                    className="p-2 text-[#6B5E65] hover:text-[#C81E4C] transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Reasons I Adore You List */}
          <div className="lg:col-span-5 bg-white border border-[#E6DFE3] rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1B1518] mb-1">
                {lang === 'hinglish'
                  ? 'Tumhari Woh Baatein Jo Mujhe Bahut Pasand Hain'
                  : 'Little Things I Adore About You'}
              </h3>
              <p className="text-xs text-[#6B5E65]">
                {lang === 'hinglish'
                  ? 'Chhoti-chhoti habits jo unhe sabse special banati hain.'
                  : 'Everyday details that make them irreplaceable to you.'}
              </p>
            </div>

            <form onSubmit={handleReasonSubmit} className="flex gap-2">
              <input
                type="text"
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                maxLength={160}
                placeholder={
                  lang === 'hinglish'
                    ? 'Jaise: Tumhari smile sunkar poora din ban jana...'
                    : 'e.g. How your eyes light up over evening chai...'
                }
                className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#C81E4C] hover:bg-[#AD1740] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {lang === 'hinglish' ? 'Add Karo' : 'Add'}
              </button>
            </form>

            <ol className="divide-y divide-[#F0EAEF]">
              {reasons.map((reason, idx) => (
                <li
                  key={reason.id}
                  className="py-3.5 flex items-start justify-between gap-3"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-xs font-semibold text-[#C81E4C] tabular-nums shrink-0">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="text-sm text-[#1B1518] leading-relaxed">{reason.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteReason(reason.id)}
                    aria-label="Remove reason"
                    className="p-1.5 text-[#6B5E65] hover:text-[#C81E4C] transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
