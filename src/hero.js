import { mountScene } from './scene.js';
import { icon } from './icons.js';

/**
 * Keep illustration and actual 3D separate. The avatar is an approved image,
 * not a rotatable model; wireframe controls belong only to the WebGL study.
 * WebGL is created on demand and fully released when leaving the study.
 */
export function mountHero(root) {
  const controller = new AbortController();
  const { signal } = controller;
  const query = selector => root.querySelector(selector);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const avatar = query('.avatar-scene');
  const sceneHost = query('#hero-scene');
  const motionButton = query('[data-hero-action="avatar-motion"]');
  let scene = null;
  let animate = !reducedMotion.matches;
  let view = 'avatar';

  function setAvatarMotion(value) {
    animate = Boolean(value);
    root.dataset.motion = animate ? 'on' : 'off';
    motionButton.setAttribute('aria-pressed', String(animate));
    motionButton.setAttribute('aria-label', animate ? 'Pause avatar illustration motion' : 'Animate avatar illustration');
    motionButton.innerHTML = `${icon(animate ? 'pause' : 'play')}<span>Motion</span>`;
  }

  function updateScene(state) {
    const wireframe = query('[data-hero-action="wireframe"]');
    wireframe.setAttribute('aria-pressed', String(state.wireframe));
    wireframe.classList.toggle('active', state.wireframe);
    const motion = query('[data-hero-action="scene-motion"]');
    motion.setAttribute('aria-pressed', String(state.paused));
    motion.setAttribute('aria-label', state.paused ? 'Play 3D study' : 'Pause 3D study');
    motion.innerHTML = icon(state.paused ? 'play' : 'pause');
    root.querySelectorAll('[data-scene-controls] button').forEach(button => { button.disabled = !state.available; });
    query('[data-hero-status]').textContent = state.available
      ? 'DRAG TO EXPLORE / ARROW KEYS TO ROTATE'
      : 'STATIC STUDY / WEBGL IS NOT AVAILABLE';
  }

  function setView(nextView) {
    if (!['avatar', 'sculpture'].includes(nextView)) return;
    if (nextView === view && (nextView !== 'sculpture' || scene)) return;
    scene?.dispose();
    scene = null;
    view = nextView;
    root.dataset.view = nextView;
    avatar.hidden = nextView !== 'avatar';
    sceneHost.hidden = nextView !== 'sculpture';
    query('[data-avatar-controls]').hidden = nextView !== 'avatar';
    query('[data-scene-controls]').hidden = nextView !== 'sculpture';
    root.querySelectorAll('[data-hero-view]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.heroView === nextView));
    });
    if (nextView === 'sculpture') {
      try { scene = mountScene(sceneHost, updateScene); }
      catch { updateScene({ available: false, paused: true, wireframe: false }); }
    } else {
      query('[data-hero-status]').textContent = 'PERSONAL AVATAR / ILLUSTRATED WORKSPACE';
    }
  }

  root.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !root.contains(button)) return;
    if (button.dataset.heroView) setView(button.dataset.heroView);
    switch (button.dataset.heroAction) {
      case 'avatar-motion': setAvatarMotion(!animate); break;
      case 'wireframe': scene?.toggleWireframe(); break;
      case 'scene-motion': scene?.togglePause(); break;
      case 'reset-scene': scene?.reset(); break;
    }
  }, { signal });
  reducedMotion.addEventListener('change', event => setAvatarMotion(!event.matches), { signal });
  // CSS animation stops offscreen, on hidden tabs, and in reduced-motion mode.
  const observer = new IntersectionObserver(entries => {
    root.classList.toggle('art-offscreen', !entries[0].isIntersecting);
  });
  observer.observe(root);
  document.addEventListener('visibilitychange', () => root.classList.toggle('tab-hidden', document.hidden), { signal });
  setAvatarMotion(animate);
  return () => { controller.abort(); observer.disconnect(); scene?.dispose(); };
}
