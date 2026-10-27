import { init, track } from './index';

type Pal = ((name: string) => void) & { q?: [string][] };

declare global {
  interface Window {
    pal?: Pal;
  }
}

const script = document.currentScript as HTMLScriptElement | null;
const { key, endpoint } = script?.dataset ?? {};
const queued = window.pal?.q ?? [];

if (key) {
  init({ key, endpoint });
} else {
  // eslint-disable-next-line no-console -- the only hint a founder gets when the tag is incomplete
  console.warn('LaunchPal: data-key is required');
}

window.pal = track;
queued.forEach(([name]) => track(name));
