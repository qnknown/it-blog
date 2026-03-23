import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../supabase/admin.js';
import { AppError } from '../utils/AppError.js';

const BUCKET = 'images';

export async function uploadImageBuffer(buffer, originalName, contentType) {
  const ext = (originalName && originalName.includes('.')) ? originalName.split('.').pop().toLowerCase() : 'bin';
  const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) ? ext : 'bin';
  const path = `uploads/${randomUUID()}.${safeExt}`;
  const { error: upErr } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType: contentType || 'application/octet-stream',
    upsert: false,
  });
  if (upErr) throw new AppError('STORAGE_ERROR', upErr.message, 400);
  const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  if (!pub?.publicUrl) throw new AppError('STORAGE_ERROR', 'Could not resolve public URL', 500);
  return pub.publicUrl;
}
