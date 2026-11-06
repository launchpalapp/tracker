import { init, isOptedOut, optIn, optOut, track } from './index';

type Pal = ((name: string) => void) & {
  q?: [string][];
  optOut?: () => void;
  optIn?: () => void;
  isOptedOut?: () => boolean;
};

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

window.pal = Object.assign((name: string) => track(name), { optOut, optIn, isOptedOut });
queued.forEach(([name]) => track(name));
