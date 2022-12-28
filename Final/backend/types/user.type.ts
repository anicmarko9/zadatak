import { Request } from "express";

export interface IUser extends Document {
  name: string;
  bio?: string;
  email: string;
  photo?: string;
  role?: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
  _id?: string;
  __v?: number;
  correctPassword: (p1: string | Buffer, p2: string) => Promise<boolean>;
  changedPasswordAfter: (p1: number) => boolean;
  createPasswordResetToken: () => string;
}

export interface TypedRequestBody<T> extends Request {
  user: T;
}

export type Email = {
  to: string;
  firstName: string;
  url: string;
  from: string;
};
