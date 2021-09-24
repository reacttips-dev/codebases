'use es6';

import { List } from 'immutable';
export default (function () {
  for (var _len = arguments.length, rules = new Array(_len), _key = 0; _key < _len; _key++) {
    rules[_key] = arguments[_key];
  }

  return function (getDepCache, setDepCache) {
    return function () {
      var context = {};
      var depCache = getDepCache();

      var reduceFn = function reduceFn(next, rule) {
        if (Object.hasOwnProperty.call(rule, '__deps')) {
          rule.__deps.forEach(function (depFn, depName) {
            if (depCache.has(depName)) {
              context[depName] = depCache.get(depName);
            } else {
              depFn(function (results) {
                var updatedDepCache = depCache.set(depName, results);
                setDepCache(updatedDepCache);
              });
            }
          });
        }

        return rule(next, getDepCache, setDepCache);
      };

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      args.push(context);
      return rules.reduceRight(reduceFn, function () {
        return List();
      }).apply(void 0, args);
    };
  };
});