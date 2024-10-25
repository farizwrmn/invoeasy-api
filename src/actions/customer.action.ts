import {
  ICustomer,
  IFilterCustomer,
  IResultCustomer,
} from '@/interfaces/customer.interface';
import {
  createCustomerQuery,
  getCustomersByUserIDQuery,
  getCustomersQuery,
  softDeleteCustomer,
} from '@/queries/customer.query';
import { Customer } from '@prisma/client';

const createCustomerAction = async (data: ICustomer): Promise<Customer> => {
  try {
    const customer = await createCustomerQuery(data, data.userId);
    return customer;
  } catch (err) {
    throw err;
  }
};

const getCustomersAction = async (id: string): Promise<Customer[]> => {
  try {
    const data = await getCustomersQuery(id);

    return data;
  } catch (err) {
    throw err;
  }
};

const getCustomersByUserIDAction = async (
  filters: IFilterCustomer,
): Promise<IResultCustomer> => {
  try {
    const products = await getCustomersByUserIDQuery(filters);
    return products;
  } catch (err) {
    throw err;
  }
};

export { createCustomerAction, getCustomersAction, getCustomersByUserIDAction };
