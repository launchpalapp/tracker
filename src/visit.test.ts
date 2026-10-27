// @vitest-environment happy-dom
// @vitest-environment-options {"url": "https://bloomly.example/pricing?utm_source=reddit"}
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { init, track } from './index';

const ENDPOINT = 'https://collect.example/v1/collect';
const send = vi.fn(async (_url: string, _init: RequestInit) => new Response(null, { status: 202 }));

const sentEvents = () => send.mock.calls.map(([, init]) => JSON.parse(String(init.body)));

const setPage = (values: { scrollY?: number; scrollHeight?: number; visibility?: string }) => {
  Object.defineProperty(window, 'scrollY', { value: values.scrollY ?? 0, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: values.scrollHeight ?? 4000,
    configurable: true,
  });
  Object.defineProperty(document, 'visibilityState', {
    value: values.visibility ?? 'visible',
    configurable: true,
  });
};

describe('init and track', () => {
  beforeEach(() => {
    send.mockClear();
  });

  it('follows one visit from landing to leaving', async () => {
    vi.stubGlobal('fetch', send);
    Object.defineProperty(navigator, 'webdriver', { value: false, configurable: true });
    Object.defineProperty(document, 'referrer', {
      value: 'https://www.reddit.com/r/plants',
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    setPage({});
    vi.spyOn(performance, 'now').mockReturnValue(1_000);

    init({ key: '3f9c2a71b8d04e65', endpoint: ENDPOINT });

    expect(send).toHaveBeenCalledWith(
      ENDPOINT,
      expect.objectContaining({ method: 'POST', keepalive: true, mode: 'cors' }),
    );
    expect(sentEvents()).toEqual([
      {
        key: '3f9c2a71b8d04e65',
        url: 'https://bloomly.example/pricing?utm_source=reddit',
        type: 'PAGEVIEW',
        referrer: 'https://www.reddit.com/r/plants',
      },
    ]);

    send.mockClear();
    setPage({ scrollY: 2400 });
    window.dispatchEvent(new Event('scroll'));
    track('signed_up');
    vi.spyOn(performance, 'now').mockReturnValue(46_000);
    setPage({ scrollY: 2400, visibility: 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(new Event('pagehide'));

    expect(sentEvents()).toEqual([
      {
        key: '3f9c2a71b8d04e65',
        url: 'https://bloomly.example/pricing?utm_source=reddit',
        type: 'CUSTOM',
        name: 'signed_up',
      },
      {
        key: '3f9c2a71b8d04e65',
        url: 'https://bloomly.example/pricing?utm_source=reddit',
        type: 'ENGAGEMENT',
        seconds: 45,
        scroll: 80,
      },
    ]);

    send.mockClear();
    vi.spyOn(performance, 'now').mockReturnValue(50_000);
    setPage({});
    document.dispatchEvent(new Event('visibilitychange'));
    history.replaceState(null, '', '/pricing?tab=yearly');
    vi.spyOn(performance, 'now').mockReturnValue(60_000);
    history.pushState(null, '', '/signup');

    expect(sentEvents()).toEqual([
      {
        key: '3f9c2a71b8d04e65',
        url: 'https://bloomly.example/pricing?utm_source=reddit',
        type: 'ENGAGEMENT',
        seconds: 10,
        scroll: 80,
      },
      { key: '3f9c2a71b8d04e65', url: 'https://bloomly.example/signup', type: 'PAGEVIEW' },
    ]);
  });
});
