import { IProduct } from '@/interfaces/product.interface';
import { createProductQuery } from '@/queries/product.query';
import { Item } from '@prisma/client';

const createProductAction = async (data: IProduct): Promise<Item> => {
  try {
    const product = await createProductQuery(data, data.userId);
    return product;
  } catch (err) {
    throw err;
  }
};

export { createProductAction };
