'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIAlert from 'UIComponents/alert/UIAlert';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';

var BulkScheduleFailure = /*#__PURE__*/function (_Component) {
  _inherits(BulkScheduleFailure, _Component);

  function BulkScheduleFailure() {
    _classCallCheck(this, BulkScheduleFailure);

    return _possibleConstructorReturn(this, _getPrototypeOf(BulkScheduleFailure).apply(this, arguments));
  }

  _createClass(BulkScheduleFailure, [{
    key: "isBulkError",
    value: function isBulkError() {
      return this.props.error.responseJSON.message === 'parseFailure';
    }
  }, {
    key: "isRowError",
    value: function isRowError() {
      return this.props.error.responseJSON.message === 'rowFailures';
    }
  }, {
    key: "renderFailures",
    value: function renderFailures() {
      if (this.isRowError()) {
        var failures = this.props.error.responseJSON.errors;
        var failuresList = failures.map(function (failure, i) {
          return /*#__PURE__*/_jsx("li", {
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "sui.bulkScheduleModal.failure.rowSpecific." + failure.message,
              options: {
                rowNumber: 1 + parseInt(failure.errorTokens.rowNumber, 10)
              }
            })
          }, i);
        });
        return /*#__PURE__*/_jsx("ul", {
          children: failuresList
        });
      }

      return null;
    }
  }, {
    key: "renderFailureOverview",
    value: function renderFailureOverview() {
      if (this.isBulkError()) {
        var bulkError = this.props.error;
        var errorType = bulkError.responseJSON.errorTokens.bulkError[0];
        return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sui.bulkScheduleModal.failure." + errorType,
          options: {
            importLimit: bulkError.responseJSON.errorTokens.importLimit
          }
        });
      }

      return /*#__PURE__*/_jsxs("div", {
        className: "failure-messages",
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "sui.bulkScheduleModal.failure.resultsOverview"
        }), this.renderFailures()]
      });
    }
  }, {
    key: "renderApiFailure",
    value: function renderApiFailure() {
      return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "sui.bulkScheduleModal.failure.apiFailure"
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx("div", {
        className: "bulk-schedule-messaging",
        children: /*#__PURE__*/_jsx(UIAlert, {
          type: "danger",
          className: "bulk-schedule-alert",
          children: !this.isRowError() && !this.isBulkError() ? this.renderApiFailure() : this.renderFailureOverview()
        })
      });
    }
  }]);

  return BulkScheduleFailure;
}(Component);

BulkScheduleFailure.propTypes = {
  error: PropTypes.object
};
export { BulkScheduleFailure as default };