import { AppError } from '../utils/AppError.js';
import { ok } from '../utils/response.js';
import * as authService from '../services/authService.js';

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    throw new AppError('VALIDATION_ERROR', 'email and password are required', 400);
  }
  const session = await authService.loginWithPassword(email, password);
  return ok(res, {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: session.user,
  });
}

export async function logout(_req, res) {
  return ok(res, { ok: true });
}
