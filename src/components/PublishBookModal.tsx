import { useState, useRef } from 'react';
import {
  X,
  PenTool,
  FileUp,
  FileText,
  Trash2,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { BOOK_CATEGORIES, Book, BookCategory, Language } from '../types/book';
import { PRESET_COVERS } from '../data/initialBooks';
import { getCategoryLabel, TRANSLATIONS } from '../i18n/translations';

interface PublishBookModalProps {
  lang: Language;
  isOpen: boolean;
  user: User | null;
  onSignIn: () => Promise<void>;
  onClose: () => void;
  onSubmit: (book: Omit<Book, 'id' | 'status' | 'authorUid'>) => Promise<void>;
}

const MAX_FILE_BYTES = 350 * 1024; // 350 KB so base64 data URI fits safely under Firestore 1MB limit

export function PublishBookModal({
  lang,
  isOpen,
  user,
  onSignIn,
  onClose,
  onSubmit,
}: PublishBookModalProps) {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BookCategory>('تطوير الذات');
  const [price, setPrice] = useState('');
  const [cover, setCover] = useState(PRESET_COVERS[0].url);
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [contentFileName, setContentFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setFileError(t.fileTooLargeError);
      e.target.value = '';
      return;
    }

    setFileError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setContentUrl(reader.result);
        setContentFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    setContentUrl('');
    setContentFileName('');
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!author.trim() || !title.trim() || !price.trim() || !cover.trim() || !contact.trim()) {
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);
    try {
      await onSubmit({
        author: author.trim(),
        title: title.trim(),
        category,
        price: price.trim(),
        cover: cover.trim(),
        contact: contact.trim(),
        description: description.trim() || undefined,
        contentUrl: contentUrl.trim() || undefined,
        contentFileName: contentFileName || undefined,
        publishedYear: '2026',
      });

      setAuthor('');
      setTitle('');
      setCategory('تطوير الذات');
      setPrice('');
      setCover(PRESET_COVERS[0].url);
      setContact('');
      setDescription('');
      setContentUrl('');
      setContentFileName('');
      setFileError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    } catch {
      setSubmitError(t.firestoreSaveError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-modal-title"
    >
      <div
        className="bg-[#1A1A1A] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3
            id="publish-modal-title"
            className="font-display text-xl font-bold text-[#FACC15] flex items-center gap-2"
          >
            <PenTool className="w-5 h-5" />
            <span>{t.publishModalTitle}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closePublishAria}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
          {t.publishModalSubtitle}
        </p>

        {!user ? (
          <div className="bg-[#0F0F0F] border border-zinc-800 rounded-xl p-5 text-center space-y-4">
            <p className="text-xs text-zinc-300 leading-relaxed">
              {t.signInPublishPrompt}
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
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="text-xs text-zinc-400 bg-[#0F0F0F] border border-zinc-800 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
              <span className="truncate">
                {t.signedInAsLabel}{' '}
                <span className="text-zinc-200 font-medium">
                  {user.email || user.displayName}
                </span>
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                {t.authorFieldLabel}
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t.authorFieldPlaceholder}
                className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FACC15] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                {t.titleFieldLabel}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.titleFieldPlaceholder}
                className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FACC15] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  {t.categoryFieldLabel}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BookCategory)}
                  className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FACC15] outline-none"
                >
                  {BOOK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {getCategoryLabel(cat, lang)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  {t.priceFieldLabel}
                </label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={t.priceFieldPlaceholder}
                  className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FACC15] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                {t.coverFieldLabel}
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {PRESET_COVERS.map((preset, idx) => {
                  const label = t.presetCoverLabels[idx] ?? `Cover ${idx + 1}`;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setCover(preset.url)}
                      className={`rounded-lg overflow-hidden border transition-all cursor-pointer aspect-[3/4] ${
                        cover === preset.url
                          ? 'border-[#FACC15] ring-2 ring-[#FACC15]/40'
                          : 'border-zinc-800 opacity-75 hover:opacity-100'
                      }`}
                      title={label}
                    >
                      <img
                        src={preset.url}
                        alt={label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                required
                value={cover}
                onChange={(e) => setCover(e.target.value)}
                placeholder="https://..."
                dir="ltr"
                className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 text-left focus:border-[#FACC15] outline-none"
              />
            </div>

            {/* Book File (PDF / EPUB) or Reading Link */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                {t.contentFieldLabel}
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.epub,.txt,.doc,.docx,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {contentFileName ? (
                <div className="flex items-center justify-between gap-2 bg-[#0F0F0F] border border-[#FACC15]/40 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#FACC15] shrink-0" />
                    <span className="text-xs text-zinc-200 truncate">
                      {t.attachedFilePrefix}{' '}
                      <span dir="ltr" className="font-mono text-white">
                        {contentFileName}
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    aria-label={t.removeFileBtn}
                    className="text-zinc-400 hover:text-red-400 p-1 rounded cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-stretch gap-2">
                  <input
                    type="url"
                    value={contentUrl}
                    onChange={(e) => {
                      setContentUrl(e.target.value);
                      if (fileError) setFileError('');
                    }}
                    placeholder={t.contentUrlPlaceholder}
                    dir="ltr"
                    className="flex-1 min-w-0 bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 text-left focus:border-[#FACC15] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#0F0F0F] hover:bg-zinc-800 border border-zinc-700 hover:border-[#FACC15] text-zinc-200 px-3 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <FileUp className="w-4 h-4 text-[#FACC15]" />
                    <span>{t.uploadFileBtn}</span>
                  </button>
                </div>
              )}

              {fileError && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                {t.descFieldLabel}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.descFieldPlaceholder}
                className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FACC15] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                {t.authorContactLabel}
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={t.authorContactPlaceholder}
                className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FACC15] outline-none"
              />
            </div>

            {submitError && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FACC15] hover:bg-[#EAB308] disabled:opacity-60 text-black font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer mt-2"
            >
              {isSubmitting ? t.submittingText : t.submitPublishBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
