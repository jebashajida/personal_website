# Jeba Shajida - Personal portfolio, v2.0

The actual working website, not a screenshot mockup. This edition adds the
approved programmer-avatar illustration, embeds `Jeba_Shajida_CV_Final.pdf`,
and aligns the profile, experience, skills, projects, and research with that
final CV. The original website's filters, dialogs, themes, navigation, SVG
playground, and simulated SCADA controls remain available.

## Start here

Install Node.js 22 or newer, extract this ZIP, and open **jeba-portfolio** in
VS Code. Open a terminal in the folder that contains `package.json`:

```powershell
npm run dev
```

Open `http://localhost:5173`. Stop the server with `Ctrl+C`.
**No npm install is required** for the standalone website: there are no
third-party runtime packages. Do not double-click `index.html`; use the
server so JavaScript modules and assets load correctly.

A busy port can be changed with `npm run dev -- --port 5174`.

## Replace an existing checkout safely

1. Back up your current portfolio folder or commit your local work first.
2. Copy the contents of this ZIP's `jeba-portfolio` folder into the existing
   repository root. Replace matching project files. Do not nest a second
   `jeba-portfolio` folder inside it. **Keep your existing `.git` folder.**
3. Include the supplied `.github/workflows/deploy.yml` and all files in
   `src/`, `scripts/`, `tests/`, and `public/`.
4. Run the checks below, then commit and push your changes.

```powershell
npm run check
npm test
npm run build
git status
git add .
git commit -m "Update portfolio avatar, final CV, experience and projects"
git push
```

Review `git status` before committing, especially if your existing repository
contains other material. This ZIP does not contain a `.git` directory and
cannot overwrite Git history by itself. Do not force-push.

## What changed

- Approved avatar and desktop-computer scene are the default hero artwork.
  Responsive, local WebP files are included; no image service is required.
- `My workspace / 3D study` switches between the illustrated avatar and the
  original interactive geometric sculpture. The avatar is a **static image
  with optional subtle CSS movement**, not an editable or rotatable 3D model.
  Wireframe and rotation controls belong only to the real WebGL study.
- Website headline: **Frontend developer & interactive 3D developer**,
  following the final CV. The approved artwork itself is used unchanged apart
  from format/size optimization and retains its previously approved label.
- Added Software Development Research Assistant, NGX Department, Ulterior
  Engineering, June-September 2026; and IT Department Intern, Bisorgo,
  February-May 2026. Descriptions follow the final CV.
- Added the HEKS Bangladesh web MIS dashboard to the selected projects.
  There are nine curated cards: five final-CV projects plus four GitHub
  studies/collections. The illustrative card previews are not screenshots
  from client systems or evidence of deployed products.
- Added a public-repository feed with refresh, load-more, offline fallback,
  request timeout, safe text rendering, and rate-limit messaging.
- Every resume download, including the no-JavaScript fallback, points to the
  final CV. The old URL `public/Jeba-Shajida-CV.pdf` is a compatibility copy
  containing the **same final PDF bytes**, not the previous resume.
- Preserved GitHub, LinkedIn, email, education, research, theme switching,
  project filters, detail dialogs, the SVG playground and SCADA-style demo.

## Check and build

```powershell
npm run check
npm test
npm run build
npm run preview
```

The production preview is `http://localhost:4173`. `npm run build` recreates
only `dist/`, containing static HTML, CSS, JavaScript and public assets.
A ready-built `dist/` is included in the ZIP; Git ignores it and GitHub
Actions rebuilds it from source.

## GitHub projects: what updates automatically

The featured project cards in `src/data.js` are deliberately curated. They
are based on the final CV and individually reviewed public repositories.
They do not silently change when unrelated repositories are added.

The separate **Currently on GitHub** panel loads a saved snapshot first. When
that panel approaches the viewport, it makes one best-effort public API
refresh. The Refresh button retries manually; successful results are cached
for 15 minutes in the browser session. No browser token or password is used.
Descriptions are displayed as text, never executed as HTML. Private and
forked repositories are excluded, and pagination is capped at 500 API rows
with an explicit partial-list status when needed. Six cards are shown at a
time; Show more reveals the remainder.

A **Website** button appears only if the repository metadata supplies a valid
HTTPS website URL. This is the repository's declared link, not proof that
its deployment was independently tested. Missing descriptions and URLs are
not invented. Notebook previews are not presented as running applications.

