import { defineManifest } from '@crxjs/vite-plugin'
import { manifestConfig } from './manifest.config'

/**
 * `side_panel` is Chrome-specific; the Vite config adds it temporarily during the CRXJS build
 * so the sidepanel HTML is still bundled, then strips it from the emitted manifest.
 */
export default defineManifest({
  ...manifestConfig,
  browser_specific_settings: {
    gecko: {
      id: '{7c3f2a91-4d8e-4b2f-9c1a-0e2fb4c8d7a3}',
      strict_min_version: '142.0',
      data_collection_permissions: {
        required: ['none'],
      },
    },
  },
} as unknown as Parameters<typeof defineManifest>[0])
