import { defineManifest } from '@crxjs/vite-plugin'
import { manifestConfig, sidePanelPath } from './manifest.config'

export default defineManifest({
  ...manifestConfig,
  side_panel: {
    default_path: sidePanelPath,
  },
})
