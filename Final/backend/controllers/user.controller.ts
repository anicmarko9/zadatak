import { HydratedDocument } from "mongoose";
import { IUser, TypedRequestBody } from "../types/user.type";
import { Response, NextFunction } from "express";
import {
  createOne,
  deleteMyself,
  deleteOne,
  getAll,
  getMyself,
  getOne,
  resizePhoto,
  updateMyself,
  updateOne,
  uploadPhoto,
} from "../services/user.service";

export async function getAllUsers(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await getAll(req, res, next);
}

export async function createUser(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await createOne(req, res, next);
}

export async function getUser(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await getOne(req, res, next);
}

export async function updateUser(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await updateOne(req, res, next);
}

export async function deleteUser(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await deleteOne(req, res, next);
}
export async function deleteMe(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await deleteMyself(req, res, next);
}
export function getMe(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  getMyself(req, res, next);
}

export async function updateMe(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await updateMyself(req, res, next);
}

export function uploadUserPhoto(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  uploadPhoto(req, res, next);
}

export async function resizeUserPhoto(
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) {
  await resizePhoto(req, res, next);
}
