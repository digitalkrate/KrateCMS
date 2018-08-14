export default interface PluginManifest {
  // From manifest.json
  name: string,
  author: string,
  version: string,
  description: string,
  permissions: Array<string>,

  // Injected by KrateCMS
  enabled: boolean,
  urls: {
    enable: string,
    disable: string
  }
}
