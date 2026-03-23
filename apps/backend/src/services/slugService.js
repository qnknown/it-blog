import { supabaseAdmin } from '../supabase/admin.js';
import { slugify } from '../utils/slug.js';

async function isTaken(table, slug, excludeId) {
  let q = supabaseAdmin.from(table).select('id').eq('slug', slug).limit(1);
  if (excludeId) q = q.neq('id', excludeId);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function uniqueSlug(table, sourceText, excludeId = null) {
  let base = slugify(sourceText);
  if (!base) base = 'item';
  let candidate = base;
  let n = 2;
  while (await isTaken(table, candidate, excludeId)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}
