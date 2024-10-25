import { IFilterUser, IResultUser, IUser } from '@/interfaces/user.interface';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

const getUsersQuery = async (filters: IFilterUser): Promise<IResultUser> => {
  try {
    const { keyword = '', page = 1, size = 1000 } = filters;

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: keyword,
            },
          },
        ],
      },
      skip: Number(page) > 0 ? (Number(page) - 1) * Number(size) : 0,
      take: Number(size),
    });

    const data = await prisma.user.aggregate({
      _count: {
        id: true,
      },
      where: {
        email: {
          contains: keyword,
        },
      },
    });
    const count = data._count.id;
    const pages = Math.ceil(count / size);

    return { users, pages };
  } catch (err) {
    throw err;
  }
};

const getUserByEmailQuery = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

const getUserByIDQuery = async (id: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

const updateUserQuery = async (id: string, userData: IUser): Promise<User> => {
  try {
    const user = await prisma.user.update({
      data: {
        ...userData,
      },
      where: {
        id,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export {
  getUserByEmailQuery,
  getUsersQuery,
  getUserByIDQuery,
  updateUserQuery,
};
