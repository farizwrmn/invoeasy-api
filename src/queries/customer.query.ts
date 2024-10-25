import {
  ICustomer,
  IFilterCustomer,
  IResultCustomer,
} from '@/interfaces/customer.interface';
import { Customer, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createCustomerQuery = async (
  customerData: ICustomer,
  userId: string,
): Promise<Customer> => {
  try {
    const trx = await prisma.$transaction(async (prisma) => {
      try {
        const existCustomer = await prisma.customer.findUnique({
          where: {
            customerEmail: customerData.customerEmail,
          },
        });
        if (existCustomer) throw new Error('Customer already exists');

        const customer = await prisma.customer.create({
          data: {
            ...customerData,
            userId: userId,
          },
        });

        return customer;
      } catch (err) {
        throw err;
      }
    });

    return trx;
  } catch (err) {
    throw err;
  }
};

const getCustomersQuery = async (id: string): Promise<Customer[]> => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        user: true,
      },
      where: {
        id,
      },
    });

    return customers;
  } catch (err) {
    throw err;
  }
};

const getCustomersByUserIDQuery = async (
  filters: IFilterCustomer,
): Promise<IResultCustomer> => {
  try {
    const { keyword = '', page = 1, size = 1000 } = filters;

    const customers = await prisma.customer.findMany({
      where: {
        name: {
          contains: keyword,
        },
        deletedAt: null,
      },
      orderBy: {
        name: 'asc',
      },
      skip: Number(page) > 0 ? (Number(page) - 1) * Number(size) : 0,
      take: Number(size),
    });

    const data = await prisma.customer.aggregate({
      _count: {
        id: true,
      },
      where: {
        name: {
          contains: keyword,
        },
      },
    });
    const count = data._count.id;
    const pages = Math.ceil(count / size);

    return { customers, pages };
  } catch (err) {
    throw err;
  }
};

const softDeleteCustomer = async (customerId: string): Promise<Customer> => {
  try {
    const customer = await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return customer;
  } catch (err) {
    throw err;
  }
};

export {
  getCustomersQuery,
  getCustomersByUserIDQuery,
  createCustomerQuery,
  softDeleteCustomer,
};
