/**
 * `fetchpriority="high"` for the page's LCP image. React 18 doesn't know the
 * camelCase `fetchPriority` prop and warns about it; spreading the lowercase
 * attribute passes it straight through. Switch to the prop on React 19.
 */
export const HIGH_FETCH_PRIORITY = { fetchpriority: 'high' } as const;
