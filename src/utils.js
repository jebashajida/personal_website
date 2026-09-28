/** Small, testable helpers shared by the UI and demonstrations. */
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function safeURL(value) {
  if (!value) return '';
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? parsed.href : '';
  } catch { return ''; }
}

export function filterProjects(projects, category) {
  return category === 'all' ? projects : projects.filter((project) => project.category === category);
}

/** Simulation only: no physical I/O, no PLC protocol, no safety logic. */
export function nextTankLevel(level, pumpOn, seconds = 0.5) {
  return clamp(level + (pumpOn ? 5 : -0.6) * Math.max(0, seconds), 0, 100);
}
export const alarmState = (level) => level >= 85 ? 'High level' : level <= 15 ? 'Low level' : 'Normal';

/** Seeded randomness makes the generative study reproducible and testable. */
export function seededRandom(seed) {
  let state = seed >>> 0;
  return () => { state = (1664525 * state + 1013904223) >>> 0; return state / 4294967296; };
}

export function generateStudy(seed = 1, complexity = 16) {
  const random = seededRandom(seed);
  const count = Math.round(clamp(complexity, 6, 28));
  const palette = ['#d2e994', '#223d33', '#ee9873', '#95b5a5', '#f7f4e9'];
  return Array.from({ length: count }, (_, index) => ({
    x: 90 + (index % 7) * 70,
    y: 85 + Math.floor(index / 7) * 68,
    size: 16 + random() * 22,
    rotation: Math.floor(random() * 4) * 90,
    type: Math.floor(random() * 3),
    color: palette[Math.floor(random() * palette.length)],
  }));
}
