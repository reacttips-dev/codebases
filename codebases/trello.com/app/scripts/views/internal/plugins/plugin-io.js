/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginIO;
const _ = require('underscore');
const { makeErrorEnum } = require('app/scripts/lib/make-error-enum');
const { IFrameIO } = require('app/scripts/network/iframe-io');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const Promise = require('bluebird');
const Visibility = require('visibilityjs');

const PluginIOError = makeErrorEnum('Plugin', ['NotHandled', 'Timeout']);

module.exports = PluginIO = (function () {
  PluginIO = class PluginIO {
    static initClass() {
      this.Error = PluginIOError;
    }

    constructor(plugin, handlers) {
      this.handlers = handlers;
      this.id = plugin.id;
      // special-case the callback capability since it is implemented by Trello
      // on behalf of all Power-Ups in power-up.js
      this.capabilities = _.union(plugin.get('capabilities'), ['callback']);
      this.iframeConnectorUrl = plugin.get('iframeConnectorUrl');
      this.icon = plugin.get('icon');
      this.listing = plugin.get('listing');
      this.name = plugin.get('name');
      this.moderatedState = plugin.get('moderatedState');
      this.public = plugin.get('public');
    }

    getName() {
      return this.listing?.name || this.name;
    }
    getDescription() {
      return this.listing?.description || '';
    }
    getOverview() {
      return this.listing?.overview || '';
    }
    getIconUrl() {
      const iconUrl = this.icon?.url;
      if (pluginValidators.isValidUrlForImage(iconUrl)) {
        return iconUrl;
      } else {
        return null;
      }
    }

    _getIo() {
      if (this.moderatedState === 'moderated') {
        throw new Error(
          `Power-Up '${this.getName()}' (id: ${this.id}) is moderated`,
        );
      }

      return (
        this._io ??
        (this._io = new IFrameIO(
          this.iframeConnectorUrl,
          this.handlers,
          this.id,
          this.capabilities,
        ))
      );
    }

    request(command, options, timeout) {
      if (this.moderatedState === 'moderated') {
        throw new Error(
          `Power-Up '${this.getName()}' (id: ${this.id}) is moderated`,
        );
      }

      return new Promise(function (resolve) {
        // we only want to make a request to a Power-Up when the board is in the foreground tab
        // otherwise our communication with it is slowed so drastically by the browser that
        // we are highly prone to timing out. Also updating the information you aren't looking
        // at isn't terribly useful, so we'll just wait for you to be looking.
        return Visibility.onVisible(resolve);
      }).then(() => {
        return this._getIo()
          .request(command, options, timeout)
          .catch(IFrameIO.Error.NotHandled, function () {
            throw PluginIOError.NotHandled();
          })
          .catch(IFrameIO.Error.Timeout, function (err) {
            throw PluginIOError.Timeout(err.message);
          });
      });
    }

    supports(command) {
      if (this.moderatedState === 'moderated') {
        if (typeof console !== 'undefined' && console !== null) {
          console.warn(`Warning: Power-Up '${this.getName()}' (id: ${
            this.id
          }) is moderated. \
Capability '${command}' was denied.`);
        }
        return false;
      }

      return (
        _.isArray(this.capabilities) != null &&
        Array.from(this.capabilities).includes(command)
      );
    }

    drop() {
      return this._getIo().then((io) => io?.drop());
    }
  };
  PluginIO.initClass();
  return PluginIO;
})();
