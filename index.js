import express from "express";
import multer from "multer";
import axios from "axios";
import { FileModel } from "./db.js";
import { generateId, buildFileUrl } from "./utils.js";
import path from "path";
import { fileURLToPath } from "url";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID, PORT } from "./config.js";

const app = express();
const upload = multer();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHANNEL_ID);
    formData.append("document", new Blob([req.file.buffer]), req.file.originalname);

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
      formData,
      { headers: formData.getHeaders?.() || {} }
    );

    const telegramFileId = response.data.result.document.file_id;
    const randomId = generateId();
    const fileUrl = buildFileUrl(req, randomId);

    await FileModel.create({
      fileId: randomId,
      telegramFileId,
      fileUrl,
    });

    res.json({
      uploaded_by: "King David",
      file_id: randomId,
      file_url: fileUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/file/:id", async (req, res) => {
  try {
    const fileDoc = await FileModel.findOne({ fileId: req.params.id });
    if (!fileDoc) return res.status(404).json({ error: "File not found" });

    const tgResp = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileDoc.telegramFileId}`
    );

    const filePath = tgResp.data.result.file_path;
    const telegramDownloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;

    res.redirect(telegramDownloadUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

app.listen(PORT, () => console.log(`🚀 Telegram CDN API running on port ${PORT}`));