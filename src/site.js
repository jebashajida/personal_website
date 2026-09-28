import { profile, projects, skillGroups, experience, education, research } from './data.js';
import { escapeHTML as e, safeURL, filterProjects } from './utils.js';
import { icon } from './icons.js';
import { projectArtwork } from './artwork.js';
import { mountHero } from './hero.js';
import { mountGitHubFeed } from './github-feed.js';
import { mountPlayground } from './playground.js';

const socialsHTML = () => Object.entries(profile.socials).filter(([, url]) => safeURL(url)).map(([label,url]) => `<a href="${e(safeURL(url))}" target="_blank" rel="noopener noreferrer">${e(({ github: 'GitHub', linkedin: 'LinkedIn', artstation: 'ArtStation' })[label] || label)} ${icon('diagonal')}</a>`).join('');

function projectLinks(project, compact = false) {
  const style = compact ? 'project-link' : 'button button-outline';
  const links = [];
  if (safeURL(project.github)) links.push(`<a class="${style}" href="${e(safeURL(project.github))}" target="_blank" rel="noopener noreferrer">${icon('github')} ${e(project.githubLabel || 'GitHub')} ${icon('diagonal')}</a>`);
  if (safeURL(project.preview)) links.push(`<a class="${style}" href="${e(safeURL(project.preview))}" target="_blank" rel="noopener noreferrer">View notebook ${icon('diagonal')}</a>`);
  if (safeURL(project.live)) links.push(`<a class="${style} live-link" href="${e(safeURL(project.live))}" target="_blank" rel="noopener noreferrer">Live demo ${icon('diagonal')}</a>`);
  return links.join('');
}
function projectCard(project) {
  return `<article class="project-card" data-category="${e(project.category)}">
    <button class="project-visual visual-${e(project.art)}" data-project="${e(project.id)}" aria-label="Read about ${e(project.title)}">${projectArtwork(project.art)}<span class="project-open" aria-hidden="true">${icon('diagonal')}</span></button>
    <div class="project-meta"><span class="eyebrow">${e(project.label)}</span><span class="project-number">/${e(project.number)}</span></div>
    <div class="project-title-row"><h3><button data-project="${e(project.id)}">${e(project.title)}</button></h3></div>
    <p class="project-description">${e(project.description)}</p><div class="project-tags">${project.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div>
    <div class="project-card-links">${projectLinks(project,true)}<button class="project-detail-link" data-project="${e(project.id)}">Details ${icon('arrow')}</button></div>
  </article>`;
}

/**
 * Framework-independent application mount. Returns full cleanup for React
 * StrictMode, page transitions, or embedding. All runtime data stays local.
 */
