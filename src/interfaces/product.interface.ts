import { Item } from '@prisma/client';

export interface IProduct {
  id?: string;
  name: string;
  type?: string;
  price?: number;
  userId: string;
}

export interface IFilterProduct {
  userId?: string;
  keyword?: string;
  page?: number;
  size?: number;
  type?: string;
}

export interface IResultProduct {
  items: Item[];
  pages: number;
}
