import { KeepsakeData, Language, ShayariMood, ShayariPaperTheme } from '../types/keepsake';

export const ASSET_IMAGES = {
  heroAtelier: '/src/assets/images/hero_shayari_atelier_1794838090281.jpg',
  waxEnvelope: '/src/assets/images/keepsake_wax_envelope_1794838089744.jpg',
  teaEvening: '/src/assets/images/memory_tea_evening_1794838091093.jpg',
  starlightLantern: '/src/assets/images/promise_starlight_lantern_1794838090956.jpg',
} as const;

export const MOOD_LABELS: Record<ShayariMood, Record<Language, string>> = {
  ishq: { hi: 'इश्क़', en: 'Devotion' },
  muskaan: { hi: 'मुस्कान', en: 'Smile' },
  intezaar: { hi: 'इंतज़ार', en: 'Longing' },
  waada: { hi: 'वादा', en: 'Promise' },
  yaad: { hi: 'यादें', en: 'Memories' },
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
    label: { hi: 'हाथीदाँत काग़ज़', en: 'Alabaster Cotton' },
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
    label: { hi: 'गुल-ए-सहर', en: 'Rosewater Silk' },
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
    label: { hi: 'शाम-ए-ग़ज़ल', en: 'Moonlit Plum' },
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
    label: { hi: 'स्याही रात', en: 'Midnight Ink' },
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

export const POETIC_STARTERS: { mood: ShayariMood; hi: string; en: string }[] = [
  {
    mood: 'ishq',
    hi: 'तुम्हारे नाम से ही मेरी सुबह की रौशनी होती है,\n...',
    en: 'My mornings begin only when your name crosses my mind,\n...',
  },
  {
    mood: 'muskaan',
    hi: 'तुम्हारी एक मुस्कान पर ये सारा जहाँ ठहर जाता है,\n...',
    en: 'The whole world pauses gently at a single smile of yours,\n...',
  },
  {
    mood: 'waada',
    hi: 'हाथ थामे रहना यूँ ही हर धूप और छांव में,\n...',
    en: 'Keep holding my hand through every sun and quiet shadow,\n...',
  },
  {
    mood: 'yaad',
    hi: 'शाम की चाय और तुम्हारी अनकही बातें आज भी ताज़ा हैं,\n...',
    en: 'Evening tea and your unspoken stories still linger warmly,\n...',
  },
];

export const RHYME_LEXICON: string[] = [
  'सुकून',
  'चाँदनी',
  'धड़कन',
  'दस्तक',
  'चराग़',
  'ख़ामोशी',
  'मुलाक़ात',
  'एहसास',
  'तबस्सुम',
  'रौशनी',
  'आरज़ू',
  'साया',
];

export const DEFAULT_KEEPSAKE_DATA: KeepsakeData = {
  profile: {
    partnerName: 'अनाया',
    senderName: 'आरव',
    milestoneDate: '14 फ़रवरी 2024',
    dedication:
      'यह छोटा सा कोना सिर्फ़ तुम्हारे नाम है — हर उस मुस्कान, हर अनकही बात और हर खूबसूरत पल के लिए जो तुमने मेरी ज़िंदगी में जोड़ा है।',
  },
  shayaris: [
    {
      id: 'sh-1',
      title: 'पहली नज़्म तुम्हारे नाम',
      lines:
        'तुम साथ हो तो हर शाम महफ़िल सी लगती है,\nख़ामोशियों में भी एक गुफ़्तगू सी चलती है।\nलफ़्ज़ कम पड़ जाते हैं जब भी ज़िक्र तुम्हारा हो,\nतुम्हारी मुस्कान ही मेरी सबसे प्यारी ग़ज़ल बनती है।',
      mood: 'ishq',
      theme: 'alabaster',
      createdAt: '16 नवम्बर 2026',
      isFavorite: true,
    },
    {
      id: 'sh-2',
      title: 'बारिश और चाय',
      lines:
        'भीगी हुई खिड़की के पास दो प्याली चाय रख ली है,\nमैंने हर दुआ में बस तुम्हारी हँसी मांग ली है।',
      mood: 'yaad',
      theme: 'plum',
      createdAt: '12 नवम्बर 2026',
      isFavorite: false,
    },
    {
      id: 'sh-3',
      title: 'तुम्हारे लिए वादा',
      lines:
        'वक़्त चाहे जैसा भी करवट ले इस सफ़र में,\nमेरा हाथ हमेशा तुम्हारे काँधे पर सुकून बनकर रहेगा।',
      mood: 'waada',
      theme: 'rosewater',
      createdAt: '10 नवम्बर 2026',
      isFavorite: true,
    },
  ],
  letters: [
    {
      id: 'lt-1',
      prompt: 'जब दिन थोड़ा थका देने वाला लगे...',
      body: 'बस एक गहरी साँस लो और याद रखो कि दिन चाहे कितना भी भारी हो, शाम को सुनने के लिए मैं हमेशा यहीं हूँ। तुम्हें हर वक़्त मज़बूत बने रहने की ज़रूरत नहीं — मेरे पास तुम बिना किसी बोझ के सिर्फ़ ख़ुद रह सकती हो।',
      signOff: 'हमेशा तुम्हारा, सबसे क़रीब',
      createdAt: '14 नवम्बर 2026',
      opened: false,
    },
    {
      id: 'lt-2',
      prompt: 'जब तुम्हें मेरी अचानक बहुत याद आए...',
      body: 'आँखें बंद करके उस शाम को याद करो जब हम बिना किसी घड़ी को देखे हँसते रहे थे। दूरी सिर्फ़ मीलों में होती है, दिल के कोने में तुम हर पल यहीं साथ हो।',
      signOff: 'ढेर सारे प्यार के साथ',
      createdAt: '15 नवम्बर 2026',
      opened: false,
    },
  ],
  reasons: [
    { id: 'rs-1', text: 'जिस तरह तुम किसी की बात सुनते वक़्त आँखों से मुस्कुराती हो।' },
    { id: 'rs-2', text: 'चाय पीते समय छोटी-छोटी बातों पर तुम्हारा ख़ुश हो जाना।' },
    { id: 'rs-3', text: 'मुश्किल दिनों में भी तुम्हारे पास होने से मिलने वाला सुकून।' },
    { id: 'rs-4', text: 'तुम्हारी आवाज़ में वह अपनापन जो एक पल में सब ठीक कर देता है।' },
  ],
  vouchers: [
    {
      id: 'vc-1',
      title: 'सुकून भरी शाम की चाय और लॉन्ग ड्राइव',
      detail: 'बिना फ़ोन देखे, सिर्फ़ तुम्हारी पसंद के गाने और गर्मागर्म चाय।',
      validFor: 'जब भी तुम्हारा दिल करे',
      redeemed: false,
    },
    {
      id: 'vc-2',
      title: 'तुम्हारी पसंद की पूरी फ़िल्म नाइट',
      detail: 'पॉपकॉर्न, कंबल और इस बार फ़िल्म चुनने का पूरा हक़ सिर्फ़ तुम्हारा।',
      validFor: 'किसी भी वीकेंड पर',
      redeemed: false,
    },
    {
      id: 'vc-3',
      title: 'हाथ से बना डिनर और तारीफ़ों का दिन',
      detail: 'रसोई की पूरी ज़िम्मेदारी मेरी, तुम्हें सिर्फ़ आराम करना है।',
      validFor: 'कभी भी इस्तेमाल करें',
      redeemed: false,
    },
  ],
  memories: [
    {
      id: 'mm-1',
      dateLabel: 'अक्टूबर 2024',
      place: 'बारिश वाली शाम',
      title: 'पहली बार साथ पी हुई मसाला चाय',
      story: 'बाहर हल्की बूँदाबाँदी थी और बातों का सिलसिला थमने का नाम नहीं ले रहा था। वही शाम थी जब लगा कि वक़्त यहीं रुक जाए।',
      imageUrl: ASSET_IMAGES.teaEvening,
    },
    {
      id: 'mm-2',
      dateLabel: 'दिसम्बर 2024',
      place: 'झील का किनारा',
      title: 'रोशनी और अनकहे वादे',
      story: 'शाम ढलते ही पानी पर तैरते दीयों की रोशनी में हमने एक-दूसरे से वादा किया था कि चाहे जो हो, हर साल इस पल को याद रखेंगे।',
      imageUrl: ASSET_IMAGES.starlightLantern,
    },
  ],
};
