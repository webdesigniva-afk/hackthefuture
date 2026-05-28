import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'zxrcdwgj',
    dataset: 'production'
  },

  deployment: {
    appId: 'yepif84f7tpm0h9oxnpc6lkp',

    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})