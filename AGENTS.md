# Working on the LaunchPal tracker

Rules for anyone changing this package, people and coding agents alike. `README.md` explains what it
does for users.

## Scope

- No runtime dependencies. The script tag file (`dist/pal.js`) stays under 1 KB gzipped;
  `src/size.test.ts` enforces it.
- Nothing on the visitor's device: no cookies, local or session storage, IndexedDB or
  fingerprinting. The script never sends an identifier; the server makes the daily visitor hash.
- Events go with `fetch` (`keepalive`, `mode: 'cors'`) as a `text/plain` JSON string, so they need no
  CORS preflight, survive the page closing and always carry the page's real `Origin` (in `no-cors`
  mode a `no-referrer` policy turns it into `null`). The API answers `Access-Control-Allow-Origin: *`.
  Never `sendBeacon`: EasyPrivacy blocks every cross-site beacon (`$ping,3p`), which would drop events
  on founders' sites.
- Track the configured site, `www` and its subdomains (`isOnSite`), never other domains or automated
  browsers (`navigator.webdriver`), so local development and builder previews send nothing. The API
  applies the same rule and stores each event's host.
- `init({ site })` starts the one tracker a page has and ignores later calls; `track(name)` sends a
  custom event through it and does nothing before `init`. That single tracker is the module's only
  state. `site` is required everywhere: the script tag sends nothing without `data-site`.
- Single-page apps: a page view when the path changes, through the Navigation API's
  `currententrychange`, falling back to wrapping `pushState`/`replaceState` plus `popstate`. Time on
  page is sent each time the tab hides or the page changes, so reports add it up per visitor and page.
- Custom event names are free text, chosen by each site, up to 64 characters (enforced by the API).
  Events carry only their name: no properties until founders need them (then with a guard against
  personal data). Which events count as goals is decided in LaunchPal, never in the script.

## Code

- TypeScript strict, ES modules, ES2022 output. Braces on every block, `const` only, no mutation
  outside the tracker's own state.
- Names explain the code. A comment is one line and only for a non-obvious gotcha. The exported
  API (`init`, its options and `track`) has short TSDoc comments for editors; nothing
  else does.
- Pure rules live in `src/rules.ts` with tests in `src/rules.test.ts`.
- Browser behaviour is tested in happy-dom, one scenario per file: listeners and history wrapping
  can't be undone, so trackers must not share a file. happy-dom reports `navigator.webdriver` as
  true, so tests set it to false.
- Prettier formats everything (`npx prettier --check .`); ESLint (`npm run lint`) must pass with no
  warnings.

## Build and release

- `npm run dev` rebuilds `dist/index.js` on every change. `npm run build`: `dist/index.js` (ES module) with `dist/index.d.ts`, and `dist/pal.js` (minified
  script tag that reads `data-site` (required) and `data-endpoint` and replays queued `pal()` calls).
- `npm test` builds first, then runs every test including the size limit. `npm run check:package`
  runs publint and arethetypeswrong (ESM-only profile).
- `.github/workflows/check.yml` runs all checks on every branch and pull request. `release.yml` runs
  on a `v*` tag: the tag must equal `package.json`'s version, then `npm publish` through npm trusted
  publishing (GitHub OIDC, no stored token, provenance added) and a GitHub release with `pal.js`.
- Semantic versioning. Every release gets a `CHANGELOG.md` entry first, then the version bump, then
  the tag.
- Actions are pinned by commit SHA with the version in a comment, checkouts don't keep credentials,
  and the release job uses no cache. `zizmor --persona=pedantic .github` reports no findings.
