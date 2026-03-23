import { supabase } from '../supabase/client.js';
import { supabaseAdmin } from '../supabase/admin.js';
import { AppError } from '../utils/AppError.js';
import { uniqueSlug } from './slugService.js';

export async function getCategoryBySlug(slug) {
  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data || [];
}

export async function getCategoryById(id) {
  const { data, error } = await supabaseAdmin.from('categories').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function createCategory(body) {
  const name = body.name?.trim();
  if (!name) throw new AppError('VALIDATION_ERROR', 'name is required', 400);
  const slug = await uniqueSlug('categories', body.slug || name);
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({
      slug,
      name,
      description: body.description ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, body) {
  const existing = await getCategoryById(id);
  if (!existing) throw new AppError('NOT_FOUND', 'Category not found', 404);
  const name = body.name !== undefined ? String(body.name).trim() : existing.name;
  let slug = existing.slug;
  if (body.name !== undefined || body.slug !== undefined) {
    slug = await uniqueSlug('categories', body.slug || name, id);
  }
  const patch = {
    slug,
    name,
    description: body.description !== undefined ? body.description : existing.description,
  };
  const { data, error } = await supabaseAdmin.from('categories').update(patch).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
  if (error) throw error;
}
