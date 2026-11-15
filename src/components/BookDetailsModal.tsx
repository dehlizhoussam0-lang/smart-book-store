import { useState } from 'react';
import { X, Check, Copy, ShoppingBag, Phone, FileText, ExternalLink } from 'lucide-react';
import { Book, Language } from '../types/book';
import { getLocalizedBookFields } from '../data/initialBooks';
import { getCategoryLabel, TRANSLATIONS } from '../i18n/translations';
import { BookCoverImage } from './BookCoverImage';

interface BookDetailsModalProps {
  lang: Language;
  book: Book | null;
  isInBag: boolean;
  onClose: () => void;
  onAddToBag: (book: Book) => void;
  onOpenBag: () => void;
}

export function BookDetailsModal({
  lang,
  book,
  isInBag,
  onClose,
  onAddToBag,
  onOpenBag,
}: BookDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!book) return null;

  const t = TRANSLATIONS[lang];
  const localized = getLocalizedBookFields(book, lang);
  const isFree =
    localized.price.trim().toLowerCase() === 'free' ||
    localized.price.trim() === 'مجاني';

  const handleCopyContact = async () => {
    try {
      await navigator.clipboard.writeText(localized.contact);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
    >
      <div
        className="bg-[#1A1A1A] border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 sm:grid-cols-12">
          {/* Book Cover */}
          <div className="sm:col-span-5 bg-zinc-950 aspect-[3/4] sm:aspect-auto sm:h-full max-h-72 sm:max-h-none overflow-hidden">
            <BookCoverImage
              src={book.cover}
              title={localized.title}
              author={localized.author}
            />
          </div>

          {/* Contiguous Purchase Module */}
          <div className="sm:col-span-7 p-6 flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span>{getCategoryLabel(book.category, lang)}</span>
                  {book.pages && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {t.pagesSuffix(book.pages)}
                      </span>
                    </>
                  )}
                  {book.publishedYear && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{book.publishedYear}</span>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t.closeBookModalAria}
                  className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3
                id="book-modal-title"
                className="font-display font-bold text-xl text-white mt-2 leading-snug"
              >
                {localized.title}
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                {t.authorPrefix} {localized.author}
              </p>

              <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
                {localized.description || t.defaultBookDesc}
              </p>

              {/* Contact / Payment Details */}
              <div className="mt-5 p-3.5 rounded-xl bg-[#0F0F0F] border border-zinc-800">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span>{t.contactPaymentHeading}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyContact}
                    className="text-xs text-[#FACC15] hover:text-[#EAB308] inline-flex items-center gap-1 font-medium cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.copiedBtn}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyBtn}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm font-mono text-zinc-100 select-all break-words">
                  {localized.contact}
                </p>
              </div>

              {/* Attached Digital Book Content Status */}
              {book.contentUrl && (
                <div className="mt-3 p-3 rounded-xl bg-[#0F0F0F] border border-zinc-800 flex items-center justify-between gap-3">
                  <span className="text-xs text-zinc-300 flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#FACC15] shrink-0" />
                    <span className="truncate">
                      {book.contentFileName || t.digitalFileAttachedNote}
                    </span>
                  </span>
                  {isFree && (
                    <a
                      href={book.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={book.contentFileName || undefined}
                      className="text-xs font-bold text-[#FACC15] hover:underline inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
                    >
                      <span>{t.readFreeNowBtn}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Price & Primary CTA */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-4">
              <div>
                <span className="block text-xs text-zinc-400">{t.priceLabel}</span>
                <span className="font-mono tabular-nums font-bold text-lg text-[#FACC15]">
                  {localized.price}
                </span>
              </div>

              {isInBag ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBag();
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Check className="w-4 h-4 text-[#FACC15]" />
                  <span>{t.viewInBagBtn}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onAddToBag(book)}
                  className="bg-[#FACC15] hover:bg-[#EAB308] text-black px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isFree ? t.addForFreeBtn : t.addToBagBtn}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
