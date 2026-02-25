import mongoose, { Schema, Model } from "mongoose";
import { DocumentStatus } from "../types/index.js";

export interface IDocument {
  originalFilePath: string;
  originalFilename: string;
  originalHash: string;
  title?: string;
  finalFilePath?: string;
  status: DocumentStatus;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  originalFilePath: { type: String, required: true },
  originalFilename: { type: String, required: true },
  originalHash: { type: String, required: true },
  title: { type: String },
  finalFilePath: { type: String },
  status: { type: String, enum: Object.values(DocumentStatus), default: DocumentStatus.DRAFT },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: () => new Date() }
});

DocumentSchema.index({ createdBy: 1 });

const DocumentModel: Model<IDocument> = mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);
export default DocumentModel;
