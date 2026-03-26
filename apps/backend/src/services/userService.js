import { supabase } from '../supabase/client.js';
import { supabaseAdmin } from '../supabase/admin.js';
import { uniqueSlug } from './slugService.js';

const userPublic = 'id, slug, name, bio, avatar_url, profile_url, created_at';

export async function getAuthorBySlug(slug) {
  const { data, error } = await supabase.from('users').select(userPublic).eq('slug', slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { count, error: cErr } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', data.id)
    .eq('status', 'published');
  if (cErr) throw cErr;
  return { ...data, published_articles: count ?? 0 };
}

export async function listUsersAdmin() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, slug, name, bio, avatar_url, profile_url, is_admin, created_at')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function listArticlesByAuthorSlug(authorSlug, { from, to }) {
  const { data: author, error: aErr } = await supabase.from('users').select('id').eq('slug', authorSlug).maybeSingle();
  if (aErr) throw aErr;
  if (!author) return { rows: [], total: 0 };
  const { data, error, count } = await supabase
    .from('articles')
    .select(
      `
      id,
      slug,
      title,
      excerpt,
      category_id,
      author_id,
      status,
      published_at,
      views,
      cover_url,
      created_at,
      updated_at,
      categories ( id, slug, name ),
      author:users!author_id ( id, slug, name, avatar_url )
    `,
      { count: 'exact' }
    )
    .eq('status', 'published')
    .eq('author_id', author.id)
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(from, to);
  if (error) throw error;
  return { rows: data || [], total: count ?? 0 };
}

export async function ensureUserProfile(authUser) {
  const { data: existing } = await supabaseAdmin.from('users').select('id').eq('id', authUser.id).maybeSingle();
  if (existing) return;
  const email = authUser.email || '';
  const base = email.split('@')[0] || 'author';
  const slug = await uniqueSlug('users', base);
  const { error } = await supabaseAdmin.from('users').insert({
    id: authUser.id,
    slug,
    name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || base,
    is_admin: false,
  });
  if (error && error.code !== '23505') throw error;
}
