/**
 * WebExtension API surface used by this project. Firefox exposes `browser`;
 * Chrome exposes `chrome`; Firefox also aliases `chrome` in many contexts.
 */
export function getExtensionApi(): typeof chrome {
  const g = globalThis as typeof globalThis & { browser?: typeof chrome };
  if (g.browser?.storage?.local) return g.browser;
  return chrome;
}
