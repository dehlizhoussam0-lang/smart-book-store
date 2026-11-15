export type Language = 'ar' | 'en';

export type BookCategory =
  | 'تطوير الذات'
  | 'تكنولوجيا'
  | 'أدب وروايات'
  | 'مال والأعمال';

export type BookStatus = 'approved' | 'pending';

export interface Book {
  id: string;
  title: string;
  titleEn?: string;
  author: string;
  authorEn?: string;
  category: BookCategory;
  price: string;
  priceEn?: string;
  cover: string;
  status: BookStatus;
  contact: string;
  contactEn?: string;
  description?: string;
  descriptionEn?: string;
  contentUrl?: string;
  contentFileName?: string;
  pages?: number;
  publishedYear?: string;
  authorUid?: string;
}

export const BOOK_CATEGORIES: BookCategory[] = [
  'تطوير الذات',
  'تكنولوجيا',
  'أدب وروايات',
  'مال والأعمال',
];
