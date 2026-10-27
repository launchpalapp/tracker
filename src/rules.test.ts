import { describe, expect, it } from 'vitest';
import { isNewPage, scrollPercent } from './rules';

describe('scrollPercent', () => {
  it('counts the bottom of the screen against the page height', () => {
    expect(scrollPercent({ top: 0, viewport: 800, height: 4000 })).toBe(20);
    expect(scrollPercent({ top: 3200, viewport: 800, height: 4000 })).toBe(100);
  });

  it('treats a page shorter than the screen as fully read', () => {
    expect(scrollPercent({ top: 0, viewport: 800, height: 600 })).toBe(100);
  });
});

describe('isNewPage', () => {
  it('is a new page only when the path changes', () => {
    expect(isNewPage('https://bloomly.example/a', 'https://bloomly.example/b')).toBe(true);
    expect(isNewPage('https://bloomly.example/a', 'https://bloomly.example/a?tab=2')).toBe(false);
    expect(isNewPage('https://bloomly.example/a', 'https://bloomly.example/a#plans')).toBe(false);
  });
});
