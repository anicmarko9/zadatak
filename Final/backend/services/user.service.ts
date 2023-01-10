import * as multer from "multer";
import * as sharp from "sharp";
import AppError from "../utils/AppError";
import User from "../models/relationships.model";
import { TypedRequestBody } from "../types/user.type";

const multerStorage: multer.StorageEngine = multer.memoryStorage();

const multerFilter = (
  req: TypedRequestBody<User>,
  file: { mimetype: string },
  cb: (arg0: Error, arg1: boolean) => void
): void => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

export const upload: multer.Multer = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// needs to be edited from static to dynamic
export const resizePhoto = async (file: Express.Multer.File): Promise<void> => {
  if (!file) return;

  file.filename = `user-11.jpg`;

  await sharp(file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/users/${file.filename}`);
};

export const getAll = async (): Promise<User[]> => {
  return await User.scope("withoutPassword").findAll();
};

export const createOne = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string,
  role: string
): Promise<User> => {
  return await User.scope("withoutPassword").create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });
};

export const getOne = async (id: number): Promise<User> => {
  const user: User = await User.scope("withoutPassword").findByPk(id);

  if (!user) {
    throw new AppError("No user found with that ID", 404);
  }
  return user;
};

export const updateOne = async (data: User, id: string): Promise<User> => {
  const user: User = await User.scope("withoutPassword").findByPk(id);
  if (!user) throw new AppError("No user found with that ID", 404);
  if (data.role) user.role = data.role;
  await user.save();
  return user;
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
  data: User,
  file: Express.Multer.File,
  id: number
): Promise<User> => {
  // error for password update
  if (data.password || data.passwordConfirm) {
    throw new AppError(
      "This route is not for password updates. Please use /updateMyPassword.",
      400
    );
  }

  // allow only name and email to be updated
  const filteredBody: unknown = filterObj(data, "name", "bio", "role");
  if (file) filteredBody["photo"] = file.filename;

  // update
  const updatedUser: User = await User.scope("withoutPassword").findByPk(id);
  if (filteredBody["name"]) updatedUser.name = filteredBody["name"];
  if (filteredBody["bio"]) updatedUser.bio = filteredBody["bio"];
  if (filteredBody["role"]) updatedUser.role = filteredBody["role"];
  await updatedUser.save();
  return updatedUser;
};

export const deleteOne = async (id: number): Promise<void> => {
  const user: User = await User.findByPk(id);
  if (!user) {
    throw new AppError("No user found with that ID", 404);
  }
  await user.destroy();
};

export const deleteMyself = async (id: number): Promise<void> => {
  const user: User = await User.findByPk(id);
  await user.destroy();
};
