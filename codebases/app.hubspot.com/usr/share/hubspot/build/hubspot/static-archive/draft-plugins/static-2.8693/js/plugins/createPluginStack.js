'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { compose, createPlugin } from 'draft-extend';
var baseAccumulator = {
  __isAccumulator: true
};

var createPluginStackWithAdapters = function createPluginStackWithAdapters() {
  for (var _len = arguments.length, adapters = new Array(_len), _key = 0; _key < _len; _key++) {
    adapters[_key] = arguments[_key];
  }

  return function () {
    var allSets = [];
    var currentSet = [];

    for (var _len2 = arguments.length, plugins = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      plugins[_key2] = arguments[_key2];
    }

    plugins.forEach(function (plugin) {
      var accumulatorResult = plugin(baseAccumulator);
      var canBeCombined = accumulatorResult !== baseAccumulator;

      if (canBeCombined) {
        if (Array.isArray(accumulatorResult)) {
          if (currentSet.length > 0) {
            allSets = [].concat(_toConsumableArray(allSets), [currentSet]);
            currentSet = [];
          }

          allSets = [].concat(_toConsumableArray(allSets), _toConsumableArray(accumulatorResult.map(function (stack) {
            return [stack];
          })));
          return;
        }

        currentSet = [].concat(_toConsumableArray(currentSet), [plugin]);
        return;
      }

      if (currentSet.length > 0) {
        allSets = [].concat(_toConsumableArray(allSets), [currentSet]);
        currentSet = [];
      }

      allSets = [].concat(_toConsumableArray(allSets), [[plugin]]);
    });

    if (currentSet.length > 0) {
      allSets = [].concat(_toConsumableArray(allSets), [currentSet]);
    }

    var combinedPluginStacks = allSets.map(function (pluginSet) {
      var reversedPluginSet = _toConsumableArray(pluginSet).reverse();

      var pluginProps = compose.apply(void 0, _toConsumableArray(reversedPluginSet))(baseAccumulator);

      if (pluginProps === baseAccumulator) {
        if (pluginSet.length === 1) {
          return pluginSet[0];
        }

        return compose.apply(void 0, _toConsumableArray(pluginSet));
      }

      var numCombinedPlugins = pluginSet.length;

      if (numCombinedPlugins === 1 && !pluginProps.__pluginStack) {
        return pluginSet[0];
      }

      var displayName = pluginProps.__pluginStack || numCombinedPlugins + "(PluginStack)";
      return function (EditorComponent) {
        if (EditorComponent && EditorComponent.__isAccumulator) {
          return pluginProps;
        }

        if (EditorComponent.prototype && EditorComponent.prototype.isReactComponent) {
          return createPlugin(Object.assign({}, pluginProps, {
            displayName: displayName
          }))(EditorComponent);
        }

        return compose.apply(void 0, _toConsumableArray(pluginSet))(EditorComponent);
      };
    });
    return function (arg) {
      if (arg && arg.__isAccumulator) {
        return combinedPluginStacks;
      }

      return compose.apply(void 0, adapters).apply(void 0, _toConsumableArray(combinedPluginStacks))(arg);
    };
  };
};

var createPluginStack = createPluginStackWithAdapters(compose);
export { createPluginStackWithAdapters, createPluginStack };