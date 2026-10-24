# LaunchPal tracker

[![Check](https://github.com/launchpalapp/tracker/actions/workflows/check.yml/badge.svg)](https://github.com/launchpalapp/tracker/actions/workflows/check.yml)
[![MIT licence](https://img.shields.io/badge/licence-MIT-blue)](LICENSE)

The privacy-friendly analytics script behind [LaunchPal](https://launchpal.app): page views, where
visitors came from, time on page, scroll depth and the events you name. Under 1 KB gzipped, no
dependencies.

- Nothing is stored on the visitor's device: no cookies, local storage or fingerprinting
- No IP addresses or identities are kept. The server counts visitors with a code made from a secret
  that is replaced and deleted every day, so visits can't be linked across days or sites
- Works on multi-page sites and single-page apps
- Counts your site, `www` and its subdomains (each event records its host); sends nothing from
  automated browsers, local development or previews on other domains, and the server drops known bots

Events go to LaunchPal's API, hosted in the EU. They are stored only for sites added in LaunchPal.
Accounts are opening soon. Until then, the API accepts LaunchPal's own site only.

## Install

```bash
npm install @launchpal/tracker
```

```ts
import { init, track } from '@launchpal/tracker';

init({ site: 'bloomly.example' });

track('signed_up');
```

Call `init` once, when your app starts in the browser. After that, call `track` from anywhere.

`site` is required: your domain without `www`, like `bloomly.example`. Its subdomains count too, like
`app.bloomly.example`. Nothing is sent on the server, before `init`, or on other domains, so local
development and builder previews stay out of your numbers.

## Script tag

```html
<script
  defer
  data-site="bloomly.example"
  src="https://cdn.jsdelivr.net/npm/@launchpal/tracker@0/dist/pal.js"
></script>
```

`data-site` is required, as `site` is above. Record an event anywhere with `pal('signed_up')`.

If your page may call `pal()` before the script has loaded, add this line above the tag, so those
calls are kept and sent once it loads:

<!-- prettier-ignore -->
```html
<script>window.pal = window.pal || function () { (window.pal.q = window.pal.q || []).push(arguments) }</script>
```

## What it sends

| event        | when                                                    | details                            |
| ------------ | ------------------------------------------------------- | ---------------------------------- |
| page view    | on load, and when the path changes in a single-page app | page address, referrer             |
| time on page | when the tab is hidden, the page changes or it's closed | visible seconds, furthest scroll % |
| custom event | when you call `track` or `pal`                          | its name, up to 64 characters      |

Events are sent with `fetch` and `keepalive`, so they arrive even when the page is closing. Custom events
carry only their name, so no personal data can travel with them. You'll choose which events count as
your goals in LaunchPal.

## Browsers

Current versions of Chrome, Edge, Firefox and Safari. The code is built for ES2022. Single-page app
navigation uses the Navigation API where the browser has it, and falls back to History API changes.

## Development

```bash
npm install
npm test               # builds, then runs the tests, including the 1 KB size limit
npm run lint
npm run check:package  # publint and arethetypeswrong
```

See [CONTRIBUTING.md](CONTRIBUTING.md), [CHANGELOG.md](CHANGELOG.md), [SECURITY.md](SECURITY.md) and
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Licence

MIT, see [LICENSE](LICENSE).
