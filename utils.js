import crypto from "crypto";

export function generateId() {
  return crypto.randomBytes(8).toString("hex");
}

export function buildFileUrl(req, fileId) {
  return `${req.protocol}://${req.get("host")}/file/${fileId}`;
}