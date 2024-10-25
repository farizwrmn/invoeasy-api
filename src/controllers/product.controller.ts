import { createProductAction } from '@/actions/product.action';
import { IFilterProduct } from '@/interfaces/product.interface';
import { softDeleteProduct } from '@/queries/product.query';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = req.body;

    const data = await createProductAction({
      ...params,
    });

    res.status(200).json({
      message: 'Create Product success',
      data,
    });
  } catch (err) {
    next(err);
  }
};

const getProductsByUserIDController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      keyword = '',
      page = 1,
      size = 10,
      type = '',
    } = req.query as IFilterProduct;

    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
    }
    const products = await prisma.item.findMany({
      where: {
        userId: userId,
        deletedAt: null,
        name: {
          contains: keyword,
        },
        type: type ? type : undefined,
      },
      orderBy: {
        name: 'asc',
      },
      skip: Number(page) > 0 ? (Number(page) - 1) * Number(size) : 0,
      take: Number(size),
    });

    const data = await prisma.item.aggregate({
      _count: {
        id: true,
      },
      where: {
        userId: userId,
        deletedAt: null,
        name: {
          contains: keyword,
        },
        type: type ? type : undefined,
      },
    });
    const count = data._count.id;
    const pages = Math.ceil(count / Number(size));

    if (products.length === 0) {
      res.status(404).json({ message: 'No products found for this user' });
    }

    res.status(200).json({ products, pages, size: Number(size), count });
  } catch (err) {
    next(err);
  }
};

export const softDeleteProductAction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedProduct = await softDeleteProduct(id);
    res.status(200).json({
      message: 'Product soft deleted successfully',
      data: deletedProduct,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to soft delete Product' });
  }
};

const getProductByIDController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.item.findUnique({
      where: { id: id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

const updateProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, type } = req.body;

  try {
    const updatedProduct = await prisma.item.update({
      where: { id: id },
      data: {
        name,
        price: parseFloat(price),
        type,
      },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export {
  createProductController,
  getProductsByUserIDController,
  getProductByIDController,
  updateProductController,
};
