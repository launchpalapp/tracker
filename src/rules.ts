export const scrollPercent = (page: { top: number; viewport: number; height: number }) =>
  page.height <= page.viewport
    ? 100
    : Math.min(100, Math.round(((page.top + page.viewport) / page.height) * 100));

export const isNewPage = (previousUrl: string, nextUrl: string) =>
  new URL(previousUrl).pathname !== new URL(nextUrl).pathname;
