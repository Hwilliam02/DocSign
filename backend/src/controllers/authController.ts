import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import UserModel from "../models/User.js";
import { CreateUserDTO, UserRole, AppError, IRequestWithUser } from "../types/index.js";
import { getConfig } from "../config/index.js";

const config = getConfig();

export const register = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CreateUserDTO;
  const exists = await UserModel.findOne({ email: body.email }).lean().exec();
  if (exists) throw new AppError("User already exists", 400);

  // Coerce role to a valid enum value to avoid validation crashes from malformed clients
  const role = Object.values(UserRole).includes(body.role) ? body.role : UserRole.SIGNER;

  const hashed = await bcrypt.hash(body.password, config.BCRYPT_ROUNDS);
  const user = await UserModel.create({ name: body.name, email: body.email, password: hashed, role });
  res.status(201).json({ id: user._id });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await UserModel.findOne({ email }).exec();
  if (!user) throw new AppError("Invalid credentials", 401);

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new AppError("Invalid credentials", 401);

  const signOptions = { expiresIn: config.JWT_EXPIRES_IN } as unknown as SignOptions;
  const token = jwt.sign({ userId: user._id.toString(), role: user.role, email: user.email }, config.JWT_SECRET as string, signOptions);

  res.json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      full_name: user.name,
      first_name: user.name.split(" ")[0] || user.name,
      last_name: user.name.split(" ").slice(1).join(" ") || "",
      role: user.role
    }
  });
};

/** GET /auth/me — return the current user from the JWT token */
export const getMe = async (req: IRequestWithUser, res: Response): Promise<void> => {
  if (!req.user) throw new AppError("Unauthorized", 401);

  const user = await UserModel.findById(req.user.userId).exec();
  if (!user) throw new AppError("User not found", 404);

  res.json({
    id: user._id.toString(),
    email: user.email,
    full_name: user.name,
    first_name: user.name.split(" ")[0] || user.name,
    last_name: user.name.split(" ").slice(1).join(" ") || "",
    role: user.role,
  });
};
