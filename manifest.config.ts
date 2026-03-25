import pkg from './package.json'

export const sidePanelPath = 'src/sidepanel/index.html' as const

/** Fields common to Chrome and Firefox builds. */
export const manifestConfig = {
  manifest_version: 3 as const,
  name: 'Bitbucket: Commit message',
  description: 'Format the commit message for Bitbucket pull requests',
  version: pkg.version,
  icons: {
    48: 'public/logo.png',
    128: 'public/logo.png',
  },
  action: {
    default_icon: {
      48: 'public/logo.png',
      128: 'public/logo.png',
    },
    default_popup: 'src/popup/index.html',
  },
  permissions: ['storage'],
  content_scripts: [
    {
      js: ['src/content/bootstrap.ts'],
      matches: [
        'https://bitbucket.org/*/*/pull-requests/*',
        'https://bitbucket.org/*/*/pull-request/*',
      ],
      run_at: 'document_idle' as const,
    },
  ],
}
