import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  BookOpen,
  X,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  BookMarked,
} from 'lucide-react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { BOOK_CATEGORIES, Book, BookCategory, Language } from './types/book';
import {
  HERO_LIBRARY_IMAGE,
  INITIAL_BOOKS,
  getLocalizedBookFields,
} from './data/initialBooks';
import { getCategoryLabel, TRANSLATIONS } from './i18n/translations';
import { ADMIN_EMAIL, auth, googleProvider } from './firebase/config';
import {
  approveBookInFirestore,
  createOrderInFirestore,
  createPendingBook,
  deleteBookInFirestore,
  seedInitialBooksIfEmpty,
  subscribeAllBooksForAdmin,
  subscribeApprovedBooks,
} from './firebase/booksService';
import { Navbar } from './components/Navbar';
import { BookCoverImage } from './components/BookCoverImage';
import { BookDetailsModal } from './components/BookDetailsModal';
import { BagDrawer } from './components/BagDrawer';
import { PublishBookModal } from './components/PublishBookModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';

const STORAGE_PASS_KEY = 'admin_pass';
const STORAGE_BAG_KEY = 'store_bag';
const STORAGE_LANG_KEY = 'store_lang';

function loadInitialBag(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_BAG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Book[];
    return Array.isArray(parsed)
      ? parsed.map((b) => ({ ...b, id: String(b.id) }))
      : [];
  } catch {
    return [];
  }
}

function loadInitialLang(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    // ignore storage errors
  }
  return 'ar';
}

