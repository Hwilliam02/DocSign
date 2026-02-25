import mongoose, { Schema, Model } from "mongoose";
import { UserRole } from "../types/index.js";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  createdAt: { type: Date, default: () => new Date() }
});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default UserModel;
