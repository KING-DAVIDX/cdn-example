import dotenv from "dotenv";
dotenv.config();

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
export const MONGO_URL = process.env.MONGO_URL;
export const PORT = process.env.PORT || 7860;