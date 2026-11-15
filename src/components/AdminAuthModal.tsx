import { useState, useEffect } from 'react';
import { Lock, AlertCircle, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';
import { Language } from '../types/book';
import { TRANSLATIONS } from '../i18n/translations';
import { ADMIN_EMAIL } from '../firebase/config';

interface AdminAuthModalProps {
  lang: Language;
  isOpen: boolean;
  adminPassword: string;
  user: User | null;
  onSignIn: () => Promise<void>;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminAuthModal({
  lang,
  isOpen,
  adminPassword,
  user,
  onSignIn,
  onClose,
  onSuccess,
}: AdminAuthModalProps) {
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setInputPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang];
  const isAuthorizedGoogleAdmin =
    Boolean(user?.emailVerified) &&
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorizedGoogleAdmin) {
      setError(t.adminUnauthorizedError);
      return;
    }
    if (inputPassword === adminPassword) {
      setInputPassword('');
      setError('');
      onSuccess();
    } else {
      setError(t.adminPasswordError);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-auth-title"
    >
      <div
        className="bg-[#1A1A1A] border border-zinc-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 bg-[#FACC15]/15 text-[#FACC15] rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock className="w-5 h-5" />
        </div>

        <h3 id="admin-auth-title" className="font-display text-lg font-bold text-white mb-1">
          {t.adminAuthTitle}
        </h3>
        <p className="text-xs text-zinc-400 mb-4">{t.adminAuthSubtitle}</p>

        {!isAuthorizedGoogleAdmin ? (
          <div className="space-y-3">
            <p className="text-xs text-zinc-300 leading-relaxed">
              {t.adminGooglePrompt}
            </p>
            {user && !isAuthorizedGoogleAdmin && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t.adminUnauthorizedError}</span>
              </div>
            )}
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
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-xs text-zinc-400 truncate">
              {t.signedInAsLabel}{' '}
              <span className="text-zinc-200 font-mono">{user?.email}</span>
            </p>

            <input
              type="password"
              autoFocus
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder={t.adminPasswordPlaceholder}
              className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white text-center focus:border-[#FACC15] outline-none"
            />

            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-black font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              {t.adminLoginBtn}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          {t.cancelBtn}
        </button>
      </div>
    </div>
  );
}
