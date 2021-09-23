'use es6';

import { isIntrospectionEnabled } from './internal/introspection';
var notRequiredCache;
var hiddenCache;
/**
 * @package
 * Implementations for decorators are exported in a mutable record
 * so they can be overwritten at runtime for type generation.
 * The `rawDecroators` object should not be used directly.
 */

export var rawDecorators = {
  hidden: function hidden(propType) {
    if (propType == null) return propType;
    hiddenCache = hiddenCache || new WeakMap();

    if (!hiddenCache.has(propType)) {
      var hiddenPropType = function hiddenPropType() {
        return propType.apply(void 0, arguments);
      };

      hiddenPropType.getType = propType.getType;

      if (propType.__INTROSPECTION__) {
        hiddenPropType.__INTROSPECTION__ = Object.assign({}, propType.__INTROSPECTION__, {
          isHidden: true
        });
      } else if (isIntrospectionEnabled()) {
        hiddenPropType.__INTROSPECTION__ = {
          isHidden: true
        };
      }

      hiddenCache.set(propType, hiddenPropType);
    }

    return hiddenCache.get(propType);
  },
  notRequired: function notRequired(propType) {
    if (propType == null) return propType;
    notRequiredCache = notRequiredCache || new WeakMap();

    if (!notRequiredCache.has(propType)) {
      var notRequiredPropType = function notRequiredPropType(props, propName) {
        if (props[propName] == null) return null;

        for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          rest[_key - 2] = arguments[_key];
        }

        return propType.apply(void 0, [props, propName].concat(rest));
      };

      notRequiredPropType.getType = propType.getType;

      if (propType.__INTROSPECTION__) {
        notRequiredPropType.__INTROSPECTION__ = Object.assign({}, propType.__INTROSPECTION__, {
          isRequired: false
        });
      }

      notRequiredCache.set(propType, notRequiredPropType);
    }

    return notRequiredCache.get(propType);
  }
};
export var notRequired = function notRequired(propTypes) {
  return rawDecorators.notRequired(propTypes);
};
export var hidden = function hidden(propTypes) {
  return rawDecorators.hidden(propTypes);
};