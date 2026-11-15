import { BookCategory, Language } from '../types/book';

export const CATEGORY_LABELS: Record<BookCategory, { ar: string; en: string }> = {
  'تطوير الذات': { ar: 'تطوير الذات', en: 'Self-Growth' },
  'تكنولوجيا': { ar: 'تكنولوجيا', en: 'Technology' },
  'أدب وروايات': { ar: 'أدب وروايات', en: 'Literature & Fiction' },
  'مال والأعمال': { ar: 'مال والأعمال', en: 'Business & Finance' },
};

export function getCategoryLabel(category: BookCategory, lang: Language): string {
  return CATEGORY_LABELS[category]?.[lang] ?? category;
}

export const TRANSLATIONS = {
  ar: {
    pageTitle: 'متجر الكتب الذكي — منصة المؤلفين العالمية',
    brandName: 'متجر الكتب الذكي',
    logoTooltip: 'انقر 10 مرات للوحة المدير',
    navCatalog: 'المتجر',
    navCategories: 'التصنيفات',
    navAuthors: 'للمؤلفين',
    navBag: 'حقيبة الاقتناء',
    mobileBag: 'الحقيبة',
    publishCta: 'انشر كتابك',
    langToggleLabel: 'EN',
    langToggleAria: 'Switch language to English',

    heroEyebrow: 'منصة عالمية للكتب الرقمية · للمؤلفين والقراء حول العالم',
    heroTitle: 'إصدارات رقمية مختارة مباشرة من المؤلف إلى القارئ',
    heroSubtitle:
      'اكتشف كتباً رقمية من مؤلفين مستقلين حول العالم في التكنولوجيا، المال والأعمال، تطوير الذات، والأدب. أو انشر كتابك عالمياً مع مرونة كاملة في وسائل الدفع والتواصل.',
    heroBrowseBtn: 'تصفح الكتب المتاحة',
    heroPublishBtn: 'تقديم كتاب للنشر',
    heroBadgeLeft: 'إصدارات معتمدة في المتجر العالمي',
    heroBadgeCount: (count: number) => {
      if (count === 1) return 'كتاب واحد متاح';
      if (count === 2) return 'كتابان متاحان';
      if (count >= 3 && count <= 10) return `${count} كتب متاحة`;
      return `${count} كتاباً متاحاً`;
    },

    searchPlaceholder: 'ابحث عن كتاب، مؤلف، أو تصنيف...',
    clearSearchAria: 'مسح البحث',
    categoriesAria: 'تصنيفات الكتب',
    allCategory: 'الكل',

    catalogTitle: 'الكتب المتاحة في المتجر',
    bookCountLabel: (count: number) => {
      if (count === 0) return '0 كتب';
      if (count === 1) return 'كتاب واحد';
      if (count === 2) return 'كتابان';
      if (count >= 3 && count <= 10) return `${count} كتب`;
      return `${count} كتاباً`;
    },
    emptyCatalogText: 'لا توجد كتب مطابقة لبحثك في هذا التصنيف.',
    showAllBooksBtn: 'عرض جميع الكتب المتاحة',
    authorPrefix: 'تأليف:',
    readAcquireBtn: 'قراءة / اقتناء',

    guideTitle: 'كيف تنشر كتابك عبر المنصة العالمية؟',
    guideSubtitle:
      'ثلاث خطوات واضحة تتيح للمؤلفين في كل مكان عرض كتبهم وتلقي طلبات القراء مباشرة.',
    guideStartBtn: 'ابدأ طلب النشر',
    guideSteps: [
      {
        num: '01.',
        title: 'إدخال بيانات الكتاب',
        desc: 'أضف عنوان الكتاب، التصنيف، السعر بالعملة المناسبة، الغلاف، ومعلومات الدفع العالمية أو المحلية.',
      },
      {
        num: '02.',
        title: 'مراجعة وتأكيد رسوم النشر',
        desc: 'يصل الطلب إلى لوحة الإدارة للمراجعة وتأكيد رسوم النشر عبر PayPal أو Wise أو CCP وبريدي موب.',
      },
      {
        num: '03.',
        title: 'الاعتماد والظهور للقراء عالمياً',
        desc: 'فور الاعتماد يظهر كتابك في المتجر ثنائي اللغة ليصل إلى القراء العرب والدوليين بسهولة.',
      },
    ],

    footerTitle: 'متجر الكتب الذكي — منصة النشر الرقمي العالمية',
    footerRights: (year: number) => `جميع الحقوق محفوظة © ${year}`,

    closeAlertAria: 'إغلاق التنبيه',
    toastPublished:
      'تم إرسال كتابك بنجاح! سيتم نشره في المتجر فور مراجعته وتأكيد رسوم النشر من طرف الإدارة.',
    toastApproved: 'تمت الموافقة على الكتاب ونشره في المتجر.',
    toastDeleted: 'تم حذف الكتاب من المنصة.',
    toastAddedToBag: (title: string) => `تمت إضافة "${title}" إلى حقيبة الاقتناء.`,
    toastPasswordUpdated: 'تم تحديث كلمة مرور لوحة المدير بنجاح.',

    // Book Details Modal
    closeBookModalAria: 'إغلاق نافذة الكتاب',
    pagesSuffix: (pages: number) => `${pages} صفحة`,
    defaultBookDesc:
      'إصدار رقمي متاح للاقتناء المباشر عبر منصة المؤلفين العالمية. يمكنك التواصل مع المؤلف أو الإدارة لإتمام عملية الاقتناء واستلام النسخة الرقمية.',
    contactPaymentHeading: 'معلومات التواصل والدفع (PayPal / Wise / CCP / بريدي موب)',
    copyBtn: 'نسخ',
    copiedBtn: 'تم النسخ',
    priceLabel: 'السعر',
    viewInBagBtn: 'عرض في الحقيبة',
    addForFreeBtn: 'إضافة للمطالعة',
    addToBagBtn: 'إضافة لحقيبة الاقتناء',
    readFreeNowBtn: 'قراءة / تحميل الكتاب',
    digitalFileAttachedNote: 'النسخة الرقمية مرفقة وجاهزة للتسليم بعد التأكيد.',

    // Bag Drawer
    bagTitle: 'حقيبة الاقتناء',
    closeBagAria: 'إغلاق الحقيبة',
    bagOrderSuccessTitle: 'تم تسجيل طلب الاقتناء بنجاح',
    bagOrderSuccessDescPrefix: 'رقم الطلب المرجعي:',
    bagOrderSuccessDescSuffix:
      'سيتواصل معك المؤلف أو فريق الإدارة لتأكيد التسليم الرقمي.',
    backToStoreBtn: 'العودة للمتجر',
    bagEmptyTitle: 'حقيبة الاقتناء فارغة حالياً.',
    bagEmptySubtitle: 'اختر أي كتاب من المتجر لإضافته إلى قائمة الاقتناء.',
    removeItemAria: (title: string) => `إزالة ${title}`,
    confirmRecipientHeading: 'تأكيد بيانات المستلم',
    fullNameLabel: 'الاسم الكامل',
    fullNamePlaceholder: 'أدخل اسمك الكامل',
    contactInputLabel: 'البريد الإلكتروني أو رقم الهاتف للتواصل',
    contactInputPlaceholder: 'name@example.com أو رقم الهاتف',
    confirmOrderBtn: (count: number) => `تأكيد طلب الاقتناء (${count})`,
    submittingText: 'جاري الحفظ...',
    signInWithGoogleBtn: 'تسجيل الدخول عبر Google',
    signInOrderPrompt: 'سجّل الدخول بحساب Google لحفظ طلب الاقتناء في قاعدة البيانات.',
    signInPublishPrompt: 'سجّل الدخول بحساب Google للتحقق من هوية المؤلف وإرسال كتابك للمتجر.',
    signedInAsLabel: 'مسجل الدخول باسم:',
    signOutBtn: 'تسجيل الخروج',
    adminGooglePrompt: 'يرجى تسجيل الدخول بحساب المدير المعتمد عبر Google لإدارة قاعدة البيانات.',
    adminUnauthorizedError: 'هذا الحساب غير مصرح له بصلاحيات المدير في قاعدة البيانات.',
    firestoreSaveError: 'تعذر حفظ البيانات في قاعدة البيانات. يرجى المحاولة مرة أخرى.',

    // Publish Modal
    publishModalTitle: 'انشر كتابك عبر المنصة',
    closePublishAria: 'إغلاق نموذج النشر',
    publishModalSubtitle:
      'أدخل تفاصيل كتابك وسيقوم المدير بمراجعته وتفعيله في المتجر بعد تسديد رسوم النشر.',
    authorFieldLabel: 'اسم المؤلف / الكاتب',
    authorFieldPlaceholder: 'مثال: د. عبد الرحمن الصالح',
    titleFieldLabel: 'عنوان الكتاب',
    titleFieldPlaceholder: 'مثال: أساسيات تصميم الأنظمة الموزعة',
    categoryFieldLabel: 'التصنيف',
    priceFieldLabel: 'السعر ($، € أو دج)',
    priceFieldPlaceholder: 'مجاني، $12 أو 1000 دج',
    coverFieldLabel: 'الغلاف (اختر تصميماً جاهزاً أو أدخل رابط الصورة)',
    presetCoverLabels: ['غلاف تكنولوجيا', 'غلاف مال وأعمال', 'غلاف تطوير الذات', 'غلاف أدب وروايات'],
    descFieldLabel: 'نبذة مختصرة عن الكتاب (اختياري)',
    descFieldPlaceholder: 'لخّص موضوع الكتاب وأبرز محاوره للقراء...',
    contentFieldLabel: 'ملف الكتاب (PDF / EPUB) أو رابط القراءة',
    contentUrlPlaceholder: 'أدخل رابط الكتاب (https://...) أو ارفع ملف PDF',
    uploadFileBtn: 'رفع ملف',
    removeFileBtn: 'إزالة الملف',
    fileTooLargeError: 'حجم الملف يتجاوز 350 كيلوبايت. يرجى رفع ملف أصغر أو استخدام رابط مباشر.',
    attachedFilePrefix: 'الملف المرفق:',
    authorContactLabel: 'معلومات الدفع والتواصل (PayPal / Wise / CCP / هاتف)',
    authorContactPlaceholder: 'للتواصل وتسليم رسوم النشر',
    submitPublishBtn: 'إرسال لطلب النشر',

    // Admin Auth Modal
    adminAuthTitle: 'لوحة تحكم المدير',
    adminAuthSubtitle: 'أدخل كلمة سر المدير للوصول لإدارة المتجر',
    adminPasswordPlaceholder: 'كلمة المرور...',
    adminPasswordError: 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.',
    adminLoginBtn: 'دخول اللوحة',
    cancelBtn: 'إلغاء',

    // Admin Dashboard Modal
    adminDashboardTitle: 'لوحة تحكم المدير الرئيسية',
    closeAdminAria: 'إغلاق لوحة التحكم',
    tabPending: 'طلبات النشر المعلقة',
    tabManage: 'إدارة كتب المتجر',
    tabSettings: 'إعدادات كلمة المرور',
    noPendingText: 'لا توجد طلبات نشر معلقة حالياً.',
    authorLabelInline: 'الكاتب:',
    authorContactInline: 'تواصل الكاتب:',
    bookContentInline: 'محتوى / رابط الكتاب:',
    previewContentBtn: 'معاينة الملف / الرابط',
    approveBtn: 'موافقة ونشر',
    confirmRejectBtn: 'تأكيد الرفض',
    rejectBtn: 'رفض',
    noApprovedText: 'لا توجد كتب منشورة في المتجر حالياً.',
    confirmDeleteBtn: 'تأكيد الحذف',
    deleteBtn: 'حذف',
    changePassHeading: 'تغيير كلمة مرور لوحة المدير',
    newPassLabel: 'كلمة المرور الجديدة',
    newPassPlaceholder: 'أدخل كلمة المرور الجديدة',
    newPassError: 'يرجى إدخال كلمة مرور مكونة من 4 أحرف على الأقل.',
    newPassSuccess: 'تم تحديث كلمة المرور بنجاح. احتفظ بها في مكان آمن.',
    saveNewPassBtn: 'حفظ كلمة المرور الجديدة',
  },
  en: {
    pageTitle: 'Global Book Store — Author Publishing Platform',
    brandName: 'Global Book Store',
    logoTooltip: 'Click 10 times for Admin Panel',
    navCatalog: 'Catalog',
    navCategories: 'Categories',
    navAuthors: 'For Authors',
    navBag: 'Reading Bag',
    mobileBag: 'Bag',
    publishCta: 'Publish Book',
    langToggleLabel: 'AR',
    langToggleAria: 'التبديل إلى اللغة العربية',

    heroEyebrow: 'Global Digital Publishing · Independent Authors & Readers Worldwide',
    heroTitle: 'Curated Digital Editions Directly From Authors to Readers',
    heroSubtitle:
      'Discover independent e-books across technology, finance, self-growth, and literature—or publish your own work globally with flexible international and local payment channels.',
    heroBrowseBtn: 'Browse Catalog',
    heroPublishBtn: 'Submit a Book',
    heroBadgeLeft: 'Verified Releases in Store',
    heroBadgeCount: (count: number) => `${count} Books Available`,

    searchPlaceholder: 'Search by book title, author, or category...',
    clearSearchAria: 'Clear search',
    categoriesAria: 'Book categories',
    allCategory: 'All',

    catalogTitle: 'Available Books in Store',
    bookCountLabel: (count: number) => `${count} ${count === 1 ? 'book' : 'books'}`,
    emptyCatalogText: 'No books match your search in this category.',
    showAllBooksBtn: 'Show all available books',
    authorPrefix: 'By:',
    readAcquireBtn: 'Read / Acquire',

    guideTitle: 'How to Publish on Our Global Platform',
    guideSubtitle:
      'Three straightforward steps for international and local authors to list books and connect directly with readers.',
    guideStartBtn: 'Start Submission',
    guideSteps: [
      {
        num: '01.',
        title: 'Submit Book Details',
        desc: 'Provide your title, category, preferred currency price, cover art, and global or local payment details.',
      },
      {
        num: '02.',
        title: 'Admin Review & Fee Verification',
        desc: 'Your submission enters the admin review queue to confirm publishing fees via PayPal, Wise, Stripe, CCP, or BaridiMob.',
      },
      {
        num: '03.',
        title: 'Go Live for Global Readers',
        desc: 'Once approved, your edition immediately appears in our bilingual storefront for worldwide readers.',
      },
    ],

    footerTitle: 'Global Book Store — Digital Publishing Platform',
    footerRights: (year: number) => `All rights reserved © ${year}`,

    closeAlertAria: 'Dismiss notification',
    toastPublished:
      'Your book has been submitted! It will go live once reviewed and confirmed by the store administrator.',
    toastApproved: 'Book approved and published to the storefront.',
    toastDeleted: 'Book removed from the platform.',
    toastAddedToBag: (title: string) => `"${title}" added to your reading bag.`,
    toastPasswordUpdated: 'Admin password updated successfully.',

    // Book Details Modal
    closeBookModalAria: 'Close book details',
    pagesSuffix: (pages: number) => `${pages} pages`,
    defaultBookDesc:
      'Digital edition available for direct acquisition through the global author marketplace. Contact the author or store team to complete acquisition and receive your copy.',
    contactPaymentHeading: 'Contact & Payment Info (PayPal / Wise / CCP / BaridiMob)',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    priceLabel: 'Price',
    viewInBagBtn: 'View in Bag',
    addForFreeBtn: 'Add to Library',
    addToBagBtn: 'Add to Reading Bag',
    readFreeNowBtn: 'Read / Download Book',
    digitalFileAttachedNote: 'Digital edition verified and ready for delivery upon confirmation.',

    // Bag Drawer
    bagTitle: 'Reading Bag',
    closeBagAria: 'Close reading bag',
    bagOrderSuccessTitle: 'Acquisition Request Confirmed',
    bagOrderSuccessDescPrefix: 'Reference ID:',
    bagOrderSuccessDescSuffix:
      'The author or store administrator will reach out shortly to finalize digital delivery.',
    backToStoreBtn: 'Back to Store',
    bagEmptyTitle: 'Your reading bag is currently empty.',
    bagEmptySubtitle: 'Select any book from the catalog to add it to your acquisition list.',
    removeItemAria: (title: string) => `Remove ${title}`,
    confirmRecipientHeading: 'Recipient Details',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    contactInputLabel: 'Email or Phone Number',
    contactInputPlaceholder: 'name@example.com or phone number',
    confirmOrderBtn: (count: number) => `Confirm Request (${count})`,
    submittingText: 'Saving...',
    signInWithGoogleBtn: 'Sign in with Google',
    signInOrderPrompt: 'Sign in with Google to save your acquisition order securely.',
    signInPublishPrompt: 'Sign in with Google to verify author identity and submit your book.',
    signedInAsLabel: 'Signed in as:',
    signOutBtn: 'Sign Out',
    adminGooglePrompt: 'Sign in with the authorized Google admin account to manage Firestore.',
    adminUnauthorizedError: 'This Google account does not have store administrator permissions.',
    firestoreSaveError: 'Could not save to Firestore. Please try again.',

    // Publish Modal
    publishModalTitle: 'Publish Your Book',
    closePublishAria: 'Close publish modal',
    publishModalSubtitle:
      'Enter your book details below. The administrator will review and activate your listing upon confirming publishing fees.',
    authorFieldLabel: 'Author Name',
    authorFieldPlaceholder: 'e.g. Dr. Elena Vance / Tariq Al-Mansoor',
    titleFieldLabel: 'Book Title',
    titleFieldPlaceholder: 'e.g. Distributed Systems Architecture',
    categoryFieldLabel: 'Category',
    priceFieldLabel: 'Price (USD, EUR, or DZD)',
    priceFieldPlaceholder: 'Free, $14.99, or 1000 DZD',
    coverFieldLabel: 'Book Cover (Select a studio cover or paste an image URL)',
    presetCoverLabels: ['Tech Cover', 'Finance Cover', 'Growth Cover', 'Literature Cover'],
    descFieldLabel: 'Short Synopsis (Optional)',
    descFieldPlaceholder: 'Summarize the key themes and takeaways for readers...',
    contentFieldLabel: 'Book File (PDF / EPUB) or Reading Link',
    contentUrlPlaceholder: 'Paste reading/download link (https://...) or upload a PDF',
    uploadFileBtn: 'Upload File',
    removeFileBtn: 'Remove File',
    fileTooLargeError: 'File exceeds 350 KB limit for database storage. Please upload a smaller file or paste a direct link.',
    attachedFilePrefix: 'Attached file:',
    authorContactLabel: 'Payment & Contact Info (PayPal / Wise / CCP / Phone)',
    authorContactPlaceholder: 'For publishing fee settlement & reader inquiries',
    submitPublishBtn: 'Submit for Review',

    // Admin Auth Modal
    adminAuthTitle: 'Admin Control Panel',
    adminAuthSubtitle: 'Enter the administrator password to manage the store',
    adminPasswordPlaceholder: 'Password...',
    adminPasswordError: 'Incorrect password. Please try again.',
    adminLoginBtn: 'Unlock Dashboard',
    cancelBtn: 'Cancel',

    // Admin Dashboard Modal
    adminDashboardTitle: 'Store Administrator Dashboard',
    closeAdminAria: 'Close admin dashboard',
    tabPending: 'Pending Requests',
    tabManage: 'Manage Store Books',
    tabSettings: 'Password Settings',
    noPendingText: 'No pending publication requests at the moment.',
    authorLabelInline: 'Author:',
    authorContactInline: 'Author Contact:',
    bookContentInline: 'Book File / Link:',
    previewContentBtn: 'Preview File / Link',
    approveBtn: 'Approve & Publish',
    confirmRejectBtn: 'Confirm Reject',
    rejectBtn: 'Reject',
    noApprovedText: 'No approved books in the store yet.',
    confirmDeleteBtn: 'Confirm Delete',
    deleteBtn: 'Delete',
    changePassHeading: 'Update Administrator Password',
    newPassLabel: 'New Password',
    newPassPlaceholder: 'Enter new password',
    newPassError: 'Please enter a password with at least 4 characters.',
    newPassSuccess: 'Password updated successfully. Keep it in a safe place.',
    saveNewPassBtn: 'Save New Password',
  },
} as const;
