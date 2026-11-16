import { useRef, useState } from 'react';
import { CheckCircle2, Clock, ImagePlus, Plus, Ticket, Trash2 } from 'lucide-react';
import { ASSET_IMAGES } from '../data/defaults';
import { Language, LoveVoucher, MemoryItem } from '../types/keepsake';
import { ResilientImage } from './ResilientImage';

interface VouchersAndMemoriesProps {
  lang: Language;
  vouchers: LoveVoucher[];
  memories: MemoryItem[];
  onAddVoucher: (voucher: Omit<LoveVoucher, 'id' | 'redeemed'>) => void;
  onDeleteVoucher: (id: string) => void;
  onResetVoucher: (id: string) => void;
  onAddMemory: (memory: Omit<MemoryItem, 'id'>) => void;
  onDeleteMemory: (id: string) => void;
}

function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function VouchersAndMemories({
  lang,
  vouchers,
  memories,
  onAddVoucher,
  onDeleteVoucher,
  onResetVoucher,
  onAddMemory,
  onDeleteMemory,
}: VouchersAndMemoriesProps) {
  const [vTitle, setVTitle] = useState('');
  const [vDetail, setVDetail] = useState('');
  const [vValid, setVValid] = useState('');

  const [mDate, setMDate] = useState('');
  const [mPlace, setMPlace] = useState('');
  const [mTitle, setMTitle] = useState('');
  const [mStory, setMStory] = useState('');
  const [mImage, setMImage] = useState<string>(ASSET_IMAGES.teaEvening);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vTitle.trim()) return;
    onAddVoucher({
      title: vTitle.trim(),
      detail:
        vDetail.trim() ||
        (lang === 'hi' ? 'जब भी तुम्हारा दिल करे, बस याद दिला देना।' : 'Redeem anytime you wish.'),
      validFor: vValid.trim() || (lang === 'hi' ? 'हमेशा मान्य' : 'Valid forever'),
    });
    setVTitle('');
    setVDetail('');
    setVValid('');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImageFile(file);
      setMImage(dataUrl);
    } catch {
      // keep existing image selection on error
    }
  };

  const handleMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim() || !mStory.trim()) return;
    onAddMemory({
      dateLabel: mDate.trim() || (lang === 'hi' ? 'एक ख़ास दिन' : 'A Special Day'),
      place: mPlace.trim() || (lang === 'hi' ? 'हमारी जगह' : 'Our Spot'),
      title: mTitle.trim(),
      story: mStory.trim(),
      imageUrl: mImage,
    });
    setMDate('');
    setMPlace('');
    setMTitle('');
    setMStory('');
  };

  return (
    <>
      {/* 03. Love Vouchers / Promises */}
      <section id="love-vouchers" className="py-12 md:py-16 border-t border-[#E6DFE3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-xs font-medium text-[#C81E4C] mb-2">
              {lang === 'hi' ? '03. प्यार के वादे' : '03. Love Vouchers'}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1B1518] mb-2 [text-wrap:balance]">
              {lang === 'hi'
                ? 'मीठे वादे और छोटे-छोटे सरप्राइज़ कूपन'
                : 'Redeemable Love Promises & Sweet Surprises'}
            </h2>
            <p className="text-sm text-[#5A4E54] max-w-2xl">
              {lang === 'hi'
                ? 'अपने पार्टनर के लिए ऐसे वादे बनाएं जिन्हें वे तोहफ़ा खोलकर कभी भी भुना (Claim) सकें।'
                : 'Craft thoughtful date promises and acts of care that your partner can interactively claim inside Partner Gift View.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleVoucherSubmit}
              className="lg:col-span-5 bg-white border border-[#E6DFE3] rounded-2xl p-6 space-y-4"
            >
              <h3 className="font-serif text-lg font-bold text-[#1B1518]">
                {lang === 'hi' ? 'नया वादा जोड़ें' : 'Create a Love Voucher'}
              </h3>

              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hi' ? 'वादे का शीर्षक' : 'Voucher Title'}
                </label>
                <input
                  type="text"
                  required
                  value={vTitle}
                  onChange={(e) => setVTitle(e.target.value)}
                  maxLength={90}
                  placeholder={
                    lang === 'hi'
                      ? 'जैसे: आधी रात को आइसक्रीम ड्राइव'
                      : 'e.g. Midnight Ice Cream Walk'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hi' ? 'विवरण' : 'Promise Details'}
                </label>
                <textarea
                  rows={2}
                  value={vDetail}
                  onChange={(e) => setVDetail(e.target.value)}
                  maxLength={200}
                  placeholder={
                    lang === 'hi'
                      ? 'जैसे: बिना किसी बहाने के तुम्हारी पसंद की जगह चलेंगे।'
                      : 'e.g. Whenever you ask, no excuses, just us.'
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hi' ? 'कब तक मान्य (Validity)' : 'Valid For'}
                </label>
                <input
                  type="text"
                  value={vValid}
                  onChange={(e) => setVValid(e.target.value)}
                  maxLength={50}
                  placeholder={lang === 'hi' ? 'जैसे: हमेशा के लिए' : 'e.g. Anytime this month'}
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#C81E4C] hover:bg-[#AD1740] rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'hi' ? 'वादा जोड़ें' : 'Add Love Voucher'}</span>
              </button>
            </form>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-white border border-[#E6DFE3] rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[#6B5E65]">
                        {voucher.redeemed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C81E4C]" />
                            <span className="text-[#C81E4C]">
                              {lang === 'hi' ? 'भुनाया गया' : 'Claimed'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Ticket className="w-3.5 h-3.5 text-[#C81E4C]" />
                            <span>{lang === 'hi' ? 'उपयोग के लिए तैयार' : 'Ready to Claim'}</span>
                          </>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteVoucher(voucher.id)}
                        aria-label={lang === 'hi' ? 'वादा हटाएं' : 'Delete voucher'}
                        className="p-1 text-[#6B5E65] hover:text-[#C81E4C] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-serif text-base font-bold text-[#1B1518]">
                      {voucher.title}
                    </h4>
                    <p className="text-sm text-[#5A4E54] leading-relaxed">{voucher.detail}</p>
                  </div>

                  <div className="pt-3 border-t border-[#F0EAEF] flex items-center justify-between gap-2 text-xs text-[#6B5E65]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{voucher.validFor}</span>
                    </span>
                    {voucher.redeemed && (
                      <button
                        type="button"
                        onClick={() => onResetVoucher(voucher.id)}
                        className="text-xs font-medium text-[#C81E4C] hover:underline cursor-pointer"
                      >
                        {lang === 'hi' ? 'फिर से सक्रिय करें' : 'Reset'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04. Memory Timeline */}
      <section id="memory-timeline" className="py-12 md:py-16 border-t border-[#E6DFE3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-xs font-medium text-[#C81E4C] mb-2">
              {lang === 'hi' ? '04. हमारी यादें' : '04. Memory Timeline'}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1B1518] mb-2 [text-wrap:balance]">
              {lang === 'hi'
                ? 'वे ख़ूबसूरत पल जो हमेशा दिल के पास हैं'
                : 'Moments Worth Keeping Forever'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <form
              onSubmit={handleMemorySubmit}
              className="lg:col-span-5 bg-white border border-[#E6DFE3] rounded-2xl p-6 space-y-4"
            >
              <h3 className="font-serif text-lg font-bold text-[#1B1518]">
                {lang === 'hi' ? 'नई याद जोड़ें' : 'Add a Shared Memory'}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#6B5E65] mb-1">
                    {lang === 'hi' ? 'तारीख़ / महीना' : 'Date / Month'}
                  </label>
                  <input
                    type="text"
                    value={mDate}
                    onChange={(e) => setMDate(e.target.value)}
                    maxLength={40}
                    placeholder={lang === 'hi' ? 'जैसे: जुलाई 2025' : 'e.g. July 2025'}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B5E65] mb-1">
                    {lang === 'hi' ? 'जगह' : 'Place'}
                  </label>
                  <input
                    type="text"
                    value={mPlace}
                    onChange={(e) => setMPlace(e.target.value)}
                    maxLength={50}
                    placeholder={lang === 'hi' ? 'जैसे: मरीन ड्राइव' : 'e.g. Old Café'}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1">
                  {lang === 'hi' ? 'याद का शीर्षक' : 'Memory Title'}
                </label>
                <input
                  type="text"
                  required
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  maxLength={90}
                  placeholder={
                    lang === 'hi'
                      ? 'जैसे: पहली बारिश में लंबी सैर'
                      : 'e.g. Walking through the first monsoon rain'
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#6B5E65] mb-1">
                  {lang === 'hi' ? 'उस पल की कहानी' : 'The Story'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={mStory}
                  onChange={(e) => setMStory(e.target.value)}
                  maxLength={400}
                  placeholder={
                    lang === 'hi'
                      ? 'उस दिन क्या ख़ास हुआ था...'
                      : 'What made that moment unforgettable...'
                  }
                  className="w-full px-3.5 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C] resize-none"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#6B5E65] mb-1.5">
                  {lang === 'hi' ? 'तस्वीर चुनें या अपलोड करें' : 'Artwork or Photo'}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMImage(ASSET_IMAGES.teaEvening)}
                    className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer ${
                      mImage === ASSET_IMAGES.teaEvening
                        ? 'border-[#C81E4C] bg-[#FDF4F6] text-[#1B1518]'
                        : 'border-[#DED5DA] text-[#6B5E65]'
                    }`}
                  >
                    {lang === 'hi' ? 'चाय और बारिश' : 'Rainy Chai'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMImage(ASSET_IMAGES.starlightLantern)}
                    className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer ${
                      mImage === ASSET_IMAGES.starlightLantern
                        ? 'border-[#C81E4C] bg-[#FDF4F6] text-[#1B1518]'
                        : 'border-[#DED5DA] text-[#6B5E65]'
                    }`}
                  >
                    {lang === 'hi' ? 'तैरते दीये' : 'Lantern Twilight'}
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1B1518] bg-[#FAF8F9] border border-[#DED5DA] hover:border-[#C81E4C] rounded-lg cursor-pointer"
                  >
                    <ImagePlus className="w-3.5 h-3.5 text-[#C81E4C]" />
                    <span>{lang === 'hi' ? 'फ़ोटो अपलोड' : 'Upload Photo'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1B1518] hover:bg-[#31262C] rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'hi' ? 'याद सहेजें' : 'Save Memory'}</span>
              </button>
            </form>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {memories.map((memory) => (
                <article
                  key={memory.id}
                  className="bg-white border border-[#E6DFE3] rounded-2xl overflow-hidden flex flex-col"
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
                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-[#6B5E65] mb-2">
                        <span>
                          {memory.dateLabel}
                          <span aria-hidden="true" className="mx-1.5">·</span>
                          {memory.place}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteMemory(memory.id)}
                          aria-label={lang === 'hi' ? 'याद हटाएं' : 'Delete memory'}
                          className="p-1 text-[#6B5E65] hover:text-[#C81E4C] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#1B1518] mb-2">
                        {memory.title}
                      </h4>
                      <p className="text-sm text-[#5A4E54] leading-relaxed">{memory.story}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
