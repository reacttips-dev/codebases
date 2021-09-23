'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIAlert from 'UIComponents/alert/UIAlert';
import { isInStarterPipeline, isInClosedLostStage, isInClosedWonStage } from 'customer-data-properties/revenue/utils/pipelineUtils';

var RevenueStageChangeHeader = /*#__PURE__*/function (_Component) {
  _inherits(RevenueStageChangeHeader, _Component);

  function RevenueStageChangeHeader() {
    _classCallCheck(this, RevenueStageChangeHeader);

    return _possibleConstructorReturn(this, _getPrototypeOf(RevenueStageChangeHeader).apply(this, arguments));
  }

  _createClass(RevenueStageChangeHeader, [{
    key: "renderClosedLostHeader",
    value: function renderClosedLostHeader(nextStageId) {
      if (!isInClosedLostStage(nextStageId)) {
        return null;
      }

      return /*#__PURE__*/_jsxs("div", {
        "data-selenium-test": "revenue-closed-lost-stage-change-header",
        children: [/*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "revenue.StageChangeDialog.closeLost.cheer"
          })
        }), /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "revenue.StageChangeDialog.closeLost.explanation"
          })
        })]
      });
    }
  }, {
    key: "renderClosedWonHeader",
    value: function renderClosedWonHeader(subject) {
      return /*#__PURE__*/_jsxs(UIFlex, {
        "data-selenium-test": "revenue-closed-won-stage-change-header",
        align: "center",
        direction: "column",
        children: [/*#__PURE__*/_jsx(UIIllustration, {
          name: "open-door",
          width: "30%"
        }), /*#__PURE__*/_jsx("h5", {
          className: "m-all-0",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "revenue.dealStageChangeModal.closedWon.heading"
          })
        }), isInStarterPipeline(subject) && /*#__PURE__*/_jsx(UIAlert, {
          className: "m-top-5 m-bottom-5",
          type: "warning",
          closeable: false,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "revenue.dealStageChangeModal.closedWon.starterClose"
          })
        }), /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "revenue.dealStageChangeModal.closedWon.message"
          })
        })]
      });
    }
  }, {
    key: "renderHeading",
    value: function renderHeading(nextStageId, nextStageLabel, subject) {
      if (isInClosedWonStage(nextStageId)) {
        return this.renderClosedWonHeader(subject);
      }

      return /*#__PURE__*/_jsxs("div", {
        children: [this.renderClosedLostHeader(nextStageId), /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "revenue.dealStageChangeModal.heading"
          })
        }), /*#__PURE__*/_jsx("h5", {
          children: nextStageLabel
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          subject = _this$props.subject,
          nextStageId = _this$props.nextStageId,
          nextStageLabel = _this$props.nextStageLabel;
      return /*#__PURE__*/_jsx("div", {
        children: this.renderHeading(nextStageId, nextStageLabel, subject)
      });
    }
  }]);

  return RevenueStageChangeHeader;
}(Component);

RevenueStageChangeHeader.propTypes = {
  nextStageLabel: PropTypes.string.isRequired,
  nextStageId: PropTypes.string.isRequired,
  subject: ImmutablePropTypes.record.isRequired
};
export default RevenueStageChangeHeader;