import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './config';
import { reportError } from '@services/reportError';
import type { AppNewsItem } from '@/types/appNews';

const toMillis = (value: any): number | undefined => {
  if (!value) return undefined;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value === 'number') return value;
  return undefined;
};

// Escucha en tiempo real las novedades de la app y entrega solo las vigentes.
// Son pocos documentos: se leen todos y se filtran acá, así no hace falta ningún índice.
export const subscribeToAppNews = (callback: (items: AppNewsItem[]) => void) => {
  return onSnapshot(
    collection(db, 'appNews'),
    (snapshot) => {
      const now = Date.now();
      const items: AppNewsItem[] = snapshot.docs
        .map(d => {
          const x = d.data();
          return {
            id: d.id,
            active: x.active !== false, // si no se indica, está activa
            title: String(x.title || ''),
            body: String(x.body || ''),
            imageUrl: x.imageUrl || undefined,
            order: typeof x.order === 'number' ? x.order : 0,
            startsAt: toMillis(x.startsAt),
            endsAt: toMillis(x.endsAt),
          };
        })
        .filter(i =>
          i.active &&
          (i.title || i.body) &&
          (!i.startsAt || i.startsAt <= now) &&
          (!i.endsAt || i.endsAt >= now)
        )
        .sort((a, b) => a.order - b.order)
        .map(({ active, ...item }) => item);
      callback(items);
    },
    (error) => {
      reportError(error, 'app-news-listener');
      callback([]);
    }
  );
};