'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import EmptyStateMessage from '../emptyState/EmptyStateMessage';
import ErrorMessageType from '../error/ErrorMessageType';
import customErrorTypes from '../constants/customErrorTypes';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import emptyFunction from 'react-utils/emptyFunction';
var CONTACT_SEARCH_FILTERS = customErrorTypes.CONTACT_SEARCH_FILTERS,
    TOO_MANY_RECORDS = customErrorTypes.TOO_MANY_RECORDS;
var errorStateMessages = {};
errorStateMessages.generic = {
  header: 'GenericGrid.error.icecream',
  subtext: 'GenericGrid.error.subheader',
  buttonText: 'GenericGrid.error.buttonText_jsx',
  buttonHref: window.location.href,
  illustration: 'errors/general'
};
errorStateMessages[CONTACT_SEARCH_FILTERS] = {
  header: 'GenericGrid.error.mouse',
  illustration: 'errors/general'
};
errorStateMessages[TOO_MANY_RECORDS] = {
  header: 'elasticSearch.resultLimitTitle',
  illustration: 'crm'
};

var QueryErrorStateMessage = /*#__PURE__*/function (_PureComponent) {
  _inherits(QueryErrorStateMessage, _PureComponent);

  function QueryErrorStateMessage() {
    _classCallCheck(this, QueryErrorStateMessage);

    return _possibleConstructorReturn(this, _getPrototypeOf(QueryErrorStateMessage).apply(this, arguments));
  }

  _createClass(QueryErrorStateMessage, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          errorMessageType = _this$props.errorMessageType,
          header = _this$props.header,
          subtext = _this$props.subtext,
          translatedSubtext = _this$props.translatedSubtext,
          objectType = _this$props.objectType,
          showIllustration = _this$props.showIllustration;
      var langConfig = errorStateMessages[errorMessageType] ? errorStateMessages[errorMessageType] : errorStateMessages.generic;
      return /*#__PURE__*/_jsx(EmptyStateMessage, {
        illustration: showIllustration === true ? langConfig.illustration : undefined,
        linkHref: langConfig.buttonHref,
        linkText: langConfig.buttonText,
        objectType: objectType || errorMessageType,
        onClick: langConfig.onClick || emptyFunction,
        subText: subtext || langConfig.subtext,
        titleText: header || langConfig.header,
        translatedSubtext: translatedSubtext
      });
    }
  }]);

  return QueryErrorStateMessage;
}(PureComponent);

export { QueryErrorStateMessage as default };
QueryErrorStateMessage.propTypes = {
  errorMessageType: ErrorMessageType,
  header: PropTypes.string,
  objectType: AnyCrmObjectTypePropType,
  subtext: PropTypes.string,
  showIllustration: PropTypes.bool,
  translatedSubtext: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};
QueryErrorStateMessage.defaultProps = {
  errorMessageType: customErrorTypes.PAGE,
  showIllustration: true
};