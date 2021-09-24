'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import unescapedText from 'I18n/utils/unescapedText';
export var commonPropTypes = {
  message: PropTypes.string.isRequired,
  options: PropTypes.object,
  useGap: PropTypes.bool
};
export var I18nCommonMixin = {
  getDefaultProps: function getDefaultProps() {
    return {
      options: {},
      useGap: false
    };
  },
  _getValue: function _getValue() {
    var unescapeOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var _this$props = this.props,
        useGap = _this$props.useGap,
        message = _this$props.message,
        options = _this$props.options;
    var value = unescapeOptions ? // i18n-lint-describe-next-line key-is-argument
    unescapedText(message, options) : // i18n-lint-describe-next-line key-is-argument
    I18n.text(message, options);

    if (useGap === true) {
      value = " " + value + " ";
    }

    return value;
  },
  statics: {
    isI18nElement: true
  }
};
export var getPassThroughProps = function getPassThroughProps(allProps) {
  var localeOverwrite = allProps.options && allProps.options.locale;
  var result = {
    'data-locale-at-render': localeOverwrite || I18n.locale,
    'data-key': allProps.message
  };

  for (var _i = 0, _Object$keys = Object.keys(allProps); _i < _Object$keys.length; _i++) {
    var propKey = _Object$keys[_i];

    if (['message', 'options', 'useGap'].indexOf(propKey) < 0) {
      result[propKey] = allProps[propKey];
    }
  }

  return result;
};
export var classNameFix = function classNameFix(props) {
  var className = props.className,
      classProp = props.class,
      restProps = _objectWithoutProperties(props, ["className", "class"]);

  if (className && !classProp) {
    return Object.assign({
      class: className
    }, restProps);
  }

  return props;
};
export var isSet = function isSet(value) {
  return value !== undefined && value !== null;
}; // interpolateToArray function to translate strings while preserving React element params (#108)

export var interpolateToArray = function interpolateToArray(key, options, escapeFunction) {
  var modifiedOpts = I18n.prepareOptions(options);
  modifiedOpts.__scope = key;
  var result = [];

  if (!options.locale && !I18n.langEnabled && !I18n.publicPage) {
    I18n.debugLog('Forcing translation in English, lang is not enabled');
    modifiedOpts.locale = 'en';
  } // i18n-lint-describe-next-line key-is-argument


  var remainingMessage = I18n.lookup(key, modifiedOpts);

  if (remainingMessage == null) {
    return [I18n.missingTranslation(key)];
  }

  if (remainingMessage === Object(remainingMessage) && isSet(options.count)) {
    if (options.count === 0 && remainingMessage.zero) {
      remainingMessage = remainingMessage.zero;
    } else if (options.count === 1 && remainingMessage.one) {
      remainingMessage = remainingMessage.one;
    } else {
      remainingMessage = remainingMessage.other;
    }
  }

  var i = 0;
  var match = I18n.placeholder.exec(remainingMessage);

  while (match) {
    // Custom HubSpot change for default escaping of params
    var prefix = remainingMessage.substring(0, match.index);

    if (prefix !== '') {
      result.push(escapeFunction('text-chunk', prefix, i++));
    }

    var optName = match[1];
    var rawOptValue = modifiedOpts[optName] != null ? modifiedOpts[optName] : I18n.missingPlaceholder(optName, remainingMessage, modifiedOpts);
    var escapedOptValue = escapeFunction(optName, rawOptValue, i++);

    if (escapedOptValue !== '') {
      result.push(escapedOptValue);
    }

    remainingMessage = remainingMessage.substring(match.index + match[0].length); // Reset `lastIndex` because we are re-using the same regex (and it maintains state when doing `exec`)

    I18n.placeholder.lastIndex = 0;
    match = I18n.placeholder.exec(remainingMessage);
  }

  if (remainingMessage !== '') {
    result.push(escapeFunction('text-chunk', remainingMessage, i++));
  }

  return result;
};