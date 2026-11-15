import { BookOpen, Upload, Globe } from 'lucide-react';
import { Language } from '../types/book';
import { TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  lang: Language;
  onToggleLanguage: () => void;
  onLogoClick: () => void;
  onOpenPublish: () => void;
  onOpenBag: () => void;
  bagCount: number;
}

export function Navbar({
  lang,
  onToggleLanguage,
  onLogoClick,
  onOpenPublish,
  onOpenBag,
  bagCount,
}: NavbarProps) {
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single-line Brand Wordmark (with 10-click hidden admin trigger) */}
        <button
          type="button"
          onClick={onLogoClick}
          title={t.logoTooltip}
          className="flex items-center gap-2.5 text-start whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FACC15] rounded-lg cursor-pointer"
        >
          <span className="w-9 h-9 rounded-lg bg-[#FACC15] text-black flex items-center justify-center transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
            <BookOpen className="w-5 h-5" strokeWidth={2.2} />
          </span>
          <span className="font-display font-bold text-base sm:text-lg text-white tracking-tight whitespace-nowrap shrink-0">
            {t.brandName}
          </span>
        </button>

        {/* Zone 2: Concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <a
            href="#catalog"
            className="hover:text-white hover:underline underline-offset-8 decoration-[#FACC15] transition-colors whitespace-nowrap shrink-0"
          >
            {t.navCatalog}
          </a>
          <a
            href="#categories-bar"
            className="hover:text-white hover:underline underline-offset-8 decoration-[#FACC15] transition-colors whitespace-nowrap shrink-0"
          >
            {t.navCategories}
          </a>
          <a
            href="#publishing-guide"
            className="hover:text-white hover:underline underline-offset-8 decoration-[#FACC15] transition-colors whitespace-nowrap shrink-0"
          >
            {t.navAuthors}
          </a>
          <button
            type="button"
            onClick={onOpenBag}
            className="hover:text-white hover:underline underline-offset-8 decoration-[#FACC15] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>{t.navBag}</span>
            {bagCount > 0 && (
              <span className="font-mono tabular-nums text-xs text-[#FACC15] font-semibold">
                ({bagCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Language Switcher + Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            className="md:hidden text-xs font-medium text-zinc-300 hover:text-white px-2 py-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.mobileBag}
            {bagCount > 0 ? ` (${bagCount})` : ''}
          </button>

          <button
            type="button"
            onClick={onToggleLanguage}
            aria-label={t.langToggleAria}
            className="bg-[#1A1A1A] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 px-3 py-2 rounded-lg text-xs font-mono font-semibold inline-flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#FACC15]" />
            <span>{t.langToggleLabel}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPublish}
            className="bg-[#FACC15] hover:bg-[#EAB308] text-black px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 sm:gap-2 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]"
          >
            <Upload className="w-4 h-4" strokeWidth={2.2} />
            <span>{t.publishCta}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
