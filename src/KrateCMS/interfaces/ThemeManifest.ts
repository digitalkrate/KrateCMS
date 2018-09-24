export default interface ThemeManifest {
  // From manifest.json
  name: string;
  author: string;
  version: string;
  description: string;
  assets: {
    thumbnail?: string;
    views: {
      _base: string;
      admin?: string;
    };
    styles: {
      _base: string;
    };
    scripts: {
      _base: string;
    };
    images: {
      _base: string;
    };
    fonts: {
      _base: string;
    };
  };
  enabled: boolean;
}
