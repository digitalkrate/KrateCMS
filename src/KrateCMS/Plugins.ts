import * as fs from 'fs';

import { Core } from 'kratecms';
import { PluginManifest } from 'kratecms/interfaces';

export default class Plugins {

  public static async getPlugins(): Promise<Array<PluginManifest>> {
    const PLUGINS_DIR = Core.join(Core.get('webDir'), 'plugins');

    return new Promise<Array<PluginManifest>>(async(resolve, reject) => {
      fs.readdir(PLUGINS_DIR, (err, files) => {
        if(!files) return resolve([]);

        let plugins: Array<PluginManifest> = [];
        files.forEach(file => {
          const pluginPath = Core.join(PLUGINS_DIR, file);
          const manifestPath = Core.join(pluginPath, 'manifest.json');
          if(fs.existsSync(manifestPath)) {
            const contents = fs.readFileSync(manifestPath).toString('utf-8');
            const plugin = JSON.parse(contents);

            if(!plugin || !plugin.name || !plugin.author || !plugin.version || !plugin.description) return;

            plugin.permissions = plugin.permissions || [];
            plugin.enabled = Math.random() > 0.5;
            plugin.urls = {
              enable: '/admin/plugins/' + plugin.name + '/enable',
              disable: '/admin/plugins/' + plugin.name + '/disable'
            };
            plugins.push(plugin);
          }
        });

        resolve(plugins);
      });
    });
  }

  public static getPluginsSync(): Array<PluginManifest> {
    const PLUGINS_DIR = Core.join(Core.get('webDir'), 'plugins');
    const files = fs.readdirSync(PLUGINS_DIR);
    let plugins: Array<PluginManifest> = [];

    files.forEach(file => {
      const pluginPath = Core.join(PLUGINS_DIR, file);
      const manifestPath = Core.join(pluginPath, 'manifest.json');
      if(fs.existsSync(manifestPath)) {
        const contents = fs.readFileSync(manifestPath).toString('utf-8');
        const plugin = JSON.parse(contents);

        if(!plugin || !plugin.name || !plugin.author || !plugin.version || !plugin.description) return;

        plugin.permissions = plugin.permissions || [];
        plugin.enabled = Math.random() > 0.5;
        plugin.urls = {
          enable: '/admin/plugins/' + plugin.name + '/enable',
          disable: '/admin/plugins/' + plugin.name + '/disable'
        };
        plugins.push(plugin);
      }
    });

    return plugins;
  }

}
