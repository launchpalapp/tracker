# Changelog

All notable changes to this package. The format follows [Keep a Changelog](https://keepachangelog.com),
and versions follow [Semantic Versioning](https://semver.org).

## [Unreleased]

## [0.2.0] - 2026-10-27

### Changed

- `key` replaces `site`: `init({ key })` and `data-key` name the app from LaunchPal, and LaunchPal
  stores events only from pages on that app's domain. `site` and `data-site` are gone.
- The domain check moved to LaunchPal's API: pages outside the app's domain (local development,
  previews) are dropped there instead of skipped in the browser. Automated browsers still send nothing.

## [0.1.0] - 2026-10-24

### Added

- `init({ site })` and `track(name)`: page views, time on page, scroll depth and custom events, without
  cookies or storage on the visitor's device.
- Counts the site, `www` and its subdomains; local development and previews on other domains send
  nothing.
- Single-page apps: a page view when the path changes (Navigation API, with a History API fallback).
- `dist/pal.js` for a script tag, with `data-site` (required) and a `pal()` queue for events sent
  before it loads. Under 1 KB gzipped.

[Unreleased]: https://github.com/launchpalapp/tracker/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/launchpalapp/tracker/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/launchpalapp/tracker/releases/tag/v0.1.0
