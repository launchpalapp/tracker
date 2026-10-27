// @vitest-environment happy-dom
// @vitest-environment-options {"url": "https://www.bloomly.example/"}
import { describe, expect, it, vi } from 'vitest';

describe('the script tag', () => {
  it('tracks the app in data-key, sends events queued before it loaded and takes new ones', async () => {
    const send = vi.fn(
      async (_url: string, _init: RequestInit) => new Response(null, { status: 202 }),
    );

    vi.stubGlobal('fetch', send);
    Object.defineProperty(navigator, 'webdriver', { value: false, configurable: true });
    const tag = document.createElement('script');

    tag.dataset.key = '3f9c2a71b8d04e65';
    Object.defineProperty(document, 'currentScript', { value: tag, configurable: true });
    window.pal = Object.assign(() => undefined, {
      q: [['signed_up']] as [string][],
    });

    await import('./script');
    window.pal('upgraded');

    const events = send.mock.calls.map(([, init]) => JSON.parse(String(init.body)));

    expect(send.mock.calls.map(([url]) => url)).toEqual(
      Array(3).fill('https://api.launchpal.app/v1/collect'),
    );
    expect(events.map((event) => [event.key, event.type, event.name])).toEqual([
      ['3f9c2a71b8d04e65', 'PAGEVIEW', undefined],
      ['3f9c2a71b8d04e65', 'CUSTOM', 'signed_up'],
      ['3f9c2a71b8d04e65', 'CUSTOM', 'upgraded'],
    ]);
  });
});
