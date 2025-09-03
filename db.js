import mongoose from "mongoose";
import config from "./config.js"
const MONGO_URL = config.MONGO_URL;

mongoose.connect(MONGO_URL);

const FileSchema = new mongoose.Schema({
  fileId: { type: String, unique: true },
  telegramFileId: String,
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now }
});

export const FileModel = mongoose.model("File", FileSchema);