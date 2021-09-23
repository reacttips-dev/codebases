'use es6';

import { compose } from 'draft-extend';
import FileDropPlugin from './FileDropPlugin';
export default (function (options) {
  return function () {
    for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
      plugins[_key] = arguments[_key];
    }

    return function (WrappingComponent) {
      if (plugins.length === 0) {
        return WrappingComponent;
      }

      var pluginComposition = compose.apply(void 0, [FileDropPlugin(options)].concat(plugins));
      var WrappedComponentWithPlugins = pluginComposition(WrappingComponent);
      return WrappedComponentWithPlugins;
    };
  };
});