export default function App() {
  const [lang, setLang] = useState<Language>(loadInitialLang);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [approvedBooks, setApprovedBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [adminBooks, setAdminBooks] = useState<Book[]>([]);
  const [adminPassword, setAdminPassword] = useState<string>(
    () => localStorage.getItem(STORAGE_PASS_KEY) || 'admin123'
  );
  const [bag, setBag] = useState<Book[]>(loadInitialBag);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | BookCategory>('ALL');

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = TRANSLATIONS[lang];

  const isAdminUser =
    authReady &&
    Boolean(user?.emailVerified) &&
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Track Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Subscribe to public approved books in Firestore
  useEffect(() => {
    const unsub = subscribeApprovedBooks(
      (firestoreBooks) => {
        setApprovedBooks(firestoreBooks.length > 0 ? firestoreBooks : INITIAL_BOOKS);
      },
      () => {
        // Keep starter books visible if Firestore read encounters an error
      }
    );
    return () => unsub();
  }, []);

  // Subscribe to all books (including pending) when authenticated as Admin
  useEffect(() => {
    if (!isAdminUser || !user) {
      setAdminBooks([]);
      return;
    }

    seedInitialBooksIfEmpty(user.uid).catch(() => {
      // Non-fatal if already seeded or permissions pending
    });

    const unsub = subscribeAllBooksForAdmin(
      (allBooks) => {
        setAdminBooks(allBooks);
      },
      () => {
        // Errors logged via handleFirestoreError
      }
    );
    return () => unsub();
  }, [isAdminUser, user]);

  // Sync HTML dir, lang, and document title whenever language switches
  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.title = t.pageTitle;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
  }, [lang, t.pageTitle]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PASS_KEY, adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BAG_KEY, JSON.stringify(bag));
    } catch {
      // ignore storage quota errors
    }
  }, [bag]);

  useEffect(() => {
    return () => {
      if (logoClickTimerRef.current) clearTimeout(logoClickTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-Out failed:', error);
    }
  };

  // 10-click hidden admin trigger
  const handleLogoClick = () => {
    logoClickCountRef.current += 1;
    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
    }

    if (logoClickCountRef.current >= 10) {
      logoClickCountRef.current = 0;
      setIsAdminAuthOpen(true);
    } else {
      logoClickTimerRef.current = setTimeout(() => {
        logoClickCountRef.current = 0;
      }, 1000);
    }
  };

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return approvedBooks.filter((b) => {
      const matchesCat =
        selectedCategory === 'ALL' || b.category === selectedCategory;
      const catAr = getCategoryLabel(b.category, 'ar').toLowerCase();
      const catEn = getCategoryLabel(b.category, 'en').toLowerCase();
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        (b.titleEn && b.titleEn.toLowerCase().includes(q)) ||
        b.author.toLowerCase().includes(q) ||
        (b.authorEn && b.authorEn.toLowerCase().includes(q)) ||
        catAr.includes(q) ||
        catEn.includes(q);
      return matchesCat && matchesQuery;
    });
  }, [approvedBooks, selectedCategory, searchQuery]);

  const handlePublishSubmit = async (
    newBookData: Omit<Book, 'id' | 'status' | 'authorUid'>
  ) => {
    if (!user) return;
    await createPendingBook(newBookData, user.uid);
    showToast(t.toastPublished);
  };

  const handleApproveBook = async (id: string) => {
    await approveBookInFirestore(id);
    showToast(t.toastApproved);
  };

  const handleDeleteBook = async (id: string) => {
    await deleteBookInFirestore(id);
    setBag((prev) => prev.filter((b) => b.id !== id));
    showToast(t.toastDeleted);
  };

  const handleAddToBag = (book: Book) => {
    const localized = getLocalizedBookFields(book, lang);
    setBag((prev) => {
      if (prev.some((item) => item.id === book.id)) return prev;
      return [...prev, book];
    });
    showToast(t.toastAddedToBag(localized.title));
  };

  const handleRemoveFromBag = (id: string) => {
    setBag((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmitOrder = async (
    customerName: string,
    customerContact: string
  ): Promise<string> => {
    if (!user) throw new Error('User not signed in');
    const refId = await createOrderInFirestore({
      buyerUid: user.uid,
      customerName,
      customerContact,
      books: bag,
    });
    setBag([]);
    return refId;
  };

  const categoryTabs: { key: 'ALL' | BookCategory; label: string }[] = [
    { key: 'ALL', label: t.allCategory },
    ...BOOK_CATEGORIES.map((cat) => ({
      key: cat,
      label: getCategoryLabel(cat, lang),
    })),
  ];

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-[#0F0F0F] text-zinc-100"
    >
      <Navbar
        lang={lang}
        onToggleLanguage={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
        onLogoClick={handleLogoClick}
        onOpenPublish={() => setIsPublishOpen(true)}
        onOpenBag={() => setIsBagOpen(true)}
        bagCount={bag.length}
      />

      {/* Storefront Hero */}
      <section className="border-b border-zinc-800/80 bg-[#0F0F0F]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
              <p className="text-xs font-medium text-[#FACC15] tracking-wide">
                {t.heroEyebrow}
              </p>
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.65rem] text-white leading-tight [text-wrap:balance]">
                {t.heroTitle}
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
                {t.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#catalog"
                  className="bg-[#FACC15] hover:bg-[#EAB308] text-black px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition-colors duration-150 whitespace-nowrap"
                >
                  <span>{t.heroBrowseBtn}</span>
                  {lang === 'ar' ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </a>
                <button
                  type="button"
                  onClick={() => setIsPublishOpen(true)}
                  className="bg-[#1A1A1A] hover:bg-zinc-800 border border-zinc-700 text-zinc-100 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap"
                >
                  {t.heroPublishBtn}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[280px] rounded-2xl overflow-hidden border border-zinc-800 bg-[#1A1A1A]">
                <img
                  src={HERO_LIBRARY_IMAGE}
                  alt={t.brandName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-4 start-4 end-4 flex items-center justify-between text-xs text-zinc-200">
                  <span>{t.heroBadgeLeft}</span>
                  <span className="font-mono tabular-nums text-[#FACC15] font-semibold">
                    {t.heroBadgeCount(approvedBooks.length)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Category Filter Bar */}
      <section
        id="categories-bar"
        className="bg-[#141416] border-b border-zinc-800/80 py-4 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#0F0F0F] border border-zinc-800 rounded-xl py-2.5 ps-10 pe-9 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FACC15] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={t.clearSearchAria}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Category Filter Buttons */}
          <div
            className="flex items-center gap-1.5 p-1 bg-[#0F0F0F] border border-zinc-800 rounded-xl overflow-x-auto"
            role="tablist"
            aria-label={t.categoriesAria}
          >
            {categoryTabs.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                    active
                      ? 'bg-[#FACC15] text-black font-bold'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main id="catalog" className="flex-grow py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between gap-4 pb-4 mb-6 border-b border-zinc-800/80">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              {t.catalogTitle}
            </h2>
            <span className="text-xs sm:text-sm text-zinc-400 font-mono tabular-nums whitespace-nowrap">
              {t.bookCountLabel(filteredBooks.length)}
            </span>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="bg-[#1A1A1A] border border-zinc-800 rounded-2xl py-16 px-4 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" strokeWidth={1.5} />
              <p className="text-sm text-zinc-300 font-medium">
                {t.emptyCatalogText}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="text-xs text-[#FACC15] hover:underline cursor-pointer"
              >
                {t.showAllBooksBtn}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => {
                const localized = getLocalizedBookFields(book, lang);
                return (
                  <article
                    key={book.id}
                    className="bg-[#1A1A1A] border border-zinc-800/90 rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 hover:border-zinc-700"
                  >
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedBook(book)}
                        className="block w-full aspect-[3/4] overflow-hidden bg-zinc-950 cursor-pointer text-start group"
                      >
                        <BookCoverImage
                          src={book.cover}
                          title={localized.title}
                          author={localized.author}
                          className="transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </button>

                      <div className="p-5 pb-3">
                        <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 mb-2">
                          <span>{getCategoryLabel(book.category, lang)}</span>
                          <span className="font-mono tabular-nums font-semibold text-[#FACC15]">
                            {localized.price}
                          </span>
                        </div>

                        <h3 className="font-display font-semibold text-base text-white line-clamp-1 leading-snug">
                          {localized.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">
                          {t.authorPrefix} {localized.author}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedBook(book)}
                        className="w-full bg-[#0F0F0F] hover:bg-[#FACC15] hover:text-black border border-zinc-700 hover:border-[#FACC15] text-zinc-100 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <BookMarked className="w-4 h-4" />
                        <span>{t.readAcquireBtn}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Compact Author Publishing Guide */}
      <section
        id="publishing-guide"
        className="border-t border-zinc-800/80 bg-[#141416] py-12 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                {t.guideTitle}
              </h2>
              <p className="text-sm text-zinc-400 mt-1">{t.guideSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublishOpen(true)}
              className="bg-[#FACC15] hover:bg-[#EAB308] text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer self-start md:self-auto whitespace-nowrap"
            >
              {t.guideStartBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.guideSteps.map((step) => (
              <div
                key={step.num}
                className="bg-[#1A1A1A] border border-zinc-800 rounded-xl p-5"
              >
                <p className="font-mono text-xs text-[#FACC15] mb-2">{step.num}</p>
                <h3 className="font-display font-semibold text-base text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#0F0F0F] py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>{t.footerTitle}</p>
          <p>{t.footerRights(new Date().getFullYear())}</p>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 start-5 end-5 sm:end-auto sm:w-96 z-50 bg-[#1A1A1A] border border-[#FACC15]/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-[#FACC15] shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed flex-1 text-start">{toastMessage}</p>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label={t.closeAlertAria}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <BookDetailsModal
        lang={lang}
        book={selectedBook}
        isInBag={selectedBook ? bag.some((item) => item.id === selectedBook.id) : false}
        onClose={() => setSelectedBook(null)}
        onAddToBag={handleAddToBag}
        onOpenBag={() => setIsBagOpen(true)}
      />

      <BagDrawer
        lang={lang}
        isOpen={isBagOpen}
        items={bag}
        user={user}
        onSignIn={handleGoogleSignIn}
        onClose={() => setIsBagOpen(false)}
        onRemoveItem={handleRemoveFromBag}
        onSubmitOrder={handleSubmitOrder}
      />

      <PublishBookModal
        lang={lang}
        isOpen={isPublishOpen}
        user={user}
        onSignIn={handleGoogleSignIn}
        onClose={() => setIsPublishOpen(false)}
        onSubmit={handlePublishSubmit}
      />

      <AdminAuthModal
        lang={lang}
        isOpen={isAdminAuthOpen}
        adminPassword={adminPassword}
        user={user}
        onSignIn={handleGoogleSignIn}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdminAuthOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />

      <AdminDashboardModal
        lang={lang}
        isOpen={isAdminDashboardOpen}
        user={user}
        books={adminBooks}
        onClose={() => setIsAdminDashboardOpen(false)}
        onSignOut={handleGoogleSignOut}
        onApproveBook={handleApproveBook}
        onDeleteBook={handleDeleteBook}
        onUpdatePassword={(newPass) => {
          setAdminPassword(newPass);
          showToast(t.toastPasswordUpdated);
        }}
      />
    </div>
  );
}
