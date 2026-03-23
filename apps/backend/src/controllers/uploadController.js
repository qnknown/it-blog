import { AppError } from '../utils/AppError.js';
import { ok } from '../utils/response.js';
import * as uploadService from '../services/uploadService.js';

export async function upload(req, res) {
  if (!req.file?.buffer) {
    throw new AppError('VALIDATION_ERROR', 'file is required (multipart field: file)', 400);
  }
  const url = await uploadService.uploadImageBuffer(req.file.buffer, req.file.originalname, req.file.mimetype);
  return ok(res, { url, publicUrl: url });
}
