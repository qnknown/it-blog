import { ok } from '../utils/response.js';
import * as userService from '../services/userService.js';

export async function list(req, res) {
  const rows = await userService.listUsersAdmin();
  return ok(res, rows);
}
