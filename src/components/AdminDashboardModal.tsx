import { useState } from 'react';
import {
  Shield,
  X,
  Check,
  Trash2,
  Inbox,
  KeyRound,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Book, Language } from '../types/book';
import { getLocalizedBookFields } from '../data/initialBooks';
import { getCategoryLabel, TRANSLATIONS } from '../i18n/translations';
import { BookCoverImage } from './BookCoverImage';

interface AdminDashboardModalProps {
  lang: Language;
  isOpen: boolean;
  user: User | null;
  books: Book[];
  onClose: () => void;
  onSignOut: () => Promise<void>;
  onApproveBook: (id: string) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
  onUpdatePassword: (newPass: string) => void;
}

type AdminTab = 'pending' | 'manage' | 'settings';

export function AdminDashboardModal({
  lang,
  isOpen,
  user,
  books,
  onClose,
  onSignOut,
  onApproveBook,
  onDeleteBook,
  onUpdatePassword,
}: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('pending');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newPass, setNewPass] = useState('');
  const [passFeedback, setPassFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];
  const pendingBooks = books.filter((b) => b.status === 'pending');
  const approvedBooks = books.filter((b) => b.status === 'approved');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.trim().length < 4) {
      setPassFeedback({
        type: 'error',
        text: t.newPassError,
      });
      return;
    }
    onUpdatePassword(newPass.trim());
    setNewPass('');
    setPassFeedback({
      type: 'success',
      text: t.newPassSuccess,
    });
  };

  const handleApprove = async (id: string) => {
    setBusyId(id);
    try {
      await onApproveBook(id);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await onDeleteBook(id);
      setConfirmDeleteId(null);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dashboard-title"
    >
      <div
        className="bg-[#1A1A1A] border border-zinc-800 rounded-2xl w-full max-w-4xl mx-auto flex flex-col h-full max-h-[88vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-zinc-800 flex justify-between items-center gap-3 bg-[#0F0F0F]/70">
          <div className="min-w-0">
            <h3
              id="admin-dashboard-title"
              className="font-display font-bold text-[#FACC15] flex items-center gap-2 text-base sm:text-lg"
            >
              <Shield className="w-5 h-5 shrink-0" />
              <span className="truncate">{t.adminDashboardTitle}</span>
            </h3>
            {user?.email && (
              <p className="text-xs text-zinc-400 font-mono truncate mt-0.5">
                {user.email}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={async () => {
                await onSignOut();
                onClose();
              }}
              className="text-xs text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.signOutBtn}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.closeAdminAria}
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 bg-[#1A1A1A] px-4 sm:px-6 gap-6 text-sm overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('pending');
              setConfirmDeleteId(null);
            }}
            className={`py-3.5 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'pending'
                ? 'font-bold border-[#FACC15] text-[#FACC15]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            {t.tabPending} (
            <span className="font-mono tabular-nums">{pendingBooks.length}</span>)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('manage');
              setConfirmDeleteId(null);
            }}
            className={`py-3.5 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'manage'
                ? 'font-bold border-[#FACC15] text-[#FACC15]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            {t.tabManage} (
            <span className="font-mono tabular-nums">{approvedBooks.length}</span>)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              setPassFeedback(null);
            }}
            className={`py-3.5 whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'font-bold border-[#FACC15] text-[#FACC15]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            {t.tabSettings}
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6">
          {activeTab === 'pending' && (
            <>
              {pendingBooks.length === 0 ? (
                <div className="text-center py-16 text-zinc-500">
                  <Inbox className="w-10 h-10 mx-auto mb-3 text-zinc-600" strokeWidth={1.5} />
                  <p className="text-sm">{t.noPendingText}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingBooks.map((book) => {
                    const localized = getLocalizedBookFields(book, lang);
                    const isBusy = busyId === book.id;
                    return (
                      <div
                        key={book.id}
                        className="bg-[#0F0F0F] border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div className="flex items-center gap-3.5 w-full min-w-0">
                          <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                            <BookCoverImage src={book.cover} title={localized.title} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-display font-bold text-white text-sm sm:text-base truncate">
                              {localized.title}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {t.authorLabelInline} {localized.author} ·{' '}
                              {getCategoryLabel(book.category, lang)} ·{' '}
                              <span className="font-mono tabular-nums text-zinc-200">
                                {localized.price}
                              </span>
                            </p>
                            <p className="text-xs text-[#FACC15] mt-1.5 font-mono break-all">
                              {t.authorContactInline} {localized.contact}
                            </p>
                            {book.contentUrl && (
                              <p className="text-xs text-zinc-300 mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-zinc-400">{t.bookContentInline}</span>
                                <a
                                  href={book.contentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={book.contentFileName || undefined}
                                  className="text-[#FACC15] hover:underline font-mono inline-flex items-center gap-1"
                                >
                                  <span>
                                    {book.contentFileName || t.previewContentBtn}
                                  </span>
                                </a>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleApprove(book.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-3.5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <Check className="w-4 h-4" />
                            <span>{t.approveBtn}</span>
                          </button>

                          {confirmDeleteId === book.id ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleDelete(book.id)}
                                className="bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                              >
                                {t.confirmRejectBtn}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                              >
                                {t.cancelBtn}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(book.id)}
                              className="bg-red-600/15 text-red-400 hover:bg-red-600 hover:text-white px-3.5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>{t.rejectBtn}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'manage' && (
            <>
              {approvedBooks.length === 0 ? (
                <div className="text-center py-16 text-zinc-500">
                  <p className="text-sm">{t.noApprovedText}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {approvedBooks.map((book) => {
                    const localized = getLocalizedBookFields(book, lang);
                    const isBusy = busyId === book.id;
                    return (
                      <div
                        key={book.id}
                        className="bg-[#0F0F0F] border border-zinc-800 p-3.5 rounded-xl flex justify-between items-center gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-16 rounded-md overflow-hidden shrink-0 bg-zinc-900">
                            <BookCoverImage src={book.cover} title={localized.title} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display font-bold text-sm text-white truncate">
                              {localized.title}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {t.authorLabelInline} {localized.author} ·{' '}
                              {getCategoryLabel(book.category, lang)} ·{' '}
                              <span className="font-mono tabular-nums text-[#FACC15]">
                                {localized.price}
                              </span>
                            </p>
                          </div>
                        </div>

                        {confirmDeleteId === book.id ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleDelete(book.id)}
                              className="bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                            >
                              {t.confirmDeleteBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              {t.cancelBtn}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(book.id)}
                            className="bg-red-600/15 text-red-400 hover:bg-red-600 hover:text-white px-3 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t.deleteBtn}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <form
              onSubmit={handlePasswordSubmit}
              className="max-w-md mx-auto bg-[#0F0F0F] border border-zinc-800 p-6 rounded-xl space-y-4 mt-4"
            >
              <div className="flex items-center gap-2 text-white">
                <KeyRound className="w-5 h-5 text-[#FACC15]" />
                <h4 className="font-display font-bold text-base">
                  {t.changePassHeading}
                </h4>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  {t.newPassLabel}
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => {
                    setNewPass(e.target.value);
                    if (passFeedback) setPassFeedback(null);
                  }}
                  placeholder={t.newPassPlaceholder}
                  className="w-full bg-[#1A1A1A] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#FACC15]"
                />
              </div>

              {passFeedback && (
                <div
                  className={`flex items-center gap-2 text-xs rounded-lg p-3 border ${
                    passFeedback.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  {passFeedback.type === 'success' && (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  <span>{passFeedback.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                {t.saveNewPassBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
