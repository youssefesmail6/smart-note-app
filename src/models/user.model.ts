import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { Logger } from "../services/logger.service";

const logger = new Logger();

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  picture?: string;
  tokenBlacklist?: string[]
  resetPasswordOtp?: string;
resetOtpExpires?: Date;

  createdAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: { type: String },
  tokenBlacklist: { type: [String], default: [] },
  resetPasswordOtp: { type: String },
  resetOtpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = Number(process.env.SALT_ROUNDS) || 10;
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    logger.error("Error hashing password", error);
    next(error);
  }
});


export default mongoose.model<IUser>("User", UserSchema);
