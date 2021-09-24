'use es6';

import { Map as ImmutableMap } from 'immutable';
export default (function (arg) {
  if (typeof arg === 'function') {
    return arg;
  }

  var _arg$deps = arg.deps,
      deps = _arg$deps === void 0 ? {} : _arg$deps,
      rule = arg.rule;
  rule.__deps = ImmutableMap(deps);
  return rule;
});