// @vitest-environment happy-dom
// @vitest-environment-options {"url": "https://bloomly.example/"}
import { describe, expect, it, vi } from 'vitest';
import { init, isOptedOut, optIn, optOut, track } from './index';

describe('a visitor who opts out', () => {
  it('sends nothing from then on, on this visit and the next, until they opt back in', () => {
    const send = vi.fn(
      async (_url: string, _init: RequestInit) => new Response(null, { status: 202 }),
    );

    vi.stubGlobal('fetch', send);
    Object.defineProperty(navigator, 'webdriver', { value: false, configurable: true });
    init({ key: '3f9c2a71b8d04e65' });
    send.mockClear();

    optOut();
    track('signed_up');

    expect(isOptedOut()).toBe(true);
    expect(localStorage.getItem('pal_optout')).toBe('1');
    expect(send).not.toHaveBeenCalled();

    optIn();
    track('upgraded');

    expect(isOptedOut()).toBe(false);
    expect(localStorage.length).toBe(0);
    expect(send).toHaveBeenCalledOnce();
  });
});
