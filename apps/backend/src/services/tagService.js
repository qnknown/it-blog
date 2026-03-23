import { supabase } from '../supabase/client.js';
import { supabaseAdmin } from '../supabase/admin.js';
import { AppError } from '../utils/AppError.js';
import { uniqueSlug } from './slugService.js';

export async function listTags() {
  const { data, error } = await supabase.from('tags').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function getTagById(id) {
  const { data, error } = await supabaseAdmin.from('tags').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createTag(body) {
  const name = body.name?.trim();
  if (!name) throw new AppError('VALIDATION_ERROR', 'name is required', 400);
  const slug = await uniqueSlug('tags', body.slug || name);
  const { data, error } = await supabaseAdmin
    .from('tags')
    .insert({ slug, name })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function updateTag(id, body) {
  const existing = await getTagById(id);
  if (!existing) throw new AppError('NOT_FOUND', 'Tag not found', 404);
  const name = body.name !== undefined ? String(body.name).trim() : existing.name;
  let slug = existing.slug;
  if (body.name !== undefined || body.slug !== undefined) {
    slug = await uniqueSlug('tags', body.slug || name, id);
  }
  const { data, error } = await supabaseAdmin.from('tags').update({ slug, name }).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteTag(id) {
  const { error: jErr } = await supabaseAdmin.from('article_tags').delete().eq('tag_id', id);
  if (jErr) throw jErr;
  const { error } = await supabaseAdmin.from('tags').delete().eq('id', id);
  if (error) throw error;
}
