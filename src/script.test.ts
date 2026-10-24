// @vitest-environment happy-dom
// @vitest-environment-options {"url": "https://www.bloomly.example/"}
import { describe, expect, it, vi } from 'vitest';

describe('the script tag', () => {
  it('tracks its own site, sends events queued before it loaded and takes new ones', async () => {
    const send = vi.fn(
      async (_url: string, _init: RequestInit) => new Response(null, { status: 202 }),
    );

    vi.stubGlobal('fetch', send);
    Object.defineProperty(navigator, 'webdriver', { value: false, configurable: true });
    window.pal = Object.assign(() => undefined, {
      q: [['signed_up']] as [string][],
    });

    await import('./script');
    window.pal('upgraded');

    const events = send.mock.calls.map(([, init]) => JSON.parse(String(init.body)));

    expect(send.mock.calls.map(([url]) => url)).toEqual(
      Array(3).fill('https://api.launchpal.app/v1/collect'),
    );
    expect(events.map((event) => [event.site, event.type, event.name])).toEqual([
      ['bloomly.example', 'PAGEVIEW', undefined],
      ['bloomly.example', 'CUSTOM', 'signed_up'],
      ['bloomly.example', 'CUSTOM', 'upgraded'],
    ]);
  });
});
