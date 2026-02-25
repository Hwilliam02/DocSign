import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { json, urlencoded } from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { getConfig } from "./config/index.js";
import { ensureUploadDirs } from "./services/fileService.js";

dotenv.config();

const config = getConfig();

export const createApp = async (): Promise<Application> => {
  const app: Application = express();

  app.use(helmet());
  // HTTP request logging
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Authorization"]
    })
  );

  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: false }));

  app.use(rateLimiter());

  // Connect DB
  // Ensure upload directories exist before accepting uploads
  await ensureUploadDirs();

  await mongoose.connect(config.MONGO_URI, {
    // options left to defaults in Mongoose 7
  });

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
};
