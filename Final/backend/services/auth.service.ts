import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import AppError from "../utils/AppError";
import User from "../models/user.model";
import { HydratedDocument } from "mongoose";
import { IUser, TypedRequestBody } from "../types/user.type";
import { NextFunction, Response } from "express";
import { Error } from "mongoose";
import { sendEmail } from "./email.service";

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (
  user: HydratedDocument<IUser>,
  statusCode: number,
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response
): void => {
  const token: string = signToken(user._id);

  res.cookie("jwt", token, {
    // 3 months
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password, passwordConfirm } = req.body;
  const user: HydratedDocument<IUser> = new User({
    name,
    email,
    password,
    passwordConfirm,
  });
  if (validateError(user, false))
    return next(new AppError(validateError(user, false), 400));
  try {
    const newUser: HydratedDocument<IUser> = await User.create(user);
    const url: string = "http://localhost:3000/me";
    await sendEmail(newUser, url, "Welcome");
    createSendToken(newUser, 201, req, res);
  } catch (err) {
    const value: unknown = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message: string = `Email: ${value} already exists.`;
    next(new AppError(message, 400));
  }
};

export const login = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user: HydratedDocument<IUser> = await User.findOne({ email }).select(
    "+password"
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }

  // login user, send JWT
  createSendToken(user, 200, req, res);
};

export const logout = (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): void => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const protect = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // get token and check if it's there
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  try {
    // verification token
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as jwt.JwtPayload;

    // check if user still exists
    const currentUser: HydratedDocument<IUser> = await User.findById(
      decoded.id
    );
    if (!currentUser) return next(checkUser(401));

    // check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    // grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
};

export const isLoggedIn = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  try {
    // verify token
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as jwt.JwtPayload;
    // check if user still exists

    const currentUser: HydratedDocument<IUser> = await User.findById(
      decoded.id
    );
    if (!currentUser) {
      return next(checkUser(401));
    }

    // check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    // if there is a logged in user
    res.locals.user = currentUser;
    return next();
  } catch (err) {
    return next(new AppError("Not Logged in!", 401));
  }
};

export const restrictTo = (
  ...roles: string[]
): ((
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
) => void) => {
  return (
    req: TypedRequestBody<HydratedDocument<IUser>>,
    res: Response,
    next: NextFunction
  ): void => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to do that!", 403));
    }
    next();
  };
};

export const forgotPassword = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // get user based on POSTed email
  const user: HydratedDocument<IUser> = await User.findOne({
    email: req.body.email,
  });

  if (!user) return next(checkUser(404));

  // generate the random reset token
  const resetToken: string = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // send email + json
  try {
    const resetURL: string = `http://localhost:3000/resetPassword/${resetToken}`;
    await sendEmail(user, resetURL, "PasswordReset");
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
};

export const resetPassword = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { password, passwordConfirm } = req.body;
  const currentUser: HydratedDocument<IUser> = new User({
    name: "unknown",
    email: "unknown@gmail.com",
    password,
    passwordConfirm,
  });

  if (validateError(currentUser, true))
    return next(new AppError(validateError(currentUser, true), 400));

  // get user based on the token param
  const hashedToken: string = hashToken(req.params.token);

  const user: HydratedDocument<IUser> = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(checkUser(400));

  // if token hasn't expired, and there is user, set the new password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  // changedPasswordAt -> updated pre-save
  await user.save();

  // login user, send JWT
  createSendToken(user, 200, req, res);
};

export const updatePassword = async (
  req: TypedRequestBody<HydratedDocument<IUser>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const currentUser: HydratedDocument<IUser> = new User({
    name: "unknown",
    email: "unknown@gmail.com",
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // get user from collection
  const user: HydratedDocument<IUser> = await User.findById(
    req.user._id
  ).select("+password");

  // check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError("Your current password is wrong.", 401));

  if (validateError(currentUser, true))
    return next(new AppError(validateError(currentUser, true), 400));

  // update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // login user, send JWT
  createSendToken(user, 200, req, res);
};

const checkUser = (code: number): AppError => {
  let text: string;
  switch (code) {
    case 400:
      text = "Token is invalid or has expired";
      break;
    case 401:
      text = "The user belonging to this token does no longer exist.";
      break;
    case 404:
      text = "There is no user with this email address.";
      break;
    default:
      text = "Something went very wrong!";
  }
  return new AppError(text, code);
};

// digest with same method from model method
// so it can match token from DB
const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const validateError = (
  user: HydratedDocument<IUser>,
  password: boolean
): string => {
  const error: Error.ValidationError = user.validateSync();
  if (error)
    if (password) {
      for (const [key, value] of Object.entries(error.errors))
        if (key === "password" || key === "passwordConfirm")
          return value.toString();
    } else {
      for (const [, value] of Object.entries(error.errors))
        return value.toString();
    }
};
