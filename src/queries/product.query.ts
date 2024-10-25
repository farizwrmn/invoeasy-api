import { IProduct } from '@/interfaces/product.interface';
import { Item, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createProductQuery = async (
  productData: IProduct,
  userId: string,
): Promise<Item> => {
  try {
    const trx = await prisma.$transaction(async (prisma) => {
      try {
        const product = await prisma.item.create({
          data: {
            ...productData,
            userId: userId,
          },
        });

        return product;
      } catch (err) {
        throw err;
      }
    });

    return trx;
  } catch (err) {
    throw err;
  }
};

const softDeleteProduct = async (productId: string): Promise<Item> => {
  try {
    const product = await prisma.item.update({
      where: {
        id: productId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return product;
  } catch (err) {
    throw err;
  }
};

export { createProductQuery, softDeleteProduct };