The included snapshot is an explicitly **partial reviewed selection**, not a
claim that all current repositories were fetched. The full live listing
could not be retrieved in the build environment. API success, offline, and
rate-limit behavior were tested with controlled fixtures.

To refresh the saved snapshot on your own computer:

```powershell
npm run sync:github
npm run build
```

GitHub Actions runs that same metadata refresh before deployment. If GitHub
is unavailable or rate-limited, the existing snapshot stays intact and the
website still builds. The workflow's built-in token is used only on the
runner; no credentials are written to public files. No scheduled job is
created by this package.

## Publish with GitHub Pages

This ZIP has **not** been pushed to your account or deployed from the chat.

For an existing repository, use the update instructions above. For a new
personal site, create an empty public repository named
`jebashajida.github.io` in the `jebashajida` account, then run in this folder:

```powershell
git init
git branch -M main
git add .
git commit -m "Add personal portfolio"
git remote add origin https://github.com/jebashajida/jebashajida.github.io.git
git push -u origin main
```

Complete GitHub's authentication prompt. Never put a password or token into
these files. In the GitHub repository, go to **Settings > Pages > Build and
deployment > Source > GitHub Actions**. The included workflow runs on pushes
to `main` and can also be run manually from the Actions tab. If an initial
run failed before Pages was enabled, run it again after enabling Pages.

After a successful deployment, find the actual published URL in
**Settings > Pages > Visit site**. For the repository name above, the expected
address is `https://jebashajida.github.io/`. This is an expected address, not
confirmation that the site is live. Relative paths also support a project
repository such as `https://jebashajida.github.io/jeba-portfolio/`.

If Pages is already configured, retain your existing domain settings and
any existing `CNAME` configuration; this package does not assign a domain.

## Main files

| File | Purpose |
| --- | --- |
| `src/data.js` | Profile, final-CV experience, curated projects, skills, education, research and social links |
| `src/site.js` | Page layout, dialogs, navigation and shared interactions |
| `src/styles.css` | Responsive layout, theme and avatar presentation |
| `src/hero.js` | Avatar/study switch and illustration motion |
| `src/scene.js` | Original geometric WebGL study |
| `src/github-model.js` | Public GitHub fetch, validation and pagination |
| `src/github-feed.js` | Repository panel, offline fallback, refresh and caching |
| `src/playground.js` | Generative SVG and simulated tank/pump study |
| `public/Jeba_Shajida_CV_Final.pdf` | Canonical final resume |
| `public/jeba-avatar-*.webp` | Approved avatar in responsive sizes |
| `public/github-projects.json` | Last saved public repository snapshot |
| `.github/workflows/deploy.yml` | GitHub Pages test/build/deploy pipeline |

The SCADA panel uses synthetic browser data only. It has no PLC connection,
physical I/O, real equipment controls, safety functions, or backend.

## Future content updates

Edit the arrays in `src/data.js`. Each curated project needs a unique `id`
and `number`, one of the categories `software`, `graphics`, or `ml`, a clear
description, and an honest `sourceNote`. Optional `github`, `preview`, and
`live` URLs appear only when nonempty and valid HTTPS links. To add a verified
app deployment, set that project's `live` field to the URL you tested.

When replacing the CV later, replace both PDF copies with the new PDF so old
links do not expose a stale resume. If renaming the canonical file, also
update `profile.resumeFile`, the no-JavaScript link in `index.html`, and the
relevant build/test expectations. Rebuild `dist/` before publishing.

## CV privacy

The final PDF includes your phone number and email as supplied. The page
itself lists only your email and city; the downloadable PDF will become
public when you publish the website. Review it before pushing.

Hiding a download button does not make an uploaded PDF private. To stop
publishing the CV, remove both public PDF copies, disable `showResume`, remove
the no-JavaScript link, and update the corresponding build/test requirements.
This edition does not include the original uploaded photograph; it includes
only the approved avatar illustration.

## Optional React adapter

The standalone site is ready to run. To reuse it inside an existing
Vite/React project, follow `integrations/react/README.md`. The adapter follows
the uploaded `main.jsx` StrictMode pattern. Browser tests cover the mount,
cleanup, and remount behavior, but a separate React/Vite application was not
installed or executed here. No change of framework is required to use this ZIP.

## Test evidence

See `TEST_REPORT.md` and `qa/browser-results.json`. The development/server
and content tests run with `npm test` and need no install. The optional
Python UI runner in `qa/browser_checks.py` needs Playwright and Chromium;
those testing tools are not website dependencies.
