import { useState } from 'react';
import { Check, Copy, Edit3 } from 'lucide-react';
import { ASSET_IMAGES } from '../data/defaults';
import { KeepsakeData, KeepsakeProfile, Language } from '../types/keepsake';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  data: KeepsakeData;
  onUpdateProfile: (profile: KeepsakeProfile) => void;
  onCopyShareLink: () => Promise<boolean>;
}

export function HeroSection({
  lang,
  onChangeLang,
  data,
  onUpdateProfile,
  onCopyShareLink,
}: HeroSectionProps) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [draft, setDraft] = useState<KeepsakeProfile>(data.profile);
  const [copied, setCopied] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      partnerName: draft.partnerName.trim() || data.profile.partnerName,
      senderName: draft.senderName.trim() || data.profile.senderName,
      milestoneDate: draft.milestoneDate.trim() || data.profile.milestoneDate,
      dedication: draft.dedication.trim() || data.profile.dedication,
    });
    setEditingProfile(false);
  };

  const handleCopyClick = async () => {
    const ok = await onCopyShareLink();
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    }
  };

  return (
    <section id="top" className="pt-8 pb-12 md:pt-12 md:pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Workspace language segmented switch placed below header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E6DFE3]">
          <div className="flex items-center gap-2 text-xs text-[#6B5E65]">
            <span>{lang === 'hi' ? 'रचना स्टूडियो' : 'Keepsake Atelier'}</span>
            <span aria-hidden="true">·</span>
            <span>
              {lang === 'hi'
                ? `${data.profile.senderName} से ${data.profile.partnerName} के लिए`
                : `Crafted by ${data.profile.senderName} for ${data.profile.partnerName}`}
            </span>
          </div>

          <div
            className="inline-flex items-center p-1 bg-[#EFEAEF] rounded-lg"
            role="group"
            aria-label="Language switch"
          >
            <button
              type="button"
              onClick={() => onChangeLang('hi')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                lang === 'hi'
                  ? 'bg-white text-[#1B1518] shadow-xs'
                  : 'text-[#6B5E65] hover:text-[#1B1518]'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-[#1B1518] shadow-xs'
                  : 'text-[#6B5E65] hover:text-[#1B1518]'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <p className="text-xs font-medium text-[#C81E4C]">
                {lang === 'hi'
                  ? 'शायरी · दिल की चिट्ठियाँ · ख़ास तोहफ़ा'
                  : 'Handwritten Shayari · Sealed Letters · Shared Keepsake'}
              </p>

              <h1
                className="font-serif font-bold tracking-tight text-[#1B1518] leading-[1.2] max-w-xl [text-wrap:balance]"
                style={{ fontSize: 'clamp(2.15rem, 3.8vw, 3.25rem)' }}
              >
                {lang === 'hi'
                  ? `${data.profile.partnerName} के नाम, लफ़्ज़ों में बुना एक ख़ास एहसास।`
                  : `Words & Keepsakes Written Exclusively for ${data.profile.partnerName}.`}
              </h1>

              <p className="text-base text-[#5A4E54] leading-relaxed max-w-xl">
                {lang === 'hi'
                  ? 'यहाँ आप अपनी ख़ुद की शायरी लिखकर सुंदर कार्ड बना सकते हैं, बंद लिफ़ाफ़ों में दिल की चिट्ठियाँ रख सकते हैं और प्यार के वादों के साथ यह पूरा तोहफ़ा अपने पार्टनर को भेज सकते हैं।'
                  : 'Compose your own Shayari onto collectible cards, seal heartfelt letters for quiet moments, craft redeemable love promises, and send the entire keepsake as an interactive gift link.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#shayari-studio"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1B1518] hover:bg-[#31262C] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1518]"
                >
                  {lang === 'hi' ? 'शायरी लिखें' : 'Write Shayari'}
                </a>

                <button
                  type="button"
                  onClick={handleCopyClick}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1B1518] bg-white border border-[#DED5DA] hover:border-[#C81E4C]/50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E4C]"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#C81E4C]" />
                      <span>{lang === 'hi' ? 'गिफ़्ट लिंक कॉपी हुआ' : 'Gift Link Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#6B5E65]" />
                      <span>{lang === 'hi' ? 'गिफ़्ट लिंक कॉपी करें' : 'Copy Gift Link'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dedication & Couple Name Personalizer */}
            <div className="bg-white border border-[#E6DFE3] rounded-xl p-5">
              {!editingProfile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs text-[#6B5E65]">
                      <span>{data.profile.partnerName}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span>{data.profile.milestoneDate}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft(data.profile);
                        setEditingProfile(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C81E4C] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'नाम व संदेश बदलें' : 'Edit Names'}</span>
                    </button>
                  </div>
                  <p className="font-serif text-sm text-[#1B1518] leading-relaxed">
                    “{data.profile.dedication}”
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="block">
                      <span className="block text-xs font-medium text-[#6B5E65] mb-1">
                        {lang === 'hi' ? 'पार्टनर का नाम' : 'Partner Name'}
                      </span>
                      <input
                        type="text"
                        value={draft.partnerName}
                        onChange={(e) => setDraft({ ...draft, partnerName: e.target.value })}
                        maxLength={40}
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-xs font-medium text-[#6B5E65] mb-1">
                        {lang === 'hi' ? 'आपका नाम' : 'Your Name'}
                      </span>
                      <input
                        type="text"
                        value={draft.senderName}
                        onChange={(e) => setDraft({ ...draft, senderName: e.target.value })}
                        maxLength={40}
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-xs font-medium text-[#6B5E65] mb-1">
                        {lang === 'hi' ? 'ख़ास तारीख़' : 'Special Date'}
                      </span>
                      <input
                        type="text"
                        value={draft.milestoneDate}
                        onChange={(e) => setDraft({ ...draft, milestoneDate: e.target.value })}
                        maxLength={40}
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C]"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="block text-xs font-medium text-[#6B5E65] mb-1">
                      {lang === 'hi' ? 'समर्पण संदेश (Dedication)' : 'Dedication Note'}
                    </span>
                    <textarea
                      rows={2}
                      value={draft.dedication}
                      onChange={(e) => setDraft({ ...draft, dedication: e.target.value })}
                      maxLength={240}
                      className="w-full px-3 py-2 text-sm bg-[#FAF8F9] border border-[#DED5DA] rounded-lg focus:outline-none focus:border-[#C81E4C] resize-none"
                    />
                  </label>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-3 py-1.5 text-xs font-medium text-[#6B5E65] hover:text-[#1B1518] cursor-pointer"
                    >
                      {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#C81E4C] hover:bg-[#AD1740] rounded-lg cursor-pointer"
                    >
                      {lang === 'hi' ? 'सेव करें' : 'Save'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Matching Height Editorial Visual */}
          <div className="lg:col-span-6">
            <div className="h-full min-h-[320px] rounded-2xl overflow-hidden border border-[#E6DFE3] bg-[#EFEAEF]">
              <ResilientImage
                src={ASSET_IMAGES.heroAtelier}
                alt="Handwritten cotton paper poetry notebook with brass pen and dried rose petals"
                fallbackTitle={lang === 'hi' ? 'महफ़िल शायरी डायरी' : 'Mehfil Poetry Journal'}
                className="w-full h-full lg:h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Keepsake Summary Strip Below Hero Split */}
        <div className="mt-10 pt-8 pb-8 border-t border-b border-[#E6DFE3] grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="font-serif text-2xl font-bold text-[#1B1518] tabular-nums">
              {data.shayaris.length}
            </div>
            <div className="text-xs text-[#6B5E65] mt-1">
              {lang === 'hi' ? 'लिखी गई शायरी' : 'Shayari Written'}
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-[#1B1518] tabular-nums">
              {data.letters.length}
            </div>
            <div className="text-xs text-[#6B5E65] mt-1">
              {lang === 'hi' ? 'दिल की चिट्ठियाँ' : 'Sealed Letters'}
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-[#1B1518] tabular-nums">
              {data.vouchers.length}
            </div>
            <div className="text-xs text-[#6B5E65] mt-1">
              {lang === 'hi' ? 'प्यार के वादे' : 'Love Vouchers'}
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-[#1B1518] tabular-nums">
              {data.memories.length}
            </div>
            <div className="text-xs text-[#6B5E65] mt-1">
              {lang === 'hi' ? 'सहेजी यादें' : 'Saved Memories'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
