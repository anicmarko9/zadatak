import * as multer from "multer";
import * as sharp from "sharp";
import AppError from "../utils/AppError";
import User from "../models/user.model";
import { HydratedDocument } from "mongoose";
import { IUser, TypedRequestBody } from "../types/user.type";
import { NextFunction, Response } from "express";

const multerStorage: multer.StorageEngine = multer.memoryStorage();

const multerFilter = (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  file: { mimetype: string },
  cb: (arg0: Error, arg1: boolean) => void
): void => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload: multer.Multer = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadPhoto = upload.single("photo");

// needs to be edited from static to dynamic
export const resizePhoto = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.file) return next();

  req.file.filename = `user-11.jpg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/users/${req.file.filename}`);

  next();
};

export const getAll = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const users: HydratedDocument<IUser>[] = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
};

export const createOne = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const newUser: HydratedDocument<IUser> = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

export const getMyself = (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): void => {
  req.params.id = req.user._id;
  next();
};

export const getOne = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user: HydratedDocument<IUser> = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

export const updateOne = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user: HydratedDocument<IUser> = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

const filterObj = (obj: unknown, ...allowedFields: string[]): unknown => {
  const newObj: unknown = {};
  // obj -> array
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMyself = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // error for password update
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // allow only name and email to be updated
  const filteredBody: unknown = filterObj(req.body, "name", "bio", "role");
  if (req.file) filteredBody["photo"] = req.file.filename;

  // update
  const updatedUser: HydratedDocument<IUser> = await User.findByIdAndUpdate(
    req.user._id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
};

export const deleteOne = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user: HydratedDocument<IUser> = await User.findByIdAndDelete(
    req.params.id
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

export const deleteMyself = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await User.findByIdAndDelete(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
};
