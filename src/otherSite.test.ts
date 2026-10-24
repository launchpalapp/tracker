// @vitest-environment happy-dom
// @vitest-environment-options {"url": "http://localhost:4321/"}
import { describe, expect, it, vi } from 'vitest';
import { init, track } from './index';

describe('init on another host', () => {
  it('sends nothing, and custom events do nothing', () => {
    const send = vi.fn(
      async (_url: string, _init: RequestInit) => new Response(null, { status: 202 }),
    );

    vi.stubGlobal('fetch', send);
    Object.defineProperty(navigator, 'webdriver', { value: false, configurable: true });
    init({ site: 'bloomly.example' });
    track('signed_up');

    expect(send).not.toHaveBeenCalled();
  });
});
