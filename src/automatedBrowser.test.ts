// @vitest-environment happy-dom
// @vitest-environment-options {"url": "https://bloomly.example/"}
import { describe, expect, it, vi } from 'vitest';
import { init, track } from './index';

describe('init in an automated browser', () => {
  it('sends nothing, and custom events do nothing', () => {
    const send = vi.fn(
      async (_url: string, _init: RequestInit) => new Response(null, { status: 202 }),
    );

    vi.stubGlobal('fetch', send);
    Object.defineProperty(navigator, 'webdriver', { value: true, configurable: true });
    init({ key: '3f9c2a71b8d04e65' });
    track('signed_up');

    expect(send).not.toHaveBeenCalled();
  });
});
