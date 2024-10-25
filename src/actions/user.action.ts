import { HttpException } from '@/exceptions/httpException';
import { IFilterUser, IResultUser, IUser } from '@/interfaces/user.interface';
import {
  getUserByIDQuery,
  getUsersQuery,
  updateUserQuery,
} from '@/queries/user.query';
import { User } from '@prisma/client';

const getUsersAction = async (filters: IFilterUser): Promise<IResultUser> => {
  try {
    const users = await getUsersQuery(filters);
    return users;
  } catch (err) {
    throw err;
  }
};

const getUserByIDAction = async (id: string): Promise<User | null> => {
  try {
    const user = await getUserByIDQuery(id);

    if (!user) throw new HttpException(404, 'Data not found');

    return user;
  } catch (err) {
    throw err;
  }
};

const updateUserAction = async (id: string, userData: IUser): Promise<User> => {
  try {
    const user = await updateUserQuery(id, userData);
    return user;
  } catch (err) {
    throw err;
  }
};

export { getUserByIDAction, getUsersAction, updateUserAction };
