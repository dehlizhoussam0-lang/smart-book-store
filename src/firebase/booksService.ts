import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
  Unsubscribe,
} from 'firebase/firestore';
import { Book } from '../types/book';
import { INITIAL_BOOKS } from '../data/initialBooks';
import { db, handleFirestoreError, OperationType } from './config';

function sanitizeBookPayload(book: Omit<Book, 'id' | 'status' | 'authorUid'>) {
  const payload: Record<string, unknown> = {
    title: book.title.trim().slice(0, 200),
    author: book.author.trim().slice(0, 120),
    category: book.category,
    price: book.price.trim().slice(0, 40),
    cover: book.cover.trim().slice(0, 2000),
    contact: book.contact.trim().slice(0, 300),
  };

  if (book.titleEn?.trim()) payload.titleEn = book.titleEn.trim().slice(0, 200);
  if (book.authorEn?.trim()) payload.authorEn = book.authorEn.trim().slice(0, 120);
  if (book.priceEn?.trim()) payload.priceEn = book.priceEn.trim().slice(0, 40);
  if (book.contactEn?.trim()) payload.contactEn = book.contactEn.trim().slice(0, 300);
  if (book.description?.trim()) {
    payload.description = book.description.trim().slice(0, 2000);
  }
  if (book.descriptionEn?.trim()) {
    payload.descriptionEn = book.descriptionEn.trim().slice(0, 2000);
  }
  if (book.contentUrl?.trim()) {
    payload.contentUrl = book.contentUrl.trim().slice(0, 500000);
  }
  if (book.contentFileName?.trim()) {
    payload.contentFileName = book.contentFileName.trim().slice(0, 200);
  }
  if (typeof book.pages === 'number' && book.pages >= 1 && book.pages <= 10000) {
    payload.pages = Math.round(book.pages);
  }
  if (book.publishedYear?.trim()) {
    payload.publishedYear = book.publishedYear.trim().slice(0, 10);
  }

  return payload;
}

export function subscribeApprovedBooks(
  onData: (books: Book[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'books';
  const q = query(collection(db, path), where('status', '==', 'approved'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Book[] = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<Book, 'id'>),
        id: d.id,
      }));
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) onError(wrapped);
      }
    }
  );
}

export function subscribeAllBooksForAdmin(
  onData: (books: Book[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'books';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: Book[] = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<Book, 'id'>),
        id: d.id,
      }));
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) onError(wrapped);
      }
    }
  );
}

export async function seedInitialBooksIfEmpty(adminUid: string): Promise<void> {
  const path = 'books';
  try {
    const existing = await getDocs(collection(db, path));
    if (!existing.empty) return;

    await Promise.all(
      INITIAL_BOOKS.map((book) =>
        setDoc(doc(db, path, book.id), {
          ...sanitizeBookPayload(book),
          status: 'approved',
          authorUid: adminUid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      )
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createPendingBook(
  book: Omit<Book, 'id' | 'status' | 'authorUid'>,
  authorUid: string
): Promise<string> {
  const bookId = `book-${Date.now()}`;
  const path = `books/${bookId}`;
  try {
    await setDoc(doc(db, 'books', bookId), {
      ...sanitizeBookPayload(book),
      status: 'pending',
      authorUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return bookId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function approveBookInFirestore(bookId: string): Promise<void> {
  const path = `books/${bookId}`;
  try {
    await updateDoc(doc(db, 'books', bookId), {
      status: 'approved',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteBookInFirestore(bookId: string): Promise<void> {
  const path = `books/${bookId}`;
  try {
    await deleteDoc(doc(db, 'books', bookId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function createOrderInFirestore(params: {
  buyerUid: string;
  customerName: string;
  customerContact: string;
  books: Book[];
}): Promise<string> {
  const referenceId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderId = `order-${Date.now()}`;
  const path = `orders/${orderId}`;

  const bookIds = params.books.slice(0, 50).map((b) => String(b.id).slice(0, 128));
  const bookTitles = params.books.slice(0, 50).map((b) => b.title.slice(0, 200));

  try {
    await setDoc(doc(db, 'orders', orderId), {
      referenceId,
      buyerUid: params.buyerUid,
      customerName: params.customerName.trim().slice(0, 120),
      customerContact: params.customerContact.trim().slice(0, 200),
      bookIds,
      bookTitles,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return referenceId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
