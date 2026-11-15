import heroLibraryImg from '../assets/images/hero_arabic_library_1794747659553.jpg';
import techCoverImg from '../assets/images/book_cover_tech_1794747659384.jpg';
import financeCoverImg from '../assets/images/book_cover_finance_1794747660642.jpg';
import growthCoverImg from '../assets/images/book_cover_growth_1794747660436.jpg';
import literatureCoverImg from '../assets/images/book_cover_literature_1794747661131.jpg';
import { Book, Language } from '../types/book';

export const HERO_LIBRARY_IMAGE = heroLibraryImg;

export const PRESET_COVERS: { url: string }[] = [
  { url: techCoverImg },
  { url: financeCoverImg },
  { url: growthCoverImg },
  { url: literatureCoverImg },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'seed-1',
    title: 'فن البرمجة وهندسة البرمجيات',
    titleEn: 'The Art of Programming & Software Engineering',
    author: 'أحمد التقني',
    authorEn: 'Ahmed Al-Taqni',
    category: 'تكنولوجيا',
    price: 'مجاني',
    priceEn: 'Free',
    cover: techCoverImg,
    status: 'approved',
    contact: 'إدارة المتجر · 0550 12 34 56 · PayPal: @smartbooks',
    contactEn: 'Store Admin · +213 550 12 34 56 · PayPal: @smartbooks',
    description:
      'مرجع عملي في تصميم البنى البرمجية القابلة للتوسع، كتابة الشيفرة النظيفة، وإدارة دورة حياة الأنظمة الحديثة خطوة بخطوة.',
    descriptionEn:
      'A practical guide to designing scalable software architectures, writing clean maintainable code, and managing modern system lifecycles step by step.',
    pages: 248,
    publishedYear: '2026',
  },
  {
    id: 'seed-2',
    title: 'دليل التداول وإدارة رأس المال',
    titleEn: 'Capital Management & Disciplined Trading Guide',
    author: 'سامر المالي',
    authorEn: 'Samer Al-Mali',
    category: 'مال والأعمال',
    price: '1500 دج',
    priceEn: '$12 USD',
    cover: financeCoverImg,
    status: 'approved',
    contact: 'Wise / PayPal: samer.finance@mail.com · CCP 0024819201',
    contactEn: 'Wise / PayPal: samer.finance@mail.com · CCP 0024819201',
    description:
      'منهجية منضبطة لإدارة المخاطر، بناء المحافظ الاستثمارية، وقراءة تحركات السيولة بعيداً عن العشوائية.',
    descriptionEn:
      'A disciplined framework for risk management, portfolio allocation, and reading market liquidity without guesswork.',
    pages: 196,
    publishedYear: '2026',
  },
  {
    id: 'seed-3',
    title: 'هندسة العادات والتركيز العميق',
    titleEn: 'Habit Engineering & Deep Focus',
    author: 'ليلى المنصوري',
    authorEn: 'Layla Al-Mansouri',
    category: 'تطوير الذات',
    price: '950 دج',
    priceEn: '$8 USD',
    cover: growthCoverImg,
    status: 'approved',
    contact: 'PayPal: layla.books@mail.com · بريدي موب 0770 41 22 09',
    contactEn: 'PayPal: layla.books@mail.com · BaridiMob +213 770 41 22 09',
    description:
      'دليل تطبيقي لإعادة ترتيب الأولويات اليومية، التخلص من المشتتات الرقمية، وبناء روتين إنتاجي مستدام.',
    descriptionEn:
      'An actionable blueprint for reordering daily priorities, eliminating digital noise, and building sustainable deep-work routines.',
    pages: 172,
    publishedYear: '2026',
  },
  {
    id: 'seed-4',
    title: 'ظلال المدن القديمة',
    titleEn: 'Shadows of the Ancient Cities',
    author: 'طارق بن يوسف',
    authorEn: 'Tariq Ben Youssef',
    category: 'أدب وروايات',
    price: '1200 دج',
    priceEn: '$10 USD',
    cover: literatureCoverImg,
    status: 'approved',
    contact: 'إدارة المتجر · 0550 12 34 56 · Wise: @smartbooks',
    contactEn: 'Store Admin · +213 550 12 34 56 · Wise: @smartbooks',
    description:
      'رواية أدبية تستكشف ذاكرة الأمكنة والتحولات الإنسانية عبر أجيال متعاقبة في أزقة المدينة العتيقة.',
    descriptionEn:
      'A literary novel exploring memory, heritage, and human transformation across generations in the winding alleys of an ancient city.',
    pages: 310,
    publishedYear: '2026',
  },
];

export function getLocalizedBookFields(book: Book, lang: Language) {
  return {
    title: lang === 'en' && book.titleEn ? book.titleEn : book.title,
    author: lang === 'en' && book.authorEn ? book.authorEn : book.author,
    price: lang === 'en' && book.priceEn ? book.priceEn : book.price,
    contact: lang === 'en' && book.contactEn ? book.contactEn : book.contact,
    description:
      lang === 'en' && book.descriptionEn ? book.descriptionEn : book.description,
  };
}
