export type AppNewsItem = {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  order: number;
  startsAt?: number; // milisegundos
  endsAt?: number;
};