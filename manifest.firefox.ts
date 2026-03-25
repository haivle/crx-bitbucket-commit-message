import { defineManifest } from '@crxjs/vite-plugin'
import { manifestConfig, sidePanelPath } from './manifest.config'

/**
 * Firefox uses `sidebar_action`. `side_panel` is kept so @crxjs still bundles the sidepanel HTML;
 * Firefox ignores `side_panel`. Gecko-only keys are not in @crxjs typings.
 */
export default defineManifest({
  ...manifestConfig,
  side_panel: {
    default_path: sidePanelPath,
  },
  browser_specific_settings: {
    gecko: {
      id: '{7c3f2a91-4d8e-4b2f-9c1a-0e2fb4c8d7a3}',
      strict_min_version: '109.0',
      data_collection_permissions: {
        required: ['none'],
      },
    },
  },
  sidebar_action: {
    default_title: 'Merge message settings',
    default_panel: sidePanelPath,
    default_icon: {
      48: 'public/logo.png',
      128: 'public/logo.png',
    },
  },
} as unknown as Parameters<typeof defineManifest>[0])
