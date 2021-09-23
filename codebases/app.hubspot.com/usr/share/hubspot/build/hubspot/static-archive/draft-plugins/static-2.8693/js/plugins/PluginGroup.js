'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import isFunction from 'transmute/isFunction';
import GenericPluginGroup from './GenericPluginGroup';
export default (function (options) {
  for (var _len = arguments.length, plugins = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    plugins[_key - 1] = arguments[_key];
  }

  if (isFunction(options)) {
    // options are optional
    plugins = [options].concat(_toConsumableArray(plugins));
    options = {};
  }

  return GenericPluginGroup(plugins, Object.assign({}, options, {
    className: "draft-extend-popover-controls p-x-2 p-top-2 " + options.className
  }));
});