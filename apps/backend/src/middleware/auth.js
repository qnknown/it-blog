import { createUserClient } from '../supabase/client.js';
import { supabaseAdmin } from '../supabase/admin.js';
import { AppError } from '../utils/AppError.js';

function bearerToken(req) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return null;
  return h.slice(7).trim();
}

export async function requireAuth(req, _res, next) {
  try {
    const token = bearerToken(req);
    if (!token) {
      throw new AppError('UNAUTHORIZED', 'Missing or invalid Authorization header', 401);
    }
    const client = createUserClient(token);
    const { data, error } = await client.auth.getUser(token);
    if (error || !data?.user) {
      throw new AppError('UNAUTHORIZED', 'Invalid or expired token', 401);
    }
    req.authUser = data.user;
    req.accessToken = token;
    next();
  } catch (e) {
    next(e);
  }
}

export async function requireAdmin(req, _res, next) {
  try {
    const token = bearerToken(req);
    if (!token) {
      throw new AppError('UNAUTHORIZED', 'Missing or invalid Authorization header', 401);
    }
    const client = createUserClient(token);
    const { data, error } = await client.auth.getUser(token);
    if (error || !data?.user) {
      throw new AppError('UNAUTHORIZED', 'Invalid or expired token', 401);
    }
    const userId = data.user.id;
    const { data: profile, error: pErr } = await supabaseAdmin
      .from('users')
      .select('id, is_admin')
      .eq('id', userId)
      .maybeSingle();
    if (pErr) throw new AppError('INTERNAL_SERVER_ERROR', pErr.message, 500);
    if (!profile?.is_admin) {
      throw new AppError('FORBIDDEN', 'Admin access required', 403);
    }
    req.authUser = data.user;
    req.accessToken = token;
    next();
  } catch (e) {
    next(e);
  }
}
