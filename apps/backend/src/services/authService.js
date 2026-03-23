import { supabase } from '../supabase/client.js';
import { AppError } from '../utils/AppError.js';

export async function loginWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new AppError('AUTH_FAILED', error.message, 401);
  }
  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_in: data.session.expires_in,
    token_type: data.session.token_type,
    user: data.user,
  };
}
