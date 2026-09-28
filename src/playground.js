import { icon } from './icons.js';
import { generateStudy, clamp, nextTankLevel, alarmState } from './utils.js';

/**
 * Two small browser-only demonstrations. They are portfolio UI experiments,
 * not previous client projects. The SCADA panel has synthetic data only:
 * no device connection, backend, PLC commands, or real equipment control.
 */
export function mountPlayground(root) {
  const controller = new AbortController();
  const { signal } = controller;
  root.innerHTML = `
    <div class="playground-grid">
      <article class="lab-card vector-lab">
        <div class="lab-top"><span class="eyebrow">01 / GENERATIVE 2D</span><span class="lab-badge">SVG STUDY</span></div>
        <div class="vector-stage" id="vector-stage" role="img" aria-label="Generative composition of colored geometric shapes"></div>
        <div class="lab-description"><h3>A little organized chaos.</h3><p>Change the density. Find a new composition.</p></div>
        <div class="lab-controls"><label class="density-control" for="density">Density <input id="density" type="range" min="6" max="28" value="18"><output for="density" id="density-output">18</output></label><button class="small-button" data-lab-action="remix">Remix ${icon('reset')}</button></div>
        <div class="lab-footnote"><span id="seed-label">COMPOSITION 001</span><button class="text-button" data-lab-action="export-svg">Save SVG ${icon('download')}</button></div>
      </article>
      <article class="lab-card scada-lab">
        <div class="lab-top"><span class="eyebrow">02 / INDUSTRIAL INTERFACE</span><span class="lab-badge">SIMULATION ONLY</span></div>
        <div class="scada-stage">
          <div class="scada-title"><span class="small-dot"></span> WATER LEVEL STUDY <span id="pump-state">IDLE</span></div>
          <div class="scada-process"><div class="pump-unit"><span>P_001</span><div class="pump-symbol">${icon('sliders')}</div><b id="pump-value">OFF</b></div><div class="process-pipe"><i></i></div><div class="tank-unit"><span>LT_001</span><div class="tank-body"><div class="tank-water" id="tank-water" style="height:55%"></div><div class="tank-graduations"><i></i><i></i><i></i><i></i></div><strong id="tank-value">55<span>%</span></strong></div></div><div class="process-metrics"><div><span>LEVEL</span><b id="metric-level">55.0%</b></div><div><span>ALARM</span><b class="alarm-status" id="alarm-status">Normal</b></div></div></div>
          <div class="trend-header"><span>SIMULATED LEVEL TREND</span><span>0 - 100%</span></div><svg class="trend-svg" viewBox="0 0 480 62" role="img" aria-label="Trend of simulated tank level"><path d="M0 10H480M0 31H480M0 52H480" class="trend-grid"/><polyline id="trend-line" fill="none" stroke-width="2" points="0,29 480,29"/></svg>
        </div>
        <div class="lab-description"><h3>Making systems make sense.</h3><p>A small study in tags, trends, and visual feedback.</p></div>
        <div class="lab-controls"><button class="small-button pump-button" data-lab-action="pump" aria-pressed="false">${icon('play')} Start pump</button><label class="level-control" for="level-setpoint">Level <input id="level-setpoint" aria-label="Set simulated water level" type="range" min="0" max="100" value="55"></label><button class="icon-button" data-lab-action="reset-tank" aria-label="Reset tank simulation">${icon('reset')}</button></div>
        <div class="lab-footnote"><span>SYNTHETIC DATA. NO EQUIPMENT CONNECTED.</span></div>
      </article>
    </div>`;

  let seed = 1, density = 18, level = 55, pumpOn = false, visible = false, svgText = '';
  const history = Array.from({ length: 40 }, () => 55);
  const select = selector => root.querySelector(selector);
  function renderStudy() {
    const shapes = generateStudy(seed, density).map(item => {
      const transform = `translate(${item.x} ${item.y}) rotate(${item.rotation})`;
      if (item.type === 0) return `<rect transform="${transform}" x="${-item.size / 2}" y="${-item.size / 2}" width="${item.size}" height="${item.size}" rx="${item.size / 5}" fill="${item.color}"/>`;
      if (item.type === 1) return `<circle cx="${item.x}" cy="${item.y}" r="${item.size / 2}" fill="none" stroke="${item.color}" stroke-width="${item.size / 5}"/>`;
      return `<path transform="${transform}" d="M${-item.size / 2} ${item.size / 2}L0 ${-item.size / 2}L${item.size / 2} ${item.size / 2}Z" fill="${item.color}"/>`;
    }).join('');
    svgText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 350"><title>Generative study ${seed} by Jeba Shajida</title><rect width="580" height="350" fill="#e8ece1"/>${shapes}</svg>`;
    select('#vector-stage').innerHTML = svgText;
    select('#density-output').value = String(density);
    select('#seed-label').textContent = `COMPOSITION ${String(seed).padStart(3, '0')}`;
  }
  function renderTank(addSample = false) {
    level = clamp(level, 0, 100);
    if (addSample) { history.push(level); history.shift(); }
    select('#tank-water').style.height = `${level}%`;
    select('#tank-value').innerHTML = `${Math.round(level)}<span>%</span>`;
    select('#metric-level').textContent = `${level.toFixed(1)}%`;
    select('#level-setpoint').value = String(level);
    select('#pump-state').textContent = pumpOn ? 'PUMP RUNNING' : 'IDLE';
    select('#pump-value').textContent = pumpOn ? 'ON' : 'OFF';
    const alarm = alarmState(level), alarmElement = select('#alarm-status');
    alarmElement.textContent = alarm;
    alarmElement.classList.toggle('alarm-active', alarm !== 'Normal');
    select('.scada-stage').classList.toggle('pump-running', pumpOn);
    const button = select('[data-lab-action="pump"]');
    button.setAttribute('aria-pressed', String(pumpOn));
    button.innerHTML = `${icon(pumpOn ? 'pause' : 'play')} ${pumpOn ? 'Stop pump' : 'Start pump'}`;
    select('#trend-line').setAttribute('points', history.map((value, index) => `${(index / (history.length - 1) * 480).toFixed(1)},${(58 - value * .54).toFixed(1)}`).join(' '));
  }
  const downloads = new Set();
  root.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target) return;
    switch (target.dataset.labAction) {
      case 'remix': seed += 1; renderStudy(); break;
      case 'export-svg': {
        const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }));
        downloads.add(url);
        const link = document.createElement('a');
        link.href = url; link.download = `jeba-generative-study-${seed}.svg`;
        document.body.append(link); link.click(); link.remove();
        // Keep the URL alive long enough for browsers to start the download.
        const timer = setTimeout(() => { URL.revokeObjectURL(url); downloads.delete(url); downloadTimers.delete(timer); }, 1000);
        downloadTimers.add(timer); break;
      }
      case 'pump': pumpOn = !pumpOn; renderTank(); break;
      case 'reset-tank': level = 55; pumpOn = false; history.fill(55); renderTank(); break;
    }
  }, { signal });
  root.addEventListener('input', event => {
    if (event.target.id === 'density') { density = Number(event.target.value); renderStudy(); }
    if (event.target.id === 'level-setpoint') { level = Number(event.target.value); renderTank(true); }
  }, { signal });
  const downloadTimers = new Set();
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }); observer.observe(root);
  // No catch-up jumps: the synthetic clock stops offscreen or in a hidden tab.
  const timer = setInterval(() => {
    if (!visible || document.hidden || !pumpOn) return;
    level = nextTankLevel(level, true, .5); renderTank(true);
  }, 500);
  renderStudy(); renderTank();
  return () => {
    controller.abort(); clearInterval(timer); observer.disconnect();
    downloadTimers.forEach(id => clearTimeout(id)); downloads.forEach(url => URL.revokeObjectURL(url)); root.innerHTML = '';
  };
}
