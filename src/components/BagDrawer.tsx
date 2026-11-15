import { useState } from 'react';
import { X, Trash2, CheckCircle2, ShoppingBag, AlertCircle, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';
import { Book, Language } from '../types/book';
import { getLocalizedBookFields } from '../data/initialBooks';
import { TRANSLATIONS } from '../i18n/translations';
import { BookCoverImage } from './BookCoverImage';

interface BagDrawerProps {
  lang: Language;
  isOpen: boolean;
  items: Book[];
  user: User | null;
  onSignIn: () => Promise<void>;
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onSubmitOrder: (customerName: string, customerContact: string) => Promise<string>;
}

export function BagDrawer({
  lang,
  isOpen,
  items,
  user,
  onSignIn,
  onClose,
  onRemoveItem,
  onSubmitOrder,
}: BagDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderReference, setOrderReference] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];

  const handleConfirmRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setIsSubmitting(true);
    try {
      const refNumber = await onSubmitOrder(customerName, customerPhone);
      setOrderReference(refNumber);
      setCustomerName('');
      setCustomerPhone('');
    } catch {
      setError(t.firestoreSaveError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDrawer = () => {
    setOrderReference(null);
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
      onClick={handleCloseDrawer}
      role="dialog"
      aria-modal="true"
      aria-label={t.bagTitle}
    >
      <div
        className="bg-[#1A1A1A] border-s border-zinc-800 w-full max-w-md h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FACC15]" />
            <span>{t.bagTitle}</span>
          </h3>
          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label={t.closeBagAria}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {orderReference ? (
            <div className="bg-[#0F0F0F] border border-zinc-800 rounded-xl p-6 text-center space-y-3 mt-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-white">
                {t.bagOrderSuccessTitle}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {t.bagOrderSuccessDescPrefix}{' '}
                <span
                  dir="ltr"
                  className="inline-block font-mono text-[#FACC15] font-semibold"
                >
                  {orderReference}
                </span>
                . {t.bagOrderSuccessDescSuffix}
              </p>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer mt-2"
              >
                {t.backToStoreBtn}
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto text-zinc-600" strokeWidth={1.5} />
              <p className="text-sm">{t.bagEmptyTitle}</p>
              <p className="text-xs text-zinc-500">{t.bagEmptySubtitle}</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => {
                  const localized = getLocalizedBookFields(item, lang);
                  return (
                    <div
                      key={item.id}
                      className="bg-[#0F0F0F] border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-16 rounded-md overflow-hidden shrink-0 bg-zinc-900">
                          <BookCoverImage src={item.cover} title={localized.title} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-display font-semibold text-sm text-white truncate">
                            {localized.title}
                          </h4>
                          <p className="text-xs text-zinc-400 truncate mt-0.5">
                            {localized.author}
                          </p>
                          <p className="text-xs font-mono tabular-nums text-[#FACC15] font-semibold mt-1">
                            {localized.price}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={t.removeItemAria(localized.title)}
                        className="text-zinc-500 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-800/70 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {!user ? (
                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {t.signInOrderPrompt}
                  </p>
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold py-2.5 rounded-xl text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t.signInWithGoogleBtn}</span>
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleConfirmRequest}
                  className="pt-4 border-t border-zinc-800 space-y-3"
                >
                  <h4 className="font-display font-semibold text-sm text-white">
                    {t.confirmRecipientHeading}
                  </h4>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">
                      {t.fullNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t.fullNamePlaceholder}
                      className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FACC15] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">
                      {t.contactInputLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={t.contactInputPlaceholder}
                      className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FACC15] outline-none"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-60 text-black font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    {isSubmitting ? t.submittingText : t.confirmOrderBtn(items.length)}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
