import { createTracker } from './index';
import { bareHostname } from './rules';

type Pal = ((name: string) => void) & { q?: [string][] };

declare global {
  interface Window {
    pal?: Pal;
  }
}

const script = document.currentScript as HTMLScriptElement | null;
const tracker = createTracker({
  site: script?.dataset.site ?? bareHostname(location.hostname),
  endpoint: script?.dataset.endpoint,
});
const queued = window.pal?.q ?? [];

window.pal = (name) => tracker.track(name);
queued.forEach(([name]) => tracker.track(name));
