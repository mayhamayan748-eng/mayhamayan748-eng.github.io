import type { Locale } from '@/i18n/ui';

/** Mirrors the API's PostOut schema. */
export type Post = {
  slug: string;
  locale: Locale;
  title: string;
  summary: string;
  body_md: string;
  tags: string[];
  cover_url: string | null;
  published_at: string | null;
  translation_group: string | null;
};

const cache = new Map<Locale, Promise<Post[]>>();

/**
 * Fetch published posts from the API at build time.
 * Any failure (API down, not configured) yields an empty list, which hides the blog entirely.
 */
export function getPosts(locale: Locale): Promise<Post[]> {
  const api = import.meta.env.PUBLIC_API_URL;
  if (!api) return Promise.resolve([]);
  if (!cache.has(locale)) {
    cache.set(
      locale,
      fetch(`${api}/api/posts?locale=${locale}`, { signal: AbortSignal.timeout(5000) })
        .then((r) => (r.ok ? (r.json() as Promise<Post[]>) : []))
        .catch(() => []),
    );
  }
  return cache.get(locale)!;
}
