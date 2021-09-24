'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import * as React from 'react';
import FormattedMessage from './FormattedMessage';
import I18n from 'I18n';
var defaultElements = {
  wrapper: 'span'
};

function createElement(elements, type) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return React.createElement.apply(React, [elements && elements[type] || defaultElements[type] || defaultElements.wrapper].concat(args));
}

function renderMissingOrInvalidKey(props) {
  console.warn("I18n: FormattedJSXMessage called with missing or non-JSX message key " + props.message + ". See go/i18n-react for more info.");
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: props.message,
    options: props.options
  });
}

var isSet = function isSet(value) {
  return value !== undefined && value !== null;
};

var FormattedJSXMessage = function FormattedJSXMessage(props) {
  var fn = I18n.lookup(props.message, {
    locale: I18n.langEnabled ? I18n.locale : 'en'
  });

  if (!isSet(fn)) {
    return renderMissingOrInvalidKey(props);
  }

  var count = props.options && props.options.count;
  var countIsSet = isSet(count);

  if (typeof fn === 'object' && countIsSet) {
    var pluralizer = I18n.pluralization.get();
    var keys = pluralizer(count);

    while (keys.length) {
      var key = keys.shift();

      if (isSet(fn[key])) {
        fn = fn[key];
        break;
      }
    }
  }

  var formattedProps = Object.assign({}, props.options);

  if (countIsSet && typeof count === 'number') {
    formattedProps.count = I18n.formatNumber(count);
  } else if (typeof fn === 'string') {
    return renderMissingOrInvalidKey(props);
  }

  return fn(createElement, props.elements, formattedProps);
};

FormattedJSXMessage.propTypes = {
  message: PropTypes.string.isRequired,
  elements: PropTypes.object.isRequired,
  options: PropTypes.object,
  jsxMessageValidator: function jsxMessageValidator(props, propName, componentName) {
    if (!props.message.endsWith('_jsx')) {
      console.warn("I18n: " + componentName + " called with invalid message prop not ending in _jsx for " + props.message);
    }
  }
};
export default FormattedJSXMessage;