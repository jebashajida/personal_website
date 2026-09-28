import { escapeHTML as e, safeURL } from './utils.js';
import { normalizeRepositories, fetchPublicRepositories, GITHUB_USERNAME } from './github-model.js';
import { icon } from './icons.js';

const CACHE_KEY = 'jeba-public-repositories-v2';
const CACHE_MS = 15 * 60 * 1000;
const MAX_VISIBLE = 6;

/** A static fallback first; a best-effort live refresh only when in view. */
export function mountGitHubFeed(root, { snapshotURL } = {}) {
  if (!root) return () => {};
  const controller = new AbortController();
  const { signal } = controller;
  const grid = root.querySelector('[data-repo-grid]');
  const status = root.querySelector('[data-repo-status]');
  const refreshButton = root.querySelector('[data-refresh-repos]');
  const moreButton = root.querySelector('[data-more-repos]');
  let repositories = [], visibleCount = MAX_VISIBLE, disposed = false, loading = false;
  let liveInstalled = false, started = false;

  function draw() {
    grid.innerHTML = repositories.slice(0, visibleCount).map(repo => `
      <article class="repo-card">
        <div class="repo-card-top">${icon('github')}<span>${e(repo.language || 'Repository')}</span></div>
        <h4><a href="${e(repo.html_url)}" target="_blank" rel="noopener noreferrer">${e(repo.name)} ${icon('diagonal')}</a></h4>
        <p>${e(repo.description || 'No description added on GitHub yet. Open the repository to explore its files.')}</p>
        <div class="repo-card-bottom"><a href="${e(repo.html_url)}" target="_blank" rel="noopener noreferrer">Source code ${icon('arrow')}</a>${safeURL(repo.homepage) ? `<a href="${e(repo.homepage)}" target="_blank" rel="noopener noreferrer" title="Website URL listed on GitHub; availability is not independently verified.">Website ${icon('diagonal')}</a>` : ''}</div>
      </article>`).join('');
    moreButton.hidden = repositories.length <= visibleCount;
    moreButton.textContent = `Show ${Math.min(MAX_VISIBLE, repositories.length - visibleCount)} more repositories`;
  }
  function install(snapshot, source) {
    if (!snapshot || snapshot.username !== GITHUB_USERNAME || !Array.isArray(snapshot.repositories)) return false;
    repositories = normalizeRepositories(snapshot.repositories);
    visibleCount = MAX_VISIBLE;
    draw();
    const count = `${repositories.length} public repositories`;
    status.textContent = source === 'live'
      ? `${count} loaded from GitHub${snapshot.complete ? '' : ' - partial list'}.`
      : snapshot.source === 'github-api'
        ? `Saved GitHub snapshot from ${String(snapshot.checkedAt).slice(0, 10)}${snapshot.complete ? '' : ' - partial list'}.`
        : 'Reviewed selection. Refresh to check for newer repositories.';
    if (!repositories.length) status.textContent = 'No public, non-fork repositories were returned. Your selected projects are shown above.';
    return true;
  }
  async function refresh() {
    if (disposed || loading) return;
    loading = true;
    refreshButton.disabled = true;
    refreshButton.setAttribute('aria-busy', 'true');
    status.textContent = 'Checking public repositories on GitHub...';
    const requestController = new AbortController();
    const abort = () => requestController.abort();
    signal.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, 12000);
    try {
      const snapshot = await fetchPublicRepositories({ signal: requestController.signal });
      if (disposed) return;
      liveInstalled = install(snapshot, 'live');
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), snapshot })); } catch { /* Storage is optional. */ }
    } catch (error) {
      if (!disposed) status.textContent = `${repositories.length ? 'Showing saved repositories. ' : ''}Live refresh unavailable. ${error.message?.includes('limit') ? error.message : 'Use Refresh to try again, or open GitHub.'}`;
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener('abort', abort);
      loading = false;
      if (!disposed) { refreshButton.disabled = false; refreshButton.removeAttribute('aria-busy'); }
    }
  }
  refreshButton.addEventListener('click', () => void refresh(), { signal });
  moreButton.addEventListener('click', () => { visibleCount += MAX_VISIBLE; draw(); }, { signal });
  // Mounting is resilient to blocked storage and a temporarily offline API.
  let recentCache = false;
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.savedAt < CACHE_MS && Date.now() >= cached.savedAt) {
      recentCache = install(cached.snapshot, 'cache');
      liveInstalled = recentCache;
    }
  } catch { /* Ignore malformed or inaccessible storage. */ }
  if (!recentCache && snapshotURL) {
    fetch(snapshotURL, { signal, credentials: 'same-origin' }).then(response => {
      if (!response.ok) throw new Error('Snapshot unavailable');
      return response.json();
    }).then(snapshot => { if (!disposed && !liveInstalled) install(snapshot, 'saved'); }).catch(() => {
      if (!disposed && !liveInstalled && !loading) status.textContent = 'Use Refresh to load public repositories, or explore GitHub.';
    });
  }
  const observer = new IntersectionObserver(entries => {
    if (!started && entries.some(entry => entry.isIntersecting)) {
      started = true;
      observer.disconnect();
      if (!recentCache) void refresh();
    }
  }, { rootMargin: '120px' });
  observer.observe(root);
  return () => { disposed = true; controller.abort(); observer.disconnect(); };
}
