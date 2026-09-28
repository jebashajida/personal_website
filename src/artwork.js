import { icon } from './icons.js';

/** Original illustrative artwork, not screenshots of the CV projects. */
export function projectArtwork(type) {
  if (type === 'dashboard') return `
    <div class="dashboard-art" aria-hidden="true">
      <span class="art-label">CLARITY FOR WORK THAT MATTERS.</span>
      <div class="dashboard-window">
        <div class="dashboard-top"><span class="window-dots">&bull; &bull; &bull;</span><span>HEKS / MIS WORKSPACE</span><span class="dashboard-status">OVERVIEW</span></div>
        <div class="dashboard-body"><div class="dashboard-sidebar">${icon('sliders')}<i></i><i></i><i></i><i></i></div><div class="dashboard-content">
          <div class="dashboard-greeting"><span>A connected view.</span>${icon('pulse')}</div>
          <div class="dashboard-kpis"><div><span>Beneficiaries</span><b>Records</b><i></i></div><div><span>Activities</span><b>Tracking</b><i></i></div><div><span>Reporting</span><b>Insights</b><i></i></div></div>
          <div class="dashboard-panels"><div class="dashboard-bars"><span>Activity overview</span><div>${[35,54,40,75,60,92,68].map(h=>`<i style="height:${h}%"></i>`).join('')}</div></div><div class="dashboard-rows"><span>Beneficiary registry</span><i></i><i></i><i></i><i></i></div></div>
        </div></div>
      </div><span class="dashboard-caption">INTERFACE CONCEPT / NOT A PROJECT SCREENSHOT</span>
    </div>`;
  if (type === 'care') return `
    <div class="care-art" aria-hidden="true">
      <span class="art-orbit orbit-one"></span><span class="art-orbit orbit-two"></span>
      <div class="care-note">A little care.<br>A better every day.</div>
      <div class="care-window">
        <div class="care-top"><span class="care-logo">${icon('heart')} steadystep</span><span class="window-dots">&bull; &bull; &bull;</span></div>
        <p class="care-greeting">Good morning.</p><h4>Small steps.<br>Better days.</h4>
        <div class="care-widgets"><div><span class="care-mini-icon">${icon('pulse')}</span><b>Health overview</b><svg viewBox="0 0 160 30"><path d="M0 21h22l8-8 9 12 12-24 10 23 10-10 9 7h26l9-7 10 8h35" fill="none" stroke="currentColor" stroke-width="2"/></svg></div><div><span class="care-mini-icon orange">${icon('bell')}</span><b>Your reminders</b><span class="care-check">${icon('check')} One thing at a time</span></div></div>
        <div class="care-help">A helping hand, always nearby ${icon('heart')}</div>
      </div>
      <div class="care-float">${icon('heart')} Designed around people</div>
    </div>`;
  if (type === 'city') return `
    <div class="city-art" aria-hidden="true">
      <svg viewBox="0 0 580 330" class="city-svg">
        <circle cx="453" cy="68" r="31" fill="#eec276"/>
        <path d="M0 225 120 85 205 165 295 60 453 222 580 140V330H0Z" fill="#bccac6"/>
        <path d="m120 85 55 112-63-19-46 25Zm175-25 87 166-107-62-64 25Z" fill="#dfe6dc"/>
        <path d="M0 262 330 112 580 226v90L280 440Z" fill="#91ae96"/>
        <path d="m30 260 290-133 215 100-289 138Z" fill="#d6d9c6"/>
        <path d="m30 277 290-133 215 100-289 138Z" fill="#ced1be"/>
        <path d="m140 235 51-24 213 99-49 24Z" fill="#788c83"/>
        <path d="m154 229 226 104" stroke="#f7f4e4" stroke-width="2" stroke-dasharray="13 13"/>
        <path d="m84 238 38-18 38 18-38 18Z" fill="#426d5b"/>
        <path d="m122 256 38-18v-75l-38 18Z" fill="#7d9d89"/><path d="m84 238 38 18v-75l-38-18Z" fill="#a9bd9e"/><path d="m84 163 38-18 38 18-38 18Z" fill="#e4e9d6"/>
        <path d="m88 184 29 14m-29-2 29 14m-29-2 29 14" stroke="#e7ecd9" stroke-width="5"/>
        <path d="m246 214 54-25v-108l-54 25Z" fill="#dda98a"/><path d="m197 191 49 23V106l-49-23Z" fill="#efcbb0"/><path d="m197 83 49-23 54 21-54 25Z" fill="#f7e5c7"/>
        <path d="m207 109 28 13m-28 9 28 13m-28 9 28 13m-28 9 28 13m22-68 31-14m-31 36 31-14m-31 36 31-14m-31 36 31-14" stroke="#ffffed" stroke-width="6"/>
        <path d="m374 262 55-26v-72l-55 26Z" fill="#718c76"/><path d="m327 240 47 22v-72l-47-22Z" fill="#a7b29b"/><path d="m327 168 47-23 55 19-55 26Z" fill="#edf0db"/>
        <path d="m338 187 25 12m-25 6 25 12m-25 6 25 12m22-34 31-14m-31 32 31-14m-31 32 31-14" stroke="#d8e0c6" stroke-width="5"/>
        <g class="city-car"><path d="m214 267 18-8 25 12-18 9Z" fill="#f0aa76"/><path d="m214 267 25 13v11l-25-12Z" fill="#c7805a"/><path d="m239 280 18-9v11l-18 9Z" fill="#e8c48f"/></g>
        <g fill="#446d58"><path d="m170 305 14-38 14 38Z"/><path d="m312 236 13-35 13 35Z"/><path d="m462 233 16-44 16 44Z"/></g>
        <g stroke="#526949" stroke-width="3"><path d="M184 304v16m141-85v14m153-16v16"/></g>
        <g class="city-cloud" fill="#f7f8ee"><rect x="62" y="58" width="77" height="15" rx="8"/><circle cx="88" cy="57" r="15"/><circle cx="110" cy="57" r="21"/></g>
      </svg><span class="art-caption">A WORLD IN MOTION</span>
    </div>`;
  if (type === 'web') return `
    <div class="web-art" aria-hidden="true"><span class="art-label">FROM INTERFACE TO IMPLEMENTATION</span>
      <div class="web-window"><div class="web-top"><span class="window-dots">&bull; &bull; &bull;</span><span>localhost / ideas</span>${icon('code')}</div>
      <div class="web-body"><div class="web-sidebar"><span class="web-logo">&lt;/&gt;</span><i></i><i></i><i></i></div><div class="web-editor"><span class="code-comment">// one idea, many possibilities</span><p><span>function</span> buildSomething() {</p><p>&nbsp; <span>return</span> {</p><p>&nbsp;&nbsp; curiosity: <b>true</b>,</p><p>&nbsp;&nbsp; medium: <em>"the web"</em></p><p>&nbsp; };</p><p>}</p><div class="code-terminal"><span>&gt;</span> ready to create<span class="terminal-cursor">_</span></div></div></div></div>
      <span class="code-pill">PHP &nbsp; / &nbsp; WEB TECHNOLOGIES</span>
    </div>`;
  if (type === 'churn') return `
    <div class="churn-art" aria-hidden="true"><span class="art-label">DATA TELLS A STORY.</span><div class="analytics-window"><div class="analytics-top"><span>${icon('pulse')} Customer patterns</span><span>EXPLORATION</span></div><h4>The shape of change.</h4><div class="analytics-chart">${[29,44,35,64,52,78,67,91,84,110,99,125].map((h,i)=>`<span style="height:${h}px;--bar:${i}"></span>`).join('')}</div><div class="analytics-axis"><span>HISTORICAL DATA</span><span>PATTERN DISCOVERY</span></div></div><span class="chart-footnote">Concept illustration &middot; not model results</span></div>`;
  if (type === 'fraud') return `
    <div class="fraud-art" aria-hidden="true"><span class="art-label">NOTICE WHAT DOESN'T BELONG.</span><div class="scatter-plot">${Array.from({length:46},(_,i)=>`<span style="left:${18+((i*37)%58)}%;top:${28+((i*23)%52)}%;width:${5+i%4}px;height:${5+i%4}px"></span>`).join('')}<i class="anomaly-point"></i><div class="anomaly-label">Outside the pattern ${icon('diagonal')}</div><div class="scatter-line"></div></div><div class="scatter-legend"><span><i></i> The expected</span><span><i></i> The unusual</span></div></div>`;
  if (type === 'vision') return `
    <div class="vision-art" aria-hidden="true"><span class="art-label">A DIFFERENT WAY TO SEE.</span><div class="vision-grid">${Array.from({length:49},(_,i)=>`<i style="opacity:${.15+((i*13)%10)/12}"></i>`).join('')}<span class="vision-frame">${icon('cube')}<b>pattern found</b></span></div><span class="vision-code">input &rarr; explore &rarr; understand</span></div>`;
  if (type === 'animals') return `
    <div class="animal-art" aria-hidden="true">
      <span class="art-label">INPUT &rarr; FEATURES &rarr; CLASSIFICATION</span>
      <div class="animal-cards">
        <div class="animal-card"><svg viewBox="0 0 100 100"><path d="m24 43-2-25 24 15h10l24-15-2 29c23 47-72 47-54-4Z" fill="#e8c4a0"/><path d="m30 38-1-9 10 7m23 0 10-7-1 9" fill="#c98f7a"/><ellipse cx="50" cy="64" rx="18" ry="12" fill="#f7e5c7"/><path d="m45 58 5 5 5-5" fill="#3d4033"/><path d="M34 49h4m24 0h4M50 63v4m-3 1h6M29 61l-13-3m13 9-14 2m55-8 13-3m-13 9 14 2" stroke="#394b3d" stroke-width="2.5" stroke-linecap="round"/></svg><b>Cat</b><span>Image class</span></div>
        <div class="animal-card featured"><svg viewBox="0 0 100 100"><path d="M27 38c-30 34-14-33 5-9M73 38c30 34 14-33-5-9" fill="#8b6552"/><ellipse cx="50" cy="51" rx="29" ry="31" fill="#d5b38b"/><ellipse cx="50" cy="66" rx="16" ry="12" fill="#f0dcc0"/><path d="m43 59 7 8 7-8Z" fill="#344139"/><circle cx="38" cy="46" r="3" fill="#344139"/><circle cx="62" cy="46" r="3" fill="#344139"/><path d="M50 67v8m-5 0h10" stroke="#344139" stroke-width="2.5" stroke-linecap="round"/></svg><b>Dog</b><span>Image class</span></div>
        <div class="animal-card"><svg viewBox="0 0 100 100"><circle cx="25" cy="26" r="12" fill="#35483c"/><circle cx="75" cy="26" r="12" fill="#35483c"/><ellipse cx="50" cy="52" rx="34" ry="31" fill="#f3f4e9"/><ellipse cx="34" cy="48" rx="10" ry="13" transform="rotate(25 34 48)" fill="#35483c"/><ellipse cx="66" cy="48" rx="10" ry="13" transform="rotate(-25 66 48)" fill="#35483c"/><circle cx="36" cy="46" r="3" fill="#f3f4e9"/><circle cx="64" cy="46" r="3" fill="#f3f4e9"/><path d="m44 64 6 5 6-5Z" fill="#35483c"/><path d="M50 68v5m-5 0h10" stroke="#35483c" stroke-width="2.5" stroke-linecap="round"/></svg><b>Panda</b><span>Image class</span></div>
      </div><span class="classification-pill"><span class="small-dot"></span> k-nearest neighbors</span>
    </div>`;
  return `
    <div class="network-art" aria-hidden="true">
      <span class="art-label">PATTERNS BECOME POSSIBILITIES.</span>
      <svg class="network-svg" viewBox="0 0 580 255">
        <g stroke="#85a297" stroke-width="1" opacity=".52">${[75, 135, 195].flatMap(y => [50, 105, 160, 215].map(y2 => `<path d="M95 ${y} 230 ${y2}"/>`)).join('')}${[50, 105, 160, 215].flatMap(y => [50, 105, 160, 215].map(y2 => `<path d="M230 ${y} 355 ${y2}"/>`)).join('')}${[50, 105, 160, 215].flatMap(y => [105, 165].map(y2 => `<path d="M355 ${y} 490 ${y2}"/>`)).join('')}</g>
        <g fill="#bcd5ab" stroke="#d5e6c6" stroke-width="2">${[75, 135, 195].map(y => `<circle cx="95" cy="${y}" r="15"/>`).join('')}</g>
        <g fill="#74988b" stroke="#adc8b2" stroke-width="2">${[230,355].flatMap(x=>[50,105,160,215].map(y=>`<circle cx="${x}" cy="${y}" r="15"/>`)).join('')}</g>
        <g fill="#ecc392" stroke="#f4deba" stroke-width="2"><circle cx="490" cy="105" r="17"/><circle cx="490" cy="165" r="17"/></g>
      </svg><div class="network-labels"><span>INPUT</span><span>HIDDEN LAYERS</span><span>OUTPUT</span></div>
    </div>`;
}
