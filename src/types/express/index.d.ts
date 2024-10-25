export type User = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
