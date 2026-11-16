import { useState } from 'react';
import { Mail, Plus, Trash2 } from 'lucide-react';
import { ASSET_IMAGES } from '../data/defaults';
import { Language, LoveLetter, LoveReason } from '../types/keepsake';
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
  const [reasonText, setReasonText] = useState('');

  const handleLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !body.trim()) return;
    onAddLetter({
      prompt: prompt.trim(),
      body: body.trim(),
      signOff: signOff.trim() || (lang === 'hi' ? 'हमेशा तुम्हारा' : 'Always yours'),
    });
    setPrompt('');
    setBody('');
    setSignOff('');
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
              {lang === 'hi' ? '02. दिल की चिट्ठियाँ' : '02. Sealed Letters'}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1B1518] mb-3 [text-wrap:balance]">
              {lang === 'hi'
                ? `${partnerName} के ख़ास लम्हों के लिए बंद लिफ़ाफ़े`
                : `Sealed “Open When…” Letters for ${partnerName}`}
            </h2>
            <p className="text-sm md:text-base text-[#5A4E54] leading-relaxed max-w-2xl">
              {lang === 'hi'
                ? 'कुछ बातें तभी पढ़ने में सबसे प्यारी लगती हैं जब उनकी सबसे ज़्यादा ज़रूरत हो। अलग-अलग पलों के लिए चिट्ठियाँ लिखकर सील करें — पार्टनर मोड में वे हर लिफ़ाफ़े को क्लिक करके खोल सकेंगे।'
                : 'Write intimate letters tied to specific moments—when they miss you, feel tired, or need a smile. In Partner View, each letter rests behind a wax seal ready to be opened.'}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="h-56 lg:h-full rounded-2xl overflow-hidden border border-[#E6DFE3]">
              <ResilientImage
                src={ASSET_IMAGES.waxEnvelope}
                alt="Ivory cotton paper envelope sealed with deep crimson wax and white jasmine"
                fallbackTitle={lang === 'hi' ? 'बंद लिफ़ाफ़ा' : 'Sealed Envelope'}
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
                {lang === 'hi' ? 'नई चिट्ठी लिखें' : 'Write a New Letter'}
              </h3>

              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hi' ? 'कब खोलें (शीर्षक)' : 'Open When Prompt'}
                </label>
                <input
                  type="text"
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  maxLength={100}
                  placeholder={
                    lang === 'hi'
                      ? 'जैसे: जब तुम्हें मेरी बहुत याद आए...'
                      : 'e.g. Open when you miss me at midnight...'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hi' ? 'चिट्ठी का संदेश' : 'Letter Message'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={1200}
                  placeholder={
                    lang === 'hi'
                      ? 'दिल से जो कहना चाहते हैं, बेझिझक लिखें...'
                      : 'Write something comforting, honest, and deeply personal...'
                  }
                  className="w-full px-3.5 py-2.5 font-serif text-sm leading-relaxed bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C] resize-y"
                />
              </div>

              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                    {lang === 'hi' ? 'अंतिम पंक्ति (Sign-off)' : 'Sign-off'}
                  </label>
                  <input
                    type="text"
                    value={signOff}
                    onChange={(e) => setSignOff(e.target.value)}
                    maxLength={60}
                    placeholder={lang === 'hi' ? 'जैसे: हमेशा तुम्हारा' : 'e.g. Forever yours'}
                    className="w-full px-3.5 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1B1518] hover:bg-[#31262C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'चिट्ठी सील करें' : 'Seal Letter'}</span>
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#6B5E65]">
                      <Mail className="w-3.5 h-3.5 text-[#C81E4C]" />
                      <span>{letter.createdAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>{letter.signOff}</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-[#1B1518]">
                      {letter.prompt}
                    </h4>
                    <p className="text-sm text-[#5A4E54] leading-relaxed">{letter.body}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteLetter(letter.id)}
                    aria-label={lang === 'hi' ? 'चिट्ठी हटाएं' : 'Delete letter'}
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
                {lang === 'hi'
                  ? 'तुम्हारी वे बातें जो मुझे बेहद पसंद हैं'
                  : 'Little Things I Adore About You'}
              </h3>
              <p className="text-xs text-[#6B5E65]">
                {lang === 'hi'
                  ? 'छोटी-छोटी आदतें जो आपको हर दिन ख़ास बनाती हैं।'
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
                  lang === 'hi'
                    ? 'जैसे: तुम्हारी हँसी सुनकर पूरा दिन बन जाना...'
                    : 'e.g. How your eyes light up over evening chai...'
                }
                className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#C81E4C] hover:bg-[#AD1740] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {lang === 'hi' ? 'जोड़ें' : 'Add'}
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
                    aria-label={lang === 'hi' ? 'हटाएं' : 'Remove reason'}
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
