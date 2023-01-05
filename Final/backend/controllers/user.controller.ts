import User from "./../models/userPG.model";
import { TypedRequestBody } from "../types/user.type";
import { Response, NextFunction } from "express";
import {
  createOne,
  deleteMyself,
  deleteOne,
  getAll,
  getOne,
  resizePhoto,
  updateMyself,
  updateOne,
  upload,
} from "../services/user.service";
import AppError from "../utils/AppError";

export async function getAllUsers(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  const users: User[] = await getAll();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
}

export async function createUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  const { name, email, password, passwordConfirm, role } = req.body;
  try {
    const newUser: User = await createOne(
      name,
      email,
      password,
      passwordConfirm,
      role
    );
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    if (err.isOperational) {
      next(err);
    } else {
      next(new AppError(err.errors[0].message, 400));
    }
  }
}

export async function updateUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  const data: User = req.body;
  const { id } = req.params;
  try {
    const user: User = await updateOne(data, id);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  try {
    await deleteOne(parseInt(id));
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}
export async function deleteMe(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await deleteMyself(req.user.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
}
export function getMe(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  req.params.id = req.user.id.toString();
  next();
}

export async function getUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  try {
    const user: User = await getOne(parseInt(id));
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
}

export function uploadUserPhoto(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  upload.single("photo");
  next();
}

export async function resizeUserPhoto(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  const file: Express.Multer.File = req.file;
  await resizePhoto(file);
  next();
}

export async function updateMe(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  const data: User = req.body;
  const file: Express.Multer.File = req.file;
  const id: number = req.user.id;
  try {
    const updatedUser = await updateMyself(data, file, id);
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
}
