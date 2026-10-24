import { describe, expect, it } from 'vitest';
import { bareHostname, isNewPage, isOnSite, scrollPercent, shouldTrack } from './rules';

describe('isOnSite', () => {
  it('counts the site, www and its subdomains', () => {
    expect(isOnSite('bloomly.example', 'bloomly.example')).toBe(true);
    expect(isOnSite('www.bloomly.example', 'bloomly.example')).toBe(true);
    expect(isOnSite('app.bloomly.example', 'bloomly.example')).toBe(true);
  });

  it('leaves out other domains, including look-alikes and builder previews', () => {
    expect(isOnSite('evilbloomly.example', 'bloomly.example')).toBe(false);
    expect(isOnSite('bloomly.example.evil.example', 'bloomly.example')).toBe(false);
    expect(isOnSite('preview--bloomly.lovable.app', 'bloomly.lovable.app')).toBe(false);
  });
});

describe('shouldTrack', () => {
  it('tracks the site itself, with or without www', () => {
    expect(shouldTrack({ hostname: 'bloomly.example', webdriver: false }, 'bloomly.example')).toBe(
      true,
    );
    expect(
      shouldTrack({ hostname: 'www.bloomly.example', webdriver: false }, 'bloomly.example'),
    ).toBe(true);
  });

  it('skips local development, previews and automated browsers', () => {
    expect(shouldTrack({ hostname: 'localhost', webdriver: false }, 'bloomly.example')).toBe(false);
    expect(
      shouldTrack({ hostname: 'bloomly.lovable.app', webdriver: false }, 'bloomly.example'),
    ).toBe(false);
    expect(shouldTrack({ hostname: 'bloomly.example', webdriver: true }, 'bloomly.example')).toBe(
      false,
    );
  });
});

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

describe('bareHostname', () => {
  it('drops a leading www only', () => {
    expect(bareHostname('www.bloomly.example')).toBe('bloomly.example');
    expect(bareHostname('app.bloomly.example')).toBe('app.bloomly.example');
  });
});
