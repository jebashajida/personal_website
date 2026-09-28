import { mountPortfolio } from './site.js';
const root = document.getElementById('root');
try {
  mountPortfolio(root);
} catch (error) {
  console.error('Portfolio initialization failed:', error);
  root.innerHTML = '<main style="padding:3rem;font-family:system-ui"><h1>Jeba Shajida</h1><p>The interactive portfolio could not load. Please refresh or use a recent browser.</p><a href="mailto:jeba.18feb@gmail.com">Contact Jeba</a></main>';
}
