export const bareHostname = (hostname: string) => hostname.replace(/^www\./, '');

export const shouldTrack = (page: { hostname: string; webdriver: boolean }, site: string) =>
  !page.webdriver && bareHostname(page.hostname) === site;

export const scrollPercent = (page: { top: number; viewport: number; height: number }) =>
  page.height <= page.viewport
    ? 100
    : Math.min(100, Math.round(((page.top + page.viewport) / page.height) * 100));

export const isNewPage = (previousUrl: string, nextUrl: string) =>
  new URL(previousUrl).pathname !== new URL(nextUrl).pathname;
