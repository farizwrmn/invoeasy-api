import { User } from '@prisma/client';

export interface IUser {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  image?: string;
  gender?: string;
  birthDate?: Date;
}

export interface IFilterUser {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface IResultUser {
  users: User[];
  pages: number;
}