export function mountPortfolio(root, options = {}) {
  if (!(root instanceof HTMLElement)) throw new TypeError('A valid root element is required.');
  const publicBase = options.publicBase || new URL('../public/', import.meta.url).href;
  // Optional asset resolver supports offline embedding and isolated UI tests.
  const asset = (file) => typeof options.resolveAsset === 'function'
    ? options.resolveAsset(file)
    : new URL(file, new URL(publicBase, document.baseURI)).href;
  const cv = e(asset(profile.resumeFile));
  const cvLink = (className, label = 'Download CV') => profile.showResume ? `<a class="${className}" href="${cv}" download="${e(profile.resumeFile)}">${label} ${icon('download')}</a>` : '';

  root.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header" id="top">
      <div class="container header-inner">
        <a class="brand" href="#top" aria-label="Jeba Shajida, home"><span class="brand-mark">j<span>_</span>s<span class="brand-dot">.</span></span><span class="brand-name">jeba shajida<span>DEVELOPER &amp; DESIGNER</span></span></a>
        <nav class="nav-links" id="primary-navigation" aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#experience">Experience</a><a href="#playground">Playground</a><a href="#research">Research</a></nav>
        <div class="header-actions"><button class="icon-button theme-button" data-action="theme" aria-label="Use dark theme" aria-pressed="false">${icon('moon')}</button><a class="nav-contact" href="#contact">Let's talk ${icon('diagonal')}</a><button class="icon-button menu-button" data-action="menu" aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded="false">${icon('menu')}</button></div>
      </div>
    </header>
    <main id="main-content">
      <section class="hero container" aria-labelledby="hero-title">
        <div class="hero-copy">
          <div class="hero-eyebrow"><span class="small-dot"></span> HELLO, I'M ${e(profile.name.toUpperCase())}</div>
          <h1 id="hero-title">I make ideas<br>come <span class="serif-word">alive<span class="word-dot">.</span></span></h1>
          <p class="hero-role">${e(profile.headline)}.</p>
          <p class="hero-description">${e(profile.description)}</p>
          <div class="hero-actions"><a class="button button-dark" href="#work">Explore my work ${icon('diagonal')}</a>${cvLink('text-button')}</div>
          <div class="hero-footnote">${icon('pin')} ${e(profile.location)}<span class="footnote-divider"></span><span>Code. Design. Dimension.</span></div>
        </div>
        <div class="hero-art" data-view="avatar" data-motion="on">
          <div class="scene-label"><span class="small-dot"></span> CODE, CREATIVITY &amp; A LITTLE CURIOSITY</div>
          <div class="hero-art-stage">
            <figure class="avatar-scene">
              <picture>
                <source type="image/webp" srcset="${e(asset('jeba-avatar-640.webp'))} 640w, ${e(asset('jeba-avatar-1024.webp'))} 1024w, ${e(asset('jeba-avatar-1254.webp'))} 1254w" sizes="(max-width: 720px) 92vw, (max-width: 1040px) 70vw, 590px">
                <img class="hero-avatar" src="${e(asset(profile.avatarFile))}" width="1254" height="1254" loading="eager" fetchpriority="high" decoding="async" alt="An illustrated avatar inspired by Jeba's photo: glasses, dark hair, and a blue outfit, seated at a desktop computer with creative coding objects around her.">
              </picture>
            </figure>
            <div class="scene-viewport" id="hero-scene" hidden tabindex="0" role="group" aria-label="Interactive geometric 3D study. Drag or use arrow keys to rotate; Home resets the view.">
              <div class="scene-fallback" aria-hidden="true"><div class="fallback-ring"></div><div class="fallback-cube"></div><div class="fallback-orb"></div></div>
            </div>
          </div>
          <div class="hero-studio-controls">
            <div class="hero-view-switch" role="group" aria-label="Choose hero artwork"><button data-hero-view="avatar" aria-pressed="true">My workspace</button><button data-hero-view="sculpture" aria-pressed="false">3D study ${icon('cube')}</button></div>
            <div data-avatar-controls><button class="scene-mode" data-hero-action="avatar-motion" aria-pressed="true" aria-label="Pause avatar illustration motion">${icon('pause')}<span>Motion</span></button></div>
            <div class="scene-buttons" data-scene-controls hidden><button class="scene-mode" data-hero-action="wireframe" aria-pressed="false">${icon('cube')}<span>Wireframe</span></button><button class="icon-button" data-hero-action="scene-motion" aria-label="Pause 3D study" aria-pressed="false">${icon('pause')}</button><button class="icon-button" data-hero-action="reset-scene" aria-label="Reset 3D study">${icon('reset')}</button></div>
          </div>
          <p class="hero-art-caption" data-hero-status role="status">PERSONAL AVATAR / ILLUSTRATED WORKSPACE</p>
        </div>
      </section>
      <div class="tool-strip"><div class="container tool-strip-inner"><span class="tool-strip-caption">MY CREATIVE TOOLKIT</span><div class="tool-names"><span>Three.js</span><span class="tool-star">*</span><span>Two.js</span><span class="tool-star">*</span><span>Blender</span><span class="tool-star">*</span><span>Unity</span><span class="tool-star">*</span><span>SCADA</span></div></div></div>
      <section class="section container work-section" id="work" aria-labelledby="work-title">
        <div class="section-heading"><div><span class="section-kicker">01 / SELECTED WORK</span><h2 id="work-title">Different challenges.<br><span class="serif-word">Same curiosity.</span></h2></div><p>A few things I've explored,<br>designed, and brought to life.</p></div>
        <div class="filter-row"><div class="project-filters" role="group" aria-label="Filter projects"><button class="filter-button active" data-filter="all" aria-pressed="true">All work <span>${String(projects.length).padStart(2,'0')}</span></button><button class="filter-button" data-filter="software" aria-pressed="false">Software</button><button class="filter-button" data-filter="graphics" aria-pressed="false">Graphics</button><button class="filter-button" data-filter="ml" aria-pressed="false">Machine learning</button></div><span class="project-result" role="status" id="project-result">${projects.length} projects</span></div>
        <div class="project-grid" id="project-grid">${projects.map(projectCard).join('')}</div>
        <section class="github-feed" aria-labelledby="repo-title" data-github-feed>
          <div class="repo-heading"><div><span class="section-kicker">FROM THE WORKBENCH</span><h3 id="repo-title">Currently on <span class="serif-word">GitHub.</span></h3></div><button class="small-button" data-refresh-repos>${icon('reset')} Refresh</button></div>
          <p class="repo-intro">Public repositories, experiments, and coursework. Descriptions come from GitHub; website buttons use the URL listed by each repository.</p>
          <p class="repo-status" data-repo-status role="status" aria-live="polite">Loading the saved repository selection...</p>
          <div class="repo-grid" data-repo-grid></div>
          <button class="small-button repo-more" data-more-repos hidden>Show more repositories</button>
        </section>
        <div class="github-banner"><div><span class="github-banner-icon">${icon('github')}</span><div><h3>More of the process. In the open.</h3><p>Explore my repositories, experiments, and coursework.</p></div></div><a class="button button-outline" href="${e(profile.socials.github)}?tab=repositories" target="_blank" rel="noopener noreferrer">Explore GitHub ${icon('diagonal')}</a></div>
        <p class="art-disclaimer">Descriptions from my CV and public GitHub repositories. Previews are original concept illustrations, not project screenshots. Notebook links open source previews, not running applications.</p>
      </section>
      <section class="expertise-section" aria-labelledby="expertise-title"><div class="container">
        <div class="section-heading compact"><div><span class="section-kicker">THE WAY I WORK</span><h2 id="expertise-title">One mind. <span class="serif-word">Many mediums.</span></h2></div></div>
        <div class="expertise-grid">${skillGroups.map(group=>`<article class="expertise-card"><div class="expertise-top"><span class="expertise-icon">${icon(group.icon)}</span><span>${e(group.number)}</span></div><h3>${e(group.title)}</h3><p>${e(group.description)}</p><div class="skill-tags">${group.skills.map(skill=>`<span>${e(skill)}</span>`).join('')}</div></article>`).join('')}</div>
      </div></section>
      <section class="section container about-section" id="about" aria-labelledby="about-title">
        <div class="about-art" aria-hidden="true"><span class="about-art-caption">A FEW WORDS ABOUT ME</span><div class="about-initials">j<span>s</span><span class="initial-dot">.</span></div><div class="about-scribble">Always a work<br>in progress.</div><div class="about-stamp">${icon('spark')} BUILT ON CURIOSITY</div><span class="about-art-index">LOGIC + IMAGINATION</span></div>
        <div class="about-copy"><span class="section-kicker">02 / THE PERSON BEHIND THE PIXELS</span><h2 id="about-title">Curiosity is my<br><span class="serif-word">default setting.</span></h2><p>${e(profile.about)}</p><p>${e(profile.aboutSecond)}</p><div class="about-languages">${icon('pin')} ${e(profile.location)}<span>${e(profile.languages.join(' / '))}</span></div>
        <div class="education-feature"><span class="education-icon">${icon('code')}</span><div><span class="eyebrow">EDUCATION</span><h3>${e(education[0].degree)}</h3><p>${e(education[0].institution)}</p><div class="education-meta"><span>${e(education[0].period)}</span><b>${e(education[0].grade)}</b></div></div></div>
        <details class="more-education"><summary>Earlier education <span>+</span></summary>${education.slice(1).map(item=>`<div><h4>${e(item.degree)}</h4><p>${e(item.institution)}</p><span>${e(item.period)} &middot; ${e(item.grade)}</span></div>`).join('')}</details>
        </div>
      </section>
      <section class="experience-section" id="experience" aria-labelledby="experience-title"><div class="container experience-layout">
        <div class="experience-intro"><span class="section-kicker">03 / EXPERIENCE</span><h2 id="experience-title">Learning by<br><span class="serif-word">building.</span></h2><p>Software research, IT operations,<br>and interfaces for real workflows.</p>${cvLink('text-button', 'View my full CV')}</div>
        <div class="experience-list">${experience.map((item,index)=>`<article class="experience-item"><div class="experience-marker" aria-hidden="true">0${index+1}</div><div class="experience-item-content"><span class="experience-period">${e(item.period)}</span><h3>${e(item.role)}</h3><p class="experience-company">${e(item.organization)}</p><p class="experience-description">${e(item.description)}</p><div class="skill-tags">${item.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div></div></article>`).join('')}</div>
      </div></section>
      <section class="playground-section" id="playground" aria-labelledby="playground-title"><div class="container">
        <div class="section-heading"><div><span class="section-kicker">04 / THE PLAYGROUND</span><h2 id="playground-title">Less theory.<br><span class="serif-word">More "what happens if?"</span></h2></div><p>Small interactive studies.<br>Go ahead. Play with the controls.</p></div>
        <div id="playground-root"></div>
      </div></section>
      <section class="section container research-section" id="research" aria-labelledby="research-title">
        <div class="research-intro"><span class="section-kicker">05 / RESEARCH &amp; EXPLORATION</span><h2 id="research-title">Good questions.<br><span class="serif-word">New perspectives.</span></h2><p>Research work spanning medical imaging, data mining, traffic management, and computer vision.</p>${cvLink('text-button', 'Read my CV')}</div>
        <div class="research-list">${research.map((item,index)=>`<article class="research-item"><span class="research-number">0${index+1}</span><div><span class="eyebrow">${e(item.tag)}</span><h3>${e(item.title)}</h3>${item.note ? `<p class="research-note">${e(item.note)}</p>` : ''}</div>${icon('spark')}</article>`).join('')}</div>
      </section>
      <section class="contact-section" id="contact" aria-labelledby="contact-title"><div class="container">
        <div class="contact-top"><span class="section-kicker">HAVE AN IDEA IN MIND?</span><span class="contact-location">${icon('pin')} ${e(profile.location)}</span></div>
        <div class="contact-main"><h2 id="contact-title">Let's make<br>something <span class="serif-word">matter.</span></h2><a class="contact-circle" href="mailto:${e(profile.email)}" aria-label="Email Jeba Shajida">${icon('diagonal')}</a></div>
        <div class="contact-bottom"><div><p>Web. 3D. Something in between.</p><div class="email-row"><a href="mailto:${e(profile.email)}">${e(profile.email)}</a><button class="icon-button" data-action="copy-email" aria-label="Copy email address">${icon('copy')}</button></div><span class="contact-note">Say hello or tell me what you're building.</span></div><div class="social-links">${socialsHTML()}${cvLink('footer-cv', 'My resume')}</div></div>
      </div></section>
    </main>
    <footer class="site-footer"><div class="container"><a class="footer-brand" href="#top">jeba shajida<span>.</span></a><p>&copy; ${new Date().getFullYear()} ${e(profile.name)}. Made with intention.</p><a class="back-top" href="#top">Back to top ${icon('diagonal')}</a></div></footer>
    <dialog class="project-dialog" aria-labelledby="dialog-title"><button class="dialog-close icon-button" data-action="close-project" aria-label="Close project details">${icon('close')}</button><div id="dialog-content"></div></dialog>
    <div class="toast" role="status" aria-live="polite"></div>
  `;

  const controller = new AbortController();
  const { signal } = controller;
  let toastTimer, lastFocus, previousOverflow = '', disposed = false;
  const dialog = root.querySelector('.project-dialog');
  const header = root.querySelector('.site-header');
  const select = (selector) => root.querySelector(selector);

  function toast(message) {
    const element = select('.toast');
    element.textContent = message; element.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(()=>element.classList.remove('visible'), 3200);
  }
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const button = select('[data-action="theme"]');
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', theme === 'dark' ? 'Use light theme' : 'Use dark theme');
    button.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
    try { localStorage.setItem('jeba-theme', theme); } catch { /* Private mode can disallow storage. */ }
  }
  let theme = 'light';
  try { theme = localStorage.getItem('jeba-theme') === 'dark' ? 'dark' : 'light'; } catch { /* Default to light. */ }
  setTheme(theme);

  function closeMenu() {
    header.classList.remove('menu-open');
    select('[data-action="menu"]').setAttribute('aria-expanded','false');
    select('[data-action="menu"]').setAttribute('aria-label','Open navigation');
    select('[data-action="menu"]').innerHTML = icon('menu');
  }
  function openProject(id, trigger) {
    const project = projects.find(item => item.id === id);
    if (!project) return;
    lastFocus = trigger;
    select('#dialog-content').innerHTML = `<div class="dialog-art visual-${e(project.art)}">${projectArtwork(project.art)}</div><div class="dialog-copy"><span class="section-kicker">${e(project.label)}</span><h2 id="dialog-title">${e(project.title)}</h2>${project.originalTitle ? `<p class="original-title">${e(project.originalTitle)}</p>` : ''}<p>${e(project.description)}</p><h3>${e(project.roleHeading || 'My contribution')}</h3><p>${e(project.role)}</p><h3>Project scope</h3><ul>${project.details.map(detail=>`<li>${e(detail)}</li>`).join('')}</ul><div class="project-tags">${project.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div><div class="dialog-links">${projectLinks(project)}</div>${!safeURL(project.live) ? '<p class="demo-status">No verified live demo is listed for this project.</p>' : ''}<details class="source-note"><summary>About this project description</summary><p>${e(project.sourceNote)}</p></details><p class="art-disclaimer">Illustrative portfolio artwork, not an original project screenshot.</p></div>`;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    select('.dialog-close').focus();
  }
  dialog.addEventListener('close', ()=>{ document.body.style.overflow = previousOverflow; lastFocus?.focus(); }, { signal });
  dialog.addEventListener('click', (event)=>{ if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } }, { signal });

  const disposeHero = mountHero(select('.hero-art'));
  const disposeGitHubFeed = mountGitHubFeed(select('[data-github-feed]'), { snapshotURL: asset('github-projects.json') });
  const disposePlayground = mountPlayground(select('#playground-root'));

  async function copyEmail() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(profile.email);
      if (!disposed) toast('Email address copied. Say hello!');
    } catch {
      // Older browsers and HTTP hosts: best-effort fallback, never fake success.
      const input = document.createElement('textarea'); input.value = profile.email;
      input.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.append(input); input.select();
      let success = false; try { success = document.execCommand('copy'); } catch { /* Expose address below instead. */ }
      input.remove(); if (!disposed) { select('[data-action="copy-email"]').focus(); toast(success ? 'Email address copied.' : `Please copy manually: ${profile.email}`); }
    }
  }
  root.addEventListener('click', (event) => {
    const target = event.target.closest('button, a'); if (!target || !root.contains(target)) return;
    if (target.dataset.project) openProject(target.dataset.project, target);
    if (target.dataset.filter) {
      const category = target.dataset.filter;
      root.querySelectorAll('[data-filter]').forEach(button=>{ const active = button.dataset.filter === category; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); });
      const filtered = filterProjects(projects, category);
      select('#project-grid').innerHTML = filtered.map(projectCard).join('');
      select('#project-result').textContent = `${filtered.length} project${filtered.length === 1 ? '' : 's'}`;
    }
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) closeMenu();
    switch (target.dataset.action) {
      case 'theme': setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); break;
      case 'menu': {
        const isOpen = header.classList.toggle('menu-open'); target.setAttribute('aria-expanded',String(isOpen)); target.setAttribute('aria-label',isOpen ? 'Close navigation' : 'Open navigation'); target.innerHTML = icon(isOpen ? 'close' : 'menu'); break;
      }
      case 'copy-email': void copyEmail(); break;
      case 'close-project': dialog.close(); break;
    }
  }, { signal });
  document.addEventListener('keydown', (event)=>{ if (event.key === 'Escape') closeMenu(); }, { signal });
  // Use the original event path: toggling replaces the menu SVG, so the
  // old event.target may already be detached when the document sees it.
  document.addEventListener('click', (event)=>{ if (!event.composedPath().includes(header)) closeMenu(); }, { signal });

  // Highlight the section currently being read without hijacking scrolling.
  const observer = new IntersectionObserver((entries)=>{
    for (const entry of entries) if (entry.isIntersecting) {
      root.querySelectorAll('.nav-links a').forEach(link=>{
        if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  ['work','about','experience','playground','research'].forEach(id=>observer.observe(select(`#${id}`)));

  return () => {
    disposed = true; clearTimeout(toastTimer);
    if (dialog.open) dialog.close();
    controller.abort(); observer.disconnect(); disposeHero(); disposeGitHubFeed(); disposePlayground();
    document.body.style.overflow = previousOverflow;
    root.innerHTML = '';
  };
}
