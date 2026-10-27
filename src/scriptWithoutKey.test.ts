// @vitest-environment happy-dom
// @vitest-environment-options {"url": "https://bloomly.example/"}
import { describe, expect, it, vi } from 'vitest';

describe('the script tag without data-key or data-site', () => {
  it('sends nothing and tells the developer what is missing', async () => {
    const send = vi.fn(
      async (_url: string, _init: RequestInit) => new Response(null, { status: 202 }),
    );
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    vi.stubGlobal('fetch', send);
    Object.defineProperty(navigator, 'webdriver', { value: false, configurable: true });

    await import('./script');
    window.pal?.('signed_up');

    expect(send).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('data-key'));
  });
});
