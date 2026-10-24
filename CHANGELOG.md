# Changelog

All notable changes to this package. The format follows [Keep a Changelog](https://keepachangelog.com),
and versions follow [Semantic Versioning](https://semver.org).

## [0.1.0] - 2026-10-24

### Added

- `createTracker({ site, endpoint? })`: page views, time on page, scroll depth and custom events, without
  cookies or storage on the visitor's device.
- Single-page apps: a page view when the path changes (Navigation API, with a History API fallback).
- `dist/pal.js` for a script tag, with `data-site`, `data-endpoint` and a `pal()` queue for events sent
  before it loads. Under 1 KB gzipped.
