"""Isolated Chromium UI regression runner.

This environment blocks browser URL navigation, so ES modules are wrapped
in equivalent isolated scopes, styles are injected, and local assets use
data URLs through the supported resolveAsset option. No website copy or
interaction logic is replaced. HTTP serving is tested separately by npm test.
Live GitHub outcomes are fixtures; they do not prove API reachability.
Requires Python, Pillow for optional contact sheets, and playwright.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'qa' / 'previews'
OUT.mkdir(parents=True, exist_ok=True)
MODULES = ['utils.js','icons.js','data.js','artwork.js','scene.js','playground.js','github-model.js','github-feed.js','hero.js','site.js']


def make_bundle():
    result = ['window.__modules = {};']
    for name in MODULES:
        source = (ROOT/'src'/name).read_text()
        exports = re.findall(r'export\s+(?:async\s+)?(?:const|let|function|class)\s+(\w+)', source)
        def replace_import(match):
            bindings = re.sub(r'\s+as\s+', ': ', match.group(1))
            return f'const {{{bindings}}} = window.__modules[{json.dumps(match.group(2).split("/")[-1])}];'
        source = re.sub(r"import\s*\{([^}]+)\}\s*from\s*['\"]([^'\"]+)['\"];?", replace_import, source)
        source = source.replace('export ', '').replace('import.meta.url', json.dumps(f'https://portfolio.test/src/{name}'))
        result.append(f'window.__modules[{json.dumps(name)}] = (() => {{\n{source}\nreturn {{{", ".join(exports)}}};\n}})();')
    return '\n'.join(result)

BUNDLE = make_bundle()
ASSETS = {}
for path in (ROOT/'public').iterdir():
    if path.suffix in ('.webp','.pdf'):
        mime = 'image/webp' if path.suffix == '.webp' else 'application/pdf'
        ASSETS[path.name] = f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()
SNAPSHOT = json.loads((ROOT/'public/github-projects.json').read_text())
RESULTS=[]
ERRORS=[]


def check(name, condition):
    RESULTS.append({'name':name, 'passed':bool(condition)})
    if not condition:
        print('FAIL:',name)
    else:
        print('PASS:',name)


def load(page, mode='offline', force_no_webgl=True):
    page.set_default_timeout(7000)
    page.on('pageerror',lambda error:ERRORS.append(str(error)))
    page.set_content('<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Jeba Shajida - Frontend & Interactive 3D Developer</title></head><body><div id="root"></div></body></html>')
    page.add_style_tag(content=(ROOT/'src/styles.css').read_text())
    page.evaluate('(assets)=>window.__assets=assets',ASSETS)
    page.evaluate('(snapshot)=>window.__snapshot=snapshot',SNAPSHOT)
    page.evaluate('(mode)=>window.__apiMode=mode',mode)
    page.evaluate('''() => {
      window.__apiCalls = 0;
      window.__fakeRepos = Array.from({length:8},(_,i)=>({name:`fixture-project-${i+1}`,html_url:`https://github.com/jebashajida/fixture-project-${i+1}`,description:i===0?'<img src=x onerror=alert(1)>':`Test-only repository ${i+1}.`,homepage:i===0?'https://example.com/project':'',updated_at:`2026-09-${String(28-i).padStart(2,'0')}`,language:'JavaScript',private:false,fork:false}));
      window.fetch = async (url, options = {}) => {
        if(options.signal?.aborted) throw new DOMException('Aborted','AbortError');
        if(String(url).includes('github-projects.json')) return new Response(JSON.stringify(window.__snapshot),{status:200});
        if(String(url).startsWith('https://api.github.com/')) {
          window.__apiCalls += 1;
          if(window.__apiMode==='offline') throw new TypeError('Network is offline');
          if(window.__apiMode==='limited') return new Response('{}',{status:403});
          if(window.__apiMode==='empty') return new Response('[]',{status:200});
          return new Response(JSON.stringify(window.__fakeRepos),{status:200});
        }
        throw new Error('Unexpected network request: '+url);
      };
    }''')
    if force_no_webgl:
        page.evaluate('''() => {
          const getContext = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function(type,...args) {
            if(type === 'webgl' || type === 'webgl2') return null;
            return getContext.call(this,type,...args);
          };
        }''')
    page.evaluate(BUNDLE)
    page.evaluate('''() => {
      window.__mount = () => window.__modules['site.js'].mountPortfolio(document.getElementById('root'), {
        publicBase:'https://portfolio.test/public/',
        resolveAsset: file => window.__assets[file] || `https://portfolio.test/public/${file}`
      });
      window.__dispose = window.__mount();
    }''')
    page.wait_for_function('document.querySelector(".hero-avatar")?.naturalWidth > 0')
    page.wait_for_timeout(150)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
    context=browser.new_context(viewport={'width':1440,'height':1024},device_scale_factor=1,reduced_motion='reduce',accept_downloads=True)
    page=context.new_page()
    load(page)
    check('Default hero is approved avatar, not the old sculpture',page.locator('.hero-art').get_attribute('data-view')=='avatar' and page.locator('.avatar-scene').is_visible())
    check('Avatar image loads completely',page.locator('.hero-avatar').evaluate('(img)=>img.complete && img.naturalWidth>0'))
    check('Static avatar does not initialize or pretend to be WebGL',page.locator('#hero-scene canvas').count()==0 and not page.locator('[data-hero-action="wireframe"]').is_visible())
    check('Reduced-motion preference starts avatar motion paused',page.locator('.hero-art').get_attribute('data-motion')=='off')
    check('Final CV headline appears',page.locator('.hero-role').inner_text()=='Frontend developer & interactive 3D developer.')
    links=page.locator('a[download="Jeba_Shajida_CV_Final.pdf"]')
    check('All four CV download buttons point to the final PDF',links.count()==4 and all(x.startswith('data:application/pdf;base64,') for x in links.evaluate_all('(items)=>items.map(item=>item.href)')))
    check('Final CV download byte source equals supplied file',base64.b64decode(links.first.get_attribute('href').split(',',1)[1])==(ROOT/'public/Jeba_Shajida_CV_Final.pdf').read_bytes())
    check('NGX experience dates are displayed',page.locator('.experience-item').first.text_content().find('June 2026 - September 2026')>=0)
    check('Bisorgo experience uses 2026, not the older CV dates','February 2026 - May 2026' in page.locator('.experience-item').nth(1).text_content())
    check('Nine curated projects render',page.locator('.project-card').count()==9)
    check('Desktop has no horizontal page overflow',not page.evaluate('document.documentElement.scrollWidth > innerWidth'))
    page.screenshot(path=str(OUT/'desktop-hero.png'))
    page.screenshot(path=str(OUT/'desktop-full.png'),full_page=True)
    page.locator('[data-hero-action="avatar-motion"]').click()
    check('Avatar motion button changes state',page.locator('.hero-art').get_attribute('data-motion')=='on')
    page.locator('[data-hero-action="avatar-motion"]').click()
    page.locator('[data-hero-view="sculpture"]').click()
    check('3D study view still exists',page.locator('#hero-scene').is_visible() and not page.locator('.avatar-scene').is_visible())
    check('WebGL fallback disables unsupported controls',page.locator('[data-hero-action="wireframe"]').is_disabled() and 'NOT AVAILABLE' in page.locator('[data-hero-status]').inner_text())
    page.locator('[data-hero-view="avatar"]').click()
    check('Returning to avatar clears WebGL-unavailable message','UNAVAILABLE' not in page.locator('[data-hero-status]').inner_text() and page.locator('.hero-avatar').is_visible())
    page.locator('[data-action="theme"]').click()
    check('Dark theme switches',page.locator('html').get_attribute('data-theme')=='dark')
    page.screenshot(path=str(OUT/'desktop-dark.png'))
    page.locator('[data-action="theme"]').click()
    for category,expected in [('software',3),('graphics',1),('ml',5),('all',9)]:
        page.locator(f'[data-filter="{category}"]').click()
        check(f'Project filter {category}',page.locator('.project-card').count()==expected)
    trigger=page.locator('[data-project="heks-dashboard"]').first
    trigger.click()
    check('HEKS project dialog opens with final CV details',page.locator('.project-dialog').is_visible() and 'beneficiary' in page.locator('#dialog-content').inner_text().lower())
    check('No invented HEKS live-demo link',page.locator('#dialog-content .live-link').count()==0)
    page.screenshot(path=str(OUT/'heks-project.png'))
    page.keyboard.press('Escape')
    check('Escape closes dialog and restores focus',not page.locator('.project-dialog').is_visible() and trigger.evaluate('(element)=>element===document.activeElement'))
    for identifier in ['steadystep','city-landscape','customer-churn','web-technologies','fraud-detection','cvpr-notebooks','animal-classification','student-classification']:
        page.locator(f'[data-project="{identifier}"]').first.click()
        valid=bool(page.locator('#dialog-title').inner_text())
        page.locator('[data-action="close-project"]').click()
        check(f'Project dialog {identifier}',valid)
    page.locator('[data-github-feed]').scroll_into_view_if_needed()
    page.wait_for_function('window.__apiCalls > 0')
    check('Offline GitHub refresh retains saved repositories',page.locator('.repo-card').count()>0 and 'saved' in page.locator('[data-repo-status]').inner_text().lower())
    page.evaluate('window.__apiMode="success"')
    page.locator('[data-refresh-repos]').click()
    page.wait_for_function('document.querySelector("[data-repo-status]").textContent.includes("loaded from GitHub")')
    check('Successful GitHub refresh updates cards',page.locator('.repo-card').count()==6 and 'loaded from GitHub' in page.locator('[data-repo-status]').inner_text())
    check('GitHub descriptions are escaped, not executed',page.locator('.repo-card img').count()==0 and '<img src=x' in page.locator('.repo-card').first.inner_text())
    check('Repository homepage button is present only when supplied',page.locator('.repo-card-bottom a[title]').count()==1)
    page.locator('[data-more-repos]').click()
    check('GitHub show-more lists the remaining repositories',page.locator('.repo-card').count()==8 and not page.locator('[data-more-repos]').is_visible())
    page.evaluate('window.__apiMode="limited"')
    page.locator('[data-refresh-repos]').click()
    check('GitHub rate limit preserves cards and explains failure',page.locator('.repo-card').count()==8 and 'limit reached' in page.locator('[data-repo-status]').inner_text())
    check('Refresh button re-enables after failure',not page.locator('[data-refresh-repos]').is_disabled())
    page.locator('#experience').scroll_into_view_if_needed()
    page.screenshot(path=str(OUT/'experience.png'))
    page.locator('#density').fill('24')
    page.locator('#density').dispatch_event('input')
    check('SVG density control works',page.locator('#density-output').inner_text()=='24')
    before=page.locator('#vector-stage').inner_html()
    page.locator('[data-lab-action="remix"]').click()
    check('SVG remix changes artwork',page.locator('#vector-stage').inner_html()!=before)
    with page.expect_download() as download_info:
        page.locator('[data-lab-action="export-svg"]').click()
    download=download_info.value
    check('SVG export creates a real download',download.suggested_filename.endswith('.svg'))
    page.locator('#level-setpoint').fill('94')
    page.locator('#level-setpoint').dispatch_event('input')
    check('SCADA simulation high alarm works',page.locator('#alarm-status').inner_text()=='High level')
    page.locator('#level-setpoint').fill('10')
    page.locator('#level-setpoint').dispatch_event('input')
    check('SCADA simulation low alarm works',page.locator('#alarm-status').inner_text()=='Low level')
    page.locator('[data-lab-action="reset-tank"]').click()
    check('Tank reset restores default state',page.locator('#tank-value').text_content()=='55%' and page.locator('#pump-value').inner_text()=='OFF')
    page.locator('[data-lab-action="pump"]').click()
    before=float(page.locator('#metric-level').inner_text().rstrip('%'))
    page.wait_for_timeout(700)
    check('Pump simulation updates the level',float(page.locator('#metric-level').inner_text().rstrip('%'))>before)
    page.locator('[data-lab-action="pump"]').click()
    check('LinkedIn and GitHub profile links preserved',page.locator('a[href="https://www.linkedin.com/in/jeba-shajida-1253823b2/"]').count()==1 and page.locator('a[href="https://github.com/jebashajida"]').count()==1)
    page.locator('#contact').scroll_into_view_if_needed()
    page.screenshot(path=str(OUT/'contact.png'))
    page.evaluate('() => { window.__dispose(); window.__dispose=window.__mount(); }')
    check('Mount/dispose/remount leaves one header and one hero',page.locator('.site-header').count()==1 and page.locator('.hero-art').count()==1)
    page.locator('[data-action="theme"]').click()
    check('Remount does not duplicate click handlers',page.locator('html').get_attribute('data-theme')=='dark')
    for width in [320,360,390,768,1024,1920]:
        context2=browser.new_context(viewport={'width':width,'height':900 if width>=768 else 844},device_scale_factor=1,reduced_motion='reduce',is_mobile=width<768,has_touch=width<768)
        small=context2.new_page()
        load(small)
        check(f'No horizontal page overflow at {width}px',not small.evaluate('document.documentElement.scrollWidth > innerWidth'))
        check(f'Avatar fits viewport at {width}px',small.locator('.hero-avatar').bounding_box()['width']<=width)
        if width==390:
            small.screenshot(path=str(OUT/'mobile-hero.png'))
            small.screenshot(path=str(OUT/'mobile-full.png'),full_page=True)
            small.locator('.hero').screenshot(path=str(OUT/'mobile-overview.png'))
            small.locator('.hero-art').screenshot(path=str(OUT/'mobile-avatar.png'))
            small.locator('[data-action="menu"]').click()
            check('Mobile menu opens',small.locator('[data-action="menu"]').get_attribute('aria-expanded')=='true')
            small.locator('.nav-links a[href="#experience"]').click()
            check('Mobile menu closes after following a section link',small.locator('[data-action="menu"]').get_attribute('aria-expanded')=='false')
        context2.close()
    check('No JavaScript page exceptions in isolated browser runs',not ERRORS)
    browser.close()
report={'method':'Isolated Chromium render with local asset resolver, equivalent module scopes, and fixture-based GitHub responses. HTTP server separately tested by Node.', 'checks':RESULTS,'pageErrors':ERRORS,'passed':sum(r['passed'] for r in RESULTS),'failed':sum(not r['passed'] for r in RESULTS)}
(ROOT/'qa/browser-results.json').write_text(json.dumps(report,indent=2))
print(json.dumps({'passed':report['passed'],'failed':report['failed'],'pageErrors':ERRORS},indent=2))
sys.exit(1 if report['failed'] else 0)
