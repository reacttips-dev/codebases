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
const _ = require('underscore');
const { Auth } = require('app/scripts/db/auth');
const { dontUpsell } = require('@trello/browser');
const config = require('@trello/config');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { BUTLER_POWER_UP_ID } = require('app/scripts/data/butler-id');
const { makeErrorEnum } = require('app/scripts/lib/make-error-enum');
const { ModelCache } = require('app/scripts/db/model-cache');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { Plugin } = require('app/scripts/models/Plugin');
const PluginIO = require('app/scripts/views/internal/plugins/plugin-io');
const PluginIOCache = require('app/scripts/views/internal/plugins/plugin-io-cache');
const PluginHandlerContext = require('app/scripts/views/internal/plugins/plugin-handler-context');
const pluginOptions = require('app/scripts/views/internal/plugins/plugin-options');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const processCallbacks = require('app/scripts/views/internal/plugins/plugin-process-callbacks');
const Promise = require('bluebird');
const xtend = require('xtend');

const PluginRunnerError = makeErrorEnum('PluginRunner', [
  'NotHandled',
  'InvalidPlugin',
  'Timeout',
]);

const DEFAULT_TIMEOUT = 5000;

const eventualEnabledPlugins = {};

const loadAvailablePlugins = function (idBoard) {
  // We might have several PluginRunners make requests at once (e.g. for badges)
  // and we don't want all of them to trigger duplicate requests to loading the
  // plugins from the server.
  if (eventualEnabledPlugins[idBoard] == null) {
    eventualEnabledPlugins[idBoard] = ModelLoader.loadBoardEnabledPlugins(
      idBoard,
    );

    eventualEnabledPlugins[idBoard].then(
      () => delete eventualEnabledPlugins[idBoard],
    );
  }

  return eventualEnabledPlugins[idBoard];
};

const loadPlugin = (board, pluginOrId) =>
  Promise.try(function () {
    let existingPlugin;
    if (pluginOrId instanceof Plugin) {
      return pluginOrId;
    }

    if (!_.isString(pluginOrId)) {
      throw PluginRunnerError.InvalidPlugin('invalid plugin specifier');
    }

    const idPlugin = pluginOrId;
    if ((existingPlugin = ModelCache.get('Plugin', idPlugin)) != null) {
      return existingPlugin;
    }

    if (board == null) {
      throw PluginRunnerError.InvalidPlugin('unable to find plugin');
    }

    return loadAvailablePlugins(board.id).then(function () {
      if ((existingPlugin = ModelCache.get('Plugin', idPlugin)) != null) {
        return existingPlugin;
      }

      throw PluginRunnerError.InvalidPlugin('plugin not available to board');
    });
  });

const extractPlugins = function ({ plugins, plugin, board }) {
  plugins =
    plugins ??
    (plugin != null ? [plugin] : undefined) ??
    board?.idPluginsEnabled() ??
    [];

  return Promise.map(plugins, (pluginOrId) => {
    return loadPlugin(board, pluginOrId);
  });
};

const extractCommonContext = function (options) {
  let idOrg, org;
  const board = options?.board;
  const baseContext = {
    version: /^build-\d+$/.test(config.clientVersion)
      ? config.clientVersion
      : 'unknown',
    member: Auth.me(),
    permissions: {
      board: board?.editable() ? 'write' : 'read',
    },
  };
  if ((idOrg = board?.hasOrganization()) != null) {
    baseContext.organization = idOrg;
  }
  if ((org = board?.getOrganization()) != null) {
    baseContext.permissions.organization = org?.hasActiveMembership(Auth.me())
      ? 'write'
      : 'read';
  }
  if (board?.isEnterpriseBoard() && board.getEnterprise()) {
    baseContext.enterprise = board.getEnterprise().id;
  }
  if (options.card != null) {
    baseContext.permissions.card = options.card.editable() ? 'write' : 'read';
  }
  const extendedContext = ['board', 'list', 'card', 'command', 'el'];
  return xtend(baseContext, _.pick(options, extendedContext));
};

const extractCommandOptions = ({ options }) => options;

const returnFirstOrError = function (responses) {
  if (responses.length === 0) {
    throw PluginRunnerError.NotHandled('no plugin handles this command');
  }
  return _.first(responses);
};

const validateUrls = (obj, idPlugin) =>
  _.each(obj, function (val, key) {
    if (_.isObject(val) || _.isArray(val)) {
      return validateUrls(val, idPlugin);
    } else if (key === 'url' && !pluginValidators.isValidUrlForImage(val)) {
      if (typeof console !== 'undefined' && console !== null) {
        console.warn(
          `Invalid URL detected in Power-Up response for: ${idPlugin}`,
        );
      }
      throw new PluginIO.Error.NotHandled('Invalid url');
    }
  });
