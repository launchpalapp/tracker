// @vitest-environment happy-dom
// @vitest-environment-options {"url": "https://bloomly.example/pricing"}
import { describe, expect, it, vi } from 'vitest';
import { init } from './index';

describe('init with the Navigation API', () => {
  it('sends a page view when the current entry moves to a new path', () => {
    const send = vi.fn(
      async (_url: string, _init: RequestInit) => new Response(null, { status: 202 }),
    );
    const navigation = new EventTarget();

    vi.stubGlobal('fetch', send);
    Object.defineProperty(navigator, 'webdriver', { value: false, configurable: true });
    Object.defineProperty(window, 'navigation', { value: navigation, configurable: true });
    init({ key: '3f9c2a71b8d04e65', endpoint: 'https://collect.example/v1/collect' });
    send.mockClear();

    history.pushState(null, '', '/signup');
    navigation.dispatchEvent(new Event('currententrychange'));

    const events = send.mock.calls.map(([, init]) => JSON.parse(String(init.body)));

    expect(events.map((event) => [event.type, event.url])).toContainEqual([
      'PAGEVIEW',
      'https://bloomly.example/signup',
    ]);
  });
});
