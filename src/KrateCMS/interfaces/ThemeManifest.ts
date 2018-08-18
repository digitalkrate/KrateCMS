export default interface ThemeManifest {
  // From manifest.json
  name: string,
  author: string,
  version: string,
  description: string,
  assest: {
    thumbnail?: string,
    views: {
      _base: string,
      admin?: string
    },
    styles: {
      _base: string
    },
    scripts: {
      _base: string
    },
    images: {
      _base: string
    }
  }
}
