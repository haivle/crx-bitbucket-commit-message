# Bitbucket merge commit message — Vite + CRXJS

TypeScript extension (vanilla DOM in popup, side panel, and content scripts — no React) built with Vite and the CRXJS plugin.

## Features

- TypeScript
- Vite build tool
- CRXJS Vite plugin integration
- Chrome (`side_panel`) and Firefox (`sidebar_action`) manifests

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension from the `dist` directory.

4. Build for production:

```bash
npm run build:chrome
# or
npm run build:firefox
```

## Project Structure

- `src/popup/` - Extension popup UI
- `src/sidepanel/` - Side panel / Firefox sidebar UI
- `src/content/` - Content scripts
- `src/lib/mountSettingsUi.ts` - Shared settings UI (DOM APIs)
- `manifest.config.ts` - Shared manifest fields (Chrome + Firefox)
- `manifest.chrome.ts` / `manifest.firefox.ts` - Picked via `TARGET_BROWSER` in `vite.config.ts`

## Documentation

- [Vite Documentation](https://vite.dev/)
- [CRXJS Documentation](https://crxjs.dev/vite-plugin)

## Extension development notes

- Edit `manifest.config.ts` and `manifest.chrome.ts` / `manifest.firefox.ts` as needed (`npm run build:firefox` sets `TARGET_BROWSER=firefox`)
- The CRXJS plugin handles manifest generation
- Content scripts live in `src/content/`
- Popup UI lives in `src/popup/`