class PluginRunner {
  static initClass() {
    this.prototype.Error = PluginRunnerError;
  }
  processCallbacks(obj, pluginEntry, baseOptions) {
    return processCallbacks(obj, (runOptions) => {
      const options = xtend(baseOptions, runOptions);
      const runAction = runOptions.options.action;
      return this._run(
        [pluginEntry],
        extractCommonContext(options),
        extractCommandOptions(options),
      )
        .then(returnFirstOrError)
        .catch(PluginRunnerError.NotHandled, function (err) {
          throw PluginRunnerError.NotHandled(
            `attempt to ${runAction} callback on plugin ${pluginEntry.plugin.id} failed`,
          );
        });
    });
  }

  _getPluginSpecificContext(idPlugin, board) {
    switch (idPlugin) {
      case BUTLER_POWER_UP_ID:
        // Allow Butler to know if we are in a Desktop context
        // As Butler will have to hide upsells to conform to app store rules
        return {
          dontUpsell: dontUpsell(),
          showSuggestions: featureFlagClient.get(
            'ecosystem.butler-suggestions',
            false,
          ),
          canShowButlerUI: board.canShowButlerUI(),
          useRoutes: true,
          butlerName: 'automation',
          butlerkey: 'automation',
          teamsRebrand: featureFlagClient.get(
            'workflowers.butler-teams-rebrand',
            false,
          ),
          useNewButton: true,
          commandSharing: featureFlagClient.get(
            'workflowers.butler-command-sharing',
            false,
          ),
          quotaRepackaging: featureFlagClient.get(
            'workflowers.butler-quota-repackaging',
            false,
          ),
          // Deprecated FFs; to be cleaned up in Butler Client separately
          omitCardButtons: true,
          ungatePaidCommands: true,
        };
      default:
        return {};
    }
  }

  _run(pluginEntries, commonContext, commandOptions, timeout) {
    if (timeout == null) {
      timeout = DEFAULT_TIMEOUT;
    }
    const { command, board, card, member } = commonContext;

    return Promise.using(
      PluginHandlerContext.serialize(commonContext),
      (serializedCommonContext) => {
        return Promise.filter(pluginEntries, ({ io }) => io.supports(command))
          .map((pluginEntry) => {
            const { plugin, io } = pluginEntry;

            const pluginSpecificContext = this._getPluginSpecificContext(
              plugin.id,
              board,
            );
            const commandOptionsWithContext = xtend(commandOptions, {
              context: PluginHandlerContext.extend(
                serializedCommonContext,
                pluginSpecificContext,
              ),
            });

            return io
              .request(
                command,
                pluginOptions(commandOptionsWithContext),
                timeout,
              )
              .then((response) => {
                validateUrls(response, plugin.id);
                return {
                  response: this.processCallbacks(response, pluginEntry, {
                    board,
                    card,
                    member,
                  }),
                  idPlugin: plugin.id,
                };
              })
              .catch(
                PluginIO.Error.NotHandled,
                PluginIO.Error.Timeout,
                () => null,
              );
          })
          .filter((entry) => entry != null)
          .map(function ({ response, idPlugin }) {
            if (
              Array.isArray(response) &&
              _.compact(response).every(_.isObject)
            ) {
              return _.compact(response).map((r) => xtend(r, { idPlugin }));
            } else if (_.isObject(response)) {
              return xtend(response, { idPlugin });
            } else {
              return response;
            }
          });
      },
    );
  }

  _runFromOptions(options) {
    const plugins = extractPlugins(options);
    const commonContext = extractCommonContext(options);
    const commandOptions = extractCommandOptions(options);

    return Promise.resolve(plugins)
      .filter((plugin) =>
        options.fxPluginFilter ? options.fxPluginFilter(plugin) : true,
      )
      .map((plugin) => ({
        plugin,
        io: PluginIOCache.get(plugin),
      }))
      .then((pluginEntries) => {
        return this._run(
          pluginEntries,
          commonContext,
          commandOptions,
          options.timeout,
        );
      });
  }

  all(options) {
    return this._runFromOptions(options).then(_.flatten);
  }

  one(options) {
    return this._runFromOptions(options).then(returnFirstOrError);
  }

  getOrLoadPlugin(board, idPlugin) {
    return loadPlugin(board, idPlugin);
  }
}
PluginRunner.initClass();

module.exports = new PluginRunner();
