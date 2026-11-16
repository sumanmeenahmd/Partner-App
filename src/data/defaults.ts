import { KeepsakeData, Language, ShayariMood, ShayariPaperTheme } from '../types/keepsake';

export const ASSET_IMAGES = {
  heroAtelier: '/src/assets/images/hero_shayari_atelier_1794838090281.jpg',
  waxEnvelope: '/src/assets/images/keepsake_wax_envelope_1794838089744.jpg',
  teaEvening: '/src/assets/images/memory_tea_evening_1794838091093.jpg',
  starlightLantern: '/src/assets/images/promise_starlight_lantern_1794838090956.jpg',
} as const;

export const MOOD_LABELS: Record<ShayariMood, Record<Language, string>> = {
  ishq: { hinglish: 'Ishq', en: 'Devotion' },
  muskaan: { hinglish: 'Muskaan', en: 'Smile' },
  intezaar: { hinglish: 'Intezaar', en: 'Longing' },
  waada: { hinglish: 'Waada', en: 'Promise' },
  yaad: { hinglish: 'Yaadein', en: 'Memories' },
};

export const PAPER_THEME_META: Record<
  ShayariPaperTheme,
  {
    label: Record<Language, string>;
    bgClass: string;
    textClass: string;
    mutedClass: string;
    borderClass: string;
    canvasBg: string;
    canvasText: string;
    canvasMuted: string;
    canvasAccent: string;
  }
> = {
  alabaster: {
    label: { hinglish: 'Classic Ivory', en: 'Alabaster Cotton' },
    bgClass: 'bg-white',
    textClass: 'text-[#1B1518]',
    mutedClass: 'text-[#6B5E65]',
    borderClass: 'border-[#E6DFE3]',
    canvasBg: '#FFFFFF',
    canvasText: '#1B1518',
    canvasMuted: '#6B5E65',
    canvasAccent: '#C81E4C',
  },
  rosewater: {
    label: { hinglish: 'Soft Rose', en: 'Rosewater Silk' },
    bgClass: 'bg-[#FDF4F6]',
    textClass: 'text-[#28131A]',
    mutedClass: 'text-[#7C5360]',
    borderClass: 'border-[#F0D6DE]',
    canvasBg: '#FDF4F6',
    canvasText: '#28131A',
    canvasMuted: '#7C5360',
    canvasAccent: '#C81E4C',
  },
  plum: {
    label: { hinglish: 'Evening Plum', en: 'Moonlit Plum' },
    bgClass: 'bg-[#261620]',
    textClass: 'text-[#FAF5F7]',
    mutedClass: 'text-[#CBB8C1]',
    borderClass: 'border-[#3E2735]',
    canvasBg: '#261620',
    canvasText: '#FAF5F7',
    canvasMuted: '#CBB8C1',
    canvasAccent: '#F48CA7',
  },
  ink: {
    label: { hinglish: 'Midnight Black', en: 'Midnight Ink' },
    bgClass: 'bg-[#141215]',
    textClass: 'text-[#F5F2F4]',
    mutedClass: 'text-[#ABA1A7]',
    borderClass: 'border-[#2D282F]',
    canvasBg: '#141215',
    canvasText: '#F5F2F4',
    canvasMuted: '#ABA1A7',
    canvasAccent: '#E85D82',
  },
};

export const POETIC_STARTERS: { mood: ShayariMood; hinglish: string; en: string }[] = [
  {
    mood: 'ishq',
    hinglish: 'Tumhare naam se hi meri subah ki roshni hoti hai,\n...',
    en: 'My mornings begin only when your name crosses my mind,\n...',
  },
  {
    mood: 'muskaan',
    hinglish: 'Tumhari ek muskaan par ye saara jahan thehar jata hai,\n...',
    en: 'The whole world pauses gently at a single smile of yours,\n...',
  },
  {
    mood: 'waada',
    hinglish: 'Haath thame rehna yun hi har dhoop aur chhaon mein,\n...',
    en: 'Keep holding my hand through every sun and quiet shadow,\n...',
  },
  {
    mood: 'yaad',
    hinglish: 'Shaam ki chai aur tumhari baatein aaj bhi dil ke paas hain,\n...',
    en: 'Evening tea and your unspoken stories still linger warmly,\n...',
  },
];

export const RHYME_LEXICON: string[] = [
  'Sukoon',
  'Chaandni',
  'Dhadkan',
  'Muskaan',
  'Khamoshi',
  'Mulakaat',
  'Ehsaas',
  'Roshni',
  'Khwaab',
  'Saath',
  'Waada',
  'Baarish',
];

export const DEFAULT_KEEPSAKE_DATA: KeepsakeData = {
  profile: {
    partnerName: 'Anaya',
    senderName: 'Aarav',
    milestoneDate: '14 Feb 2024',
    dedication:
      'Yeh chhota sa space sirf tumhare naam hai — har us muskaan, har late-night baat aur har pyare pal ke liye jo tumne meri life mein add kiya hai.',
  },
  shayaris: [
    {
      id: 'sh-1',
      title: 'Pehli Nazm Tumhare Naam',
      lines:
        'Tum saath ho to har shaam mehfil si lagti hai,\nKhamoshiyon mein bhi ek pyari baat chalti hai.\nLafz kam pad jate hain jab bhi zikr tumhara ho,\nTumhari muskaan hi meri sabse pyari shayari banti hai.',
      mood: 'ishq',
      theme: 'alabaster',
      imageUrl: ASSET_IMAGES.heroAtelier,
      photoLayout: 'framed',
      createdAt: '16 Nov 2026',
      isFavorite: true,
    },
    {
      id: 'sh-2',
      title: 'Baarish Aur Chai',
      lines:
        'Bheegi hui khidki ke paas do cup chai rakh li hai,\nMaine har dua mein bas tumhari hansi maang li hai.',
      mood: 'yaad',
      theme: 'plum',
      imageUrl: ASSET_IMAGES.teaEvening,
      photoLayout: 'backdrop',
      createdAt: '12 Nov 2026',
      isFavorite: false,
    },
    {
      id: 'sh-3',
      title: 'Tumhare Liye Waada',
      lines:
        'Waqt chahe jaisa bhi mod le is safar mein,\nMera haath hamesha tumhare liye sukoon bankar rahega.',
      mood: 'waada',
      theme: 'rosewater',
      photoLayout: 'none',
      createdAt: '10 Nov 2026',
      isFavorite: true,
    },
  ],
  letters: [
    {
      id: 'lt-1',
      prompt: 'Jab din thoda thaka dene wala lage...',
      body: 'Bas ek gehri saans lo aur yaad rakho ki din chahe kitna bhi heavy ho, shaam ko tumhari baat sunne ke liye main hamesha yahin hoon. Tumhe har waqt strong banne ki zaroorat nahi — mere paas tum bina kisi tension ke bas khud reh sakti ho.',
      signOff: 'Always yours, sabse kareeb',
      createdAt: '14 Nov 2026',
      opened: false,
    },
    {
      id: 'lt-2',
      prompt: 'Jab tumhe meri achanak bahut yaad aaye...',
      body: 'Aankhein band karke us shaam ko yaad karo jab hum bina time dekhe hanste rahe the. Doori sirf distance mein hoti hai, dil ke kone mein tum har pal yahin saath ho.',
      signOff: 'Dher saare pyar ke saath',
      createdAt: '15 Nov 2026',
      opened: false,
    },
  ],
  reasons: [
    { id: 'rs-1', text: 'Jis tarah tum kisi ki baat sunte waqt aankhon se smile karti ho.' },
    { id: 'rs-2', text: 'Chai peete time chhoti-chhoti baaton par tumhara khush ho jana.' },
    { id: 'rs-3', text: 'Mushkil dino mein bhi tumhare paas hone se milne wala sukoon.' },
    { id: 'rs-4', text: 'Tumhari aawaz mein woh apnapan jo ek second mein mood theek kar deta hai.' },
  ],
  vouchers: [
    {
      id: 'vc-1',
      title: 'Sukoon Bhari Chai Aur Long Drive',
      detail: 'Bina phone dekhe, sirf tumhari favorite playlist aur garma-garam chai.',
      validFor: 'Jab bhi tumhara mood ho',
      redeemed: false,
    },
    {
      id: 'vc-2',
      title: 'Tumhari Choice Ki Movie Night',
      detail: 'Snacks, cozy setup aur is baar movie choose karne ka full right sirf tumhara.',
      validFor: 'Kisi bhi weekend par',
      redeemed: false,
    },
    {
      id: 'vc-3',
      title: 'Home-Cooked Dinner Treat',
      detail: 'Kitchen ki poori responsibility meri, tumhe bas aaram se baithna hai.',
      validFor: 'Kabhi bhi claim karo',
      redeemed: false,
    },
  ],
  memories: [
    {
      id: 'mm-1',
      dateLabel: 'Oct 2024',
      place: 'Baarish Wali Shaam',
      title: 'Pehli Baar Saath Pi Hui Masala Chai',
      story: 'Bahar halki baarish thi aur baaton ka silsila khatam hi nahi ho raha tha. Wahi shaam thi jab laga ki waqt yahin ruk jaye.',
      imageUrl: ASSET_IMAGES.teaEvening,
    },
    {
      id: 'mm-2',
      dateLabel: 'Dec 2024',
      place: 'Lake Side',
      title: 'Lights Aur Ankahi Baatein',
      story: 'Shaam dhalte hi paani par tairte lanterns ki roshni mein humne decide kiya tha ki har saal is din ko yaad rakhenge.',
      imageUrl: ASSET_IMAGES.starlightLantern,
    },
  ],
};
