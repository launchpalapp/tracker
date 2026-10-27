import { isNewPage, scrollPercent } from './rules';

export type TrackerOptions = {
  /** Your app's key from LaunchPal. Events count only from pages on your app's domain. */
  key: string;
  /** Where events are sent. Defaults to LaunchPal's API. */
  endpoint?: string;
};

type Tracker = { track: (name: string) => void };

const DEFAULT_ENDPOINT = 'https://api.launchpal.app/v1/collect';
const NO_TRACKING: Tracker = { track: () => undefined };
const current: { tracker: Tracker | null } = { tracker: null };

type TrackerEvent =
  | { type: 'PAGEVIEW'; referrer?: string }
  | { type: 'ENGAGEMENT'; seconds: number; scroll: number }
  | { type: 'CUSTOM'; name: string };

const visibleNow = () => (document.visibilityState === 'visible' ? performance.now() : null);

const currentScroll = () =>
  scrollPercent({
    top: window.scrollY,
    viewport: window.innerHeight,
    height: document.documentElement.scrollHeight,
  });

const onNavigation = (callback: () => void) => {
  if (window.navigation) {
    window.navigation.addEventListener('currententrychange', callback);
    return;
  }

  // Browsers without the Navigation API only reveal in-app navigation by wrapping these.
  (['pushState', 'replaceState'] as const).forEach((method) => {
    const original = history[method].bind(history);

    history[method] = (...args: Parameters<History['pushState']>) => {
      original(...args);
      callback();
    };
  });
  window.addEventListener('popstate', callback);
};

const createTracker = (options: TrackerOptions): Tracker => {
  // Automated browsers send nothing; the API drops pages outside the app's domain.
  if (typeof window === 'undefined' || navigator.webdriver) {
    return NO_TRACKING;
  }

  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const page = { url: location.href, visibleSince: visibleNow(), scroll: currentScroll() };

  const send = (event: TrackerEvent) => {
    const body = JSON.stringify({ key: options.key, url: page.url, ...event });

    // A text/plain body needs no preflight, cors mode always sends the real Origin, and blockers ban sendBeacon.
    fetch(endpoint, { method: 'POST', body, keepalive: true, mode: 'cors' }).catch(() => undefined);
  };

  const flush = () => {
    if (page.visibleSince === null) {
      return;
    }

    const seconds = Math.round((performance.now() - page.visibleSince) / 1000);

    page.visibleSince = null;

    if (seconds > 0) {
      send({ type: 'ENGAGEMENT', seconds, scroll: page.scroll });
    }
  };

  const navigate = () => {
    if (!isNewPage(page.url, location.href)) {
      return;
    }

    flush();
    Object.assign(page, {
      url: location.href,
      visibleSince: visibleNow(),
      scroll: currentScroll(),
    });
    send({ type: 'PAGEVIEW' });
  };

  send({ type: 'PAGEVIEW', referrer: document.referrer });
  window.addEventListener(
    'scroll',
    () => {
      page.scroll = Math.max(page.scroll, currentScroll());
    },
    { passive: true },
  );
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flush();
    } else {
      page.visibleSince = performance.now();
    }
  });
  onNavigation(navigate);

  return { track: (name) => send({ type: 'CUSTOM', name }) };
};

/**
 * Starts tracking page views, time on page and scroll depth, including every path a single-page app
 * navigates to. Call once, in the browser; later calls are ignored. Nothing is sent on the server or
 * from automated browsers.
 */
export const init = (options: TrackerOptions): void => {
  current.tracker ??= createTracker(options);
};

/** Records a custom event by its name, up to 64 characters, like `track('signed_up')`. */
export const track = (name: string): void => {
  current.tracker?.track(name);
};
