import { init, track } from './index';

type Pal = ((name: string) => void) & { q?: [string][] };

declare global {
  interface Window {
    pal?: Pal;
  }
}

const script = document.currentScript as HTMLScriptElement | null;
const site = script?.dataset.site;
const queued = window.pal?.q ?? [];

if (site) {
  init({ site, endpoint: script?.dataset.endpoint });
} else {
  // eslint-disable-next-line no-console -- the only hint a founder gets when the tag is incomplete
  console.warn('LaunchPal: data-site is required');
}

window.pal = track;
queued.forEach(([name]) => track(name));
