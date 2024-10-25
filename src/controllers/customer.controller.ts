import { createCustomerAction } from '@/actions/customer.action';
import { IFilterCustomer } from '@/interfaces/customer.interface';
import { softDeleteCustomer } from '@/queries/customer.query';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

const createCustomerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = req.body;

    const data = await createCustomerAction({
      ...params,
    });

    res.status(200).json({
      message: 'Create Customer success',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const getCustomersByUserIDController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      keyword = '',
      page = 1,
      size = 5,
      type = '',
      paymentMethod = '',
    } = req.query as IFilterCustomer;

    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
    }
    const customers = await prisma.customer.findMany({
      where: {
        userId: userId,
        deletedAt: null,
        OR: [
          {
            name: {
              contains: keyword,
            },
          },
          {
            customerEmail: {
              contains: keyword,
            },
          },
        ],
        type: type ? type : undefined,
        paymentMethod: paymentMethod ? paymentMethod : undefined,
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
        userId: userId,
        deletedAt: null,
        OR: [
          {
            name: {
              contains: keyword,
            },
          },
          {
            customerEmail: {
              contains: keyword,
            },
          },
        ],
        type: type ? type : undefined,
        paymentMethod: paymentMethod ? paymentMethod : undefined,
      },
    });
    const count = data._count.id;
    const pages = Math.ceil(count / Number(size));

    if (customers.length === 0) {
      res.status(404).json({ message: 'No customers found for this user' });
    }

    res.status(200).json({ customers, pages, size: Number(size), count });
  } catch (err) {
    next(err);
  }
};

export const softDeleteCustomerAction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCustomer = await softDeleteCustomer(id);
    res.status(200).json({
      message: 'Customer soft deleted successfully',
      data: deletedCustomer,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to soft delete customer' });
  }
};

const getCustomerByIDController = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (err) {
    console.error('Error fetching customer by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCustomerController = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const { name, customerEmail, address, type, paymentMethod } = req.body;

  try {
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name,
        customerEmail,
        address,
        type,
        paymentMethod,
      },
    });

    res.status(200).json(updatedCustomer);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  createCustomerController,
  getCustomersByUserIDController,
  getCustomerByIDController,
  updateCustomerController,
};
