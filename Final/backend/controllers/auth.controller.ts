import { Response, NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { IUser, TypedRequestBody } from "../types/user.type";
import {
  forgotPassword,
  isLoggedIn,
  login,
  logout,
  protect,
  resetPassword,
  restrictTo,
  signup,
  updatePassword,
} from "./../services/auth.service";

export async function signupUser(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await signup(req, res, next);
}
export async function loginUser(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await login(req, res, next);
}

export function logoutUser(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  logout(req, res, next);
}
export async function protectUser(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await protect(req, res, next);
}
export async function loggedIn(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await isLoggedIn(req, res, next);
}
export function restrictToUser(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  restrictTo("admin")(req, res, next);
}

export async function forgotPasswordLink(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await forgotPassword(req, res, next);
}

export async function resetPasswordLink(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await resetPassword(req, res, next);
}

export async function updateMyPassword(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await updatePassword(req, res, next);
}
