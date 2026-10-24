# Contributing

Thanks for helping. Issues and pull requests are welcome.

- Open an issue first for anything bigger than a small fix, so we can agree on the approach.
- Keep the script small and dependency-free. `npm test` fails if `dist/pal.js` reaches 1 KB gzipped.
- Nothing may be stored on the visitor's device and no identifier may be sent. Privacy is the point
  of this package.
- Before opening a pull request, run `npm test`, `npm run lint`, `npx prettier --check .` and
  `npm run check:package`.
- Add a line to `CHANGELOG.md` under an "Unreleased" heading for any change users would notice.

Security issues: see [SECURITY.md](SECURITY.md), not public issues.
