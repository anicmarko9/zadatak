import * as crypto from "crypto";
import { Model, model, Schema } from "mongoose";
import validator from "validator";
import { IUser } from "../types/user.type";
import * as bcrypt from "bcrypt";

const userSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el: string) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  __v: {
    type: Number,
    default: 0,
    select: false,
  },
});

// encrypt before save
userSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// time when password got modified
userSchema.pre("save", function (next): void {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// current query
userSchema.pre(/^find/, function (next): void {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string | Buffer,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp: number = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  // false === not changed
  return false;
};

// create token
userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken: string = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;
