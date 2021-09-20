/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { firstPartyPluginsOrg, pluginCiOrg } = require('@trello/config');
const { makeErrorEnum } = require('app/scripts/lib/make-error-enum');
const { Plugin } = require('app/scripts/models/Plugin');
const PluginHandlers = require('app/scripts/views/internal/plugins/plugin-handlers');
const PluginIO = require('app/scripts/views/internal/plugins/plugin-io');

const PluginIOCacheError = makeErrorEnum('PluginCache', ['InvalidArgument']);

class PluginIOCache {
  static initClass() {
    this.prototype.Error = PluginIOCacheError;
  }

  constructor() {
    this.pluginFromId = {};
  }

  get(plugin) {
    let existingPlugin;
    if (!(plugin instanceof Plugin)) {
      throw PluginIOCacheError.InvalidArgument('expected a plugin');
    }

    const { id } = plugin;
    if ((existingPlugin = this.fromId(id)) != null) {
      return existingPlugin;
    }

    const iframeConnectorUrl = plugin.get('iframeConnectorUrl') ?? '';
    let iframeConnectorHost = '';
    try {
      iframeConnectorHost = new URL(iframeConnectorUrl).host;
    } catch (err) {
      // unable to parse connector url, odd
    }

    const idOrganizationOwner = plugin.get('idOrganizationOwner');
    const ownedByTrello = [firstPartyPluginsOrg, pluginCiOrg].includes(
      idOrganizationOwner,
    );

    const allowedOrigins = [
      '*.trello.services',
      'app.butlerfortrello.com',
      'butlerfortrello.com',
      'trellegi.services.atlassian.com',
      'trellegi.stg.services.atlassian.com',
    ];

    const isOnAllowedOrigin =
      iframeConnectorUrl.startsWith('https://') &&
      allowedOrigins.some((hostTest) =>
        hostTest.startsWith('*.')
          ? iframeConnectorHost.endsWith(hostTest.substring(1))
          : iframeConnectorHost === hostTest,
      );

    // Only in the dev environment is the first party plugins org 000000000000000000000000
    // checking this lets us capture localhost dev usage but also ngrok usage
    const isDevPluginsOrg = /^0{24}$/.test(firstPartyPluginsOrg);

    const canUseRestrictedHandlers =
      ownedByTrello && (isOnAllowedOrigin || isDevPluginsOrg);

    const io = new PluginIO(
      plugin,
      PluginHandlers({
        idPlugin: id,
        allowRestricted: canUseRestrictedHandlers,
      }),
    );

    this.pluginFromId[id] = io;
    return io;
  }

  fromId(id) {
    return this.pluginFromId[id];
  }

  drop(idPlugin) {
    let plugin;
    if ((plugin = this.pluginFromId[idPlugin]) != null) {
      delete this.pluginFromId[idPlugin];
      return plugin.drop();
    }
  }
}
PluginIOCache.initClass();

module.exports = new PluginIOCache();
