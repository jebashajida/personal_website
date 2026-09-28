# Final-CV portfolio v2.0 - Test report

Test date: 2026-09-28. This report replaces the earlier v1 test report.

## Results

| Check | Result |
| --- | --- |
| JavaScript syntax (`npm run check`) | PASS: 18 modules |
| Automated content, utility, GitHub-model and HTTP-server tests (`npm test`) | PASS: 31 tests |
| Production static build (`npm run build`) | PASS |
| Isolated Chromium interface tests | PASS: 63 checks; zero JavaScript page exceptions |
| Final CV source/copy byte comparison | PASS |
| Public repository refresh in this environment | Unavailable: network fetch failed; saved selection kept |
| Real WebGL context probe | Unavailable in the browser environment; static fallback tested |

The local Node runtime used for these tests was v22.16.0.

## Exact CV included

Uploaded source: `Jeba_Shajida_CV_Final.pdf` (two pages).

SHA-256:
`52a91240ca900a7a1a3f01b4e29749056bd06a4adc4a067b36a05e388967f989`

The canonical public file and the old-name compatibility file have identical
bytes to this source. Both production copies in `dist/public/` were checked
against the source. The PDF was not edited, flattened, or re-exported.
All four JavaScript-rendered CV links use the canonical final filename; the
no-JavaScript link uses that same file. The HTTP tests check the PDF MIME type
and paths from both root and project-subdirectory hosting.

## Coverage

- Avatar loads as a local image, with responsive sources and an accurate alt
  description. The default hero creates no WebGL context.
- Avatar motion toggle, reduced-motion default, and transition into/out of
  the separate 3D study view.
- Unavailable WebGL controls are disabled; the unavailable message does not
  leak into avatar mode after switching back.
- Final-CV headline, NGX and Bisorgo dates, nine curated project cards, and
  the added HEKS dashboard description.
- Software, graphics, machine-learning, and all-project filters.
- Every project dialog, keyboard dismissal and focus restoration.
- Light/dark switch and mobile navigation behavior.
- Page width and avatar bounds at 320, 360, 390, 768, 1024, 1440 and 1920 px.
- Preserved GitHub/LinkedIn links; real SVG download from the playground.
- Density and remix controls; synthetic tank high/low alarms, reset, and
  pump-driven level changes.
- Complete mount, cleanup and remount without duplicate UI or click handlers.
- Repository normalizing, pagination, explicit pagination-cap status,
  HTTPS links without embedded credentials, escaped descriptions, load-more,
  offline retention, rate-limit messaging, and button recovery after failure.
- HTTP serving and content types for the final PDF, WebP artwork and JSON;
  denial of source-control files, development files and path traversal.

## Browser test method and limits

Browser navigation to local/network URLs is blocked by the environment.
The UI checks therefore run in an isolated Chromium document. ES-module
imports are converted to equivalent scoped bindings by the test harness;
actual source functions, styles and event handlers are used. Local artwork
and PDF bytes are supplied through the application's supported `resolveAsset`
embedding option. The server is tested separately through Node HTTP requests.

GitHub success, empty/error and rate-limit paths use controlled metadata
fixtures. This does not prove that a real GitHub response will be available
from every visitor's connection. The real build-time refresh was attempted
and failed because of the environment network; its fallback kept the reviewed
selection intact. See `SOURCES.md` for what was actually reviewed online.

The original geometric scene remains in the source. The environment did not
provide a working WebGL context, so GPU rendering was not verified. It was
not reported as a passing render. The approved avatar and the rest of the
website do not require WebGL.

The optional React adapter was not run as a separate React/Vite application.
Core mount/cleanup behavior was tested, but that is not a substitute for a
React integration test. Actual GitHub Pages deployment, live project websites,
and native Safari/Firefox/Windows rendering were not tested here.

## Evidence and reproduction

- `qa/browser-results.json`: individual browser checks and outcomes.
- `qa/browser_checks.py`: optional isolated test runner (requires Python,
  Playwright and Chromium; not needed to run the website).
- `qa/webgl-probe.json`: actual context-probe result.
- `qa/previews/`: screenshots rendered from website code, not generated mockups.
- `npm run check`, `npm test`, `npm run build`: dependency-free core checks.

No claim is made that every possible browser, device, deployment or external
service has been tested, or that the website has already been published.
