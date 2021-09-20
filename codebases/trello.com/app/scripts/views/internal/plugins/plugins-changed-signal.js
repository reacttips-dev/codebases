/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { Auth } = require('app/scripts/db/auth');
const { debounceSignal } = require('app/scripts/lib/util/debounce-signal');
const Hearsay = require('hearsay');

const signalCache = {};

function signalName(board, card) {
  return card ? board.id + card.cid : board.id;
}

const pluginsChangedSignal = function (board, card) {
  const snooper = board
    .snoopIdPluginsEnabled()
    .map(function (idPlugins) {
      if (idPlugins.length === 0) {
        return Hearsay.const({});
      }

      const snoopers = idPlugins.map(function (idPlugin) {
        if (card) {
          return Hearsay.combine(
            Auth.me().snoopPluginData(idPlugin),
            board.snoopPluginData(idPlugin),
            card.snoopPluginData(idPlugin),
          );
        } else {
          return Hearsay.combine(
            Auth.me().snoopPluginData(idPlugin),
            board.snoopPluginData(idPlugin),
          );
        }
      });

      return Hearsay.combine(
        ...Array.from(snoopers || []),
      ).map((latestPluginData) => _.object(idPlugins, latestPluginData));
    })
    .latest();

  const signal = snooper.distinct(_.isEqual);

  const debouncedSignal = debounceSignal(signal, 100);

  const unuse = debouncedSignal.use();

  const stopUsing = () => {
    unuse();
    board.off('destroy', stopUsing);
    card?.off('destroy', stopUsing);
  };

  board.once('destroy', stopUsing);
  card?.once('destroy', stopUsing);

  board.on();

  return debouncedSignal;
};

module.exports = function (board, card) {
  const name = signalName(board, card);
  if (!signalCache[name]) {
    signalCache[name] = pluginsChangedSignal(board, card).addDisposer(() => {
      delete signalCache[name];
    });
  }
  return signalCache[name];
};
