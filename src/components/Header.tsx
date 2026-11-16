import { Language } from '../types/keepsake';

interface HeaderProps {
  lang: Language;
  onOpenGift: () => void;
}

export function Header({ lang, onOpenGift }: HeaderProps) {
  const navItems =
    lang === 'hi'
      ? [
          { href: '#shayari-studio', label: 'शायरी' },
          { href: '#love-letters', label: 'चिट्ठियाँ' },
          { href: '#love-vouchers', label: 'वादे' },
          { href: '#memory-timeline', label: 'यादें' },
        ]
      : [
          { href: '#shayari-studio', label: 'Shayari' },
          { href: '#love-letters', label: 'Letters' },
          { href: '#love-vouchers', label: 'Promises' },
          { href: '#memory-timeline', label: 'Memories' },
        ];

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F9]/95 backdrop-blur-sm border-b border-[#E6DFE3]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="font-serif text-xl font-bold tracking-tight text-[#1B1518] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C81E4C]"
        >
          Mehfil
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A4E54]">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#1B1518] hover:underline underline-offset-4 decoration-[#C81E4C]/60 transition-colors whitespace-nowrap shrink-0 py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C81E4C]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenGift}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#C81E4C] hover:bg-[#AD1740] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E4C]"
          >
            {lang === 'hi' ? 'तोहफ़ा देखें' : 'Open Gift'}
          </button>
        </div>
      </div>
    </header>
  );
}
