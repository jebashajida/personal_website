import { safeURL } from './utils.js';

export const GITHUB_USERNAME = 'jebashajida';
export const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

/** Accept only public repositories belonging to this account. Never trust HTML. */
export function normalizeRepository(raw) {
  if (!raw || typeof raw !== 'object' || raw.private || raw.fork) return null;
  if (typeof raw.name !== 'string' || !raw.name || raw.name.length > 160) return null;
  const href = safeURL(raw.html_url);
  if (!href) return null;
  const url = new URL(href);
  const parts = url.pathname.split('/').filter(Boolean);
  if (url.hostname !== 'github.com' || parts.length !== 2 || parts[0].toLowerCase() !== GITHUB_USERNAME) return null;
  if (decodeURIComponent(parts[1]) !== raw.name || url.username || url.password) return null;
  const date = typeof raw.updated_at === 'string' && Number.isFinite(Date.parse(raw.updated_at)) ? raw.updated_at : null;
  return {
    name: raw.name, html_url: href,
    description: typeof raw.description === 'string' ? raw.description.trim().slice(0, 1200) : '',
    language: typeof raw.language === 'string' ? raw.language.slice(0, 80) : '',
    homepage: safeURL(raw.homepage), updated_at: date,
    private: false, fork: false,
  };
}

export function normalizeRepositories(rows) {
  if (!Array.isArray(rows)) throw new TypeError('GitHub did not return a repository list.');
  const unique = new Map();
  for (const row of rows) {
    let repository;
    try { repository = normalizeRepository(row); } catch { continue; }
    if (repository) unique.set(repository.html_url, repository);
  }
  return [...unique.values()].sort((a, b) => (Date.parse(b.updated_at) || 0) - (Date.parse(a.updated_at) || 0));
}

/**
 * Fetch metadata, not repository code. Public reads need no browser token.
 * Follow pagination, cap work, and retain an explicit completeness flag.
 * fetchImpl is injectable for offline/rate-limit/pagination regression tests.
 */
export async function fetchPublicRepositories({ fetchImpl = globalThis.fetch, signal, token = '', maxPages = 5 } = {}) {
  const rows = [];
  let complete = false;
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`; // Node build only. Never store in an asset.
  for (let page = 1; page <= maxPages; page += 1) {
    const response = await fetchImpl(`${GITHUB_API}?per_page=100&sort=updated&direction=desc&page=${page}`, {
      headers, signal, credentials: 'omit', referrerPolicy: 'no-referrer',
    });
    if (!response.ok) {
      if (response.status === 403 || response.status === 429) throw new Error('GitHub request limit reached. Please try again later.');
      throw new Error(`GitHub is unavailable (HTTP ${response.status}).`);
    }
    const pageRows = await response.json();
    if (!Array.isArray(pageRows)) throw new TypeError('GitHub did not return a repository list.');
    rows.push(...pageRows);
    const hasNext = /rel="next"/.test(response.headers.get('link') || '');
    if (!hasNext) { complete = true; break; }
  }
  return {
    schemaVersion: 1, username: GITHUB_USERNAME, checkedAt: new Date().toISOString(),
    source: 'github-api', complete, repositories: normalizeRepositories(rows),
  };
}
