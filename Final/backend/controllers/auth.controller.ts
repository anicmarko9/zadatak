import { Response, NextFunction } from "express";
import { TypedRequestBody } from "../types/user.type";
import User from "./../models/userPG.model";
import {
  login,
  logout,
  signup,
  protect,
  updatePassword,
  isLoggedIn,
  restrictTo,
  forgotPassword,
  resetPassword,
} from "./../middlewares/auth.middleware";

export async function signupUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await signup(req, res, next);
}
export async function loginUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await login(req, res, next);
}

export function logoutUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  logout(req, res, next);
}
export async function protectUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await protect(req, res, next);
}
export async function loggedIn(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await isLoggedIn(req, res, next);
}
export function restrictToUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  restrictTo("admin")(req, res, next);
}

export async function forgotPasswordLink(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await forgotPassword(req, res, next);
}

export async function resetPasswordLink(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await resetPassword(req, res, next);
}

export async function updateMyPassword(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await updatePassword(req, res, next);
}
