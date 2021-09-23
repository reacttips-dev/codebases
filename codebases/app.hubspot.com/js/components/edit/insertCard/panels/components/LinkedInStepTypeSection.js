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
import partial from 'transmute/partial';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import { hasConnectedLSNIntegration as hasConnectedLSNIntegrationSelector, isFetchingLSNIntegration as isFetchingLSNIntegrationSelector } from 'SequencesUI/selectors/LSNIntegrationSelectors';
import StepTypeSelectableBox from './StepTypeSelectableBox';
import { getLinkedInOptions } from 'SequencesUI/constants/getStepTypeSelectionOptions';
import * as InsertCardPanelViews from 'SequencesUI/constants/InsertCardPanelViews';
import H5 from 'UIComponents/elements/headings/H5';
import UIButton from 'UIComponents/button/UIButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIList from 'UIComponents/list/UIList';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';

var LinkedInStepTypeSection = /*#__PURE__*/function (_Component) {
  _inherits(LinkedInStepTypeSection, _Component);

  function LinkedInStepTypeSection() {
    _classCallCheck(this, LinkedInStepTypeSection);

    return _possibleConstructorReturn(this, _getPrototypeOf(LinkedInStepTypeSection).apply(this, arguments));
  }

  _createClass(LinkedInStepTypeSection, [{
    key: "renderStepTypeButtons",
    value: function renderStepTypeButtons() {
      var _this$props = this.props,
          handleSelection = _this$props.handleSelection,
          hasConnectedLSNIntegration = _this$props.hasConnectedLSNIntegration,
          isFetchingLSNIntegration = _this$props.isFetchingLSNIntegration;

      if (isFetchingLSNIntegration) {
        return /*#__PURE__*/_jsx(UILoadingSpinner, {
          layout: "centered",
          size: "medium",
          minHeight: 100
        });
      }

      return /*#__PURE__*/_jsx(UIList, {
        childClassName: "m-bottom-3",
        "data-test-id": "linked-in-options",
        children: getLinkedInOptions().map(function (stepType) {
          return /*#__PURE__*/_jsx(StepTypeSelectableBox, Object.assign({
            disabled: !hasConnectedLSNIntegration,
            onClick: partial(handleSelection, {
              taskMeta: stepType.taskMeta,
              panel: stepType.panel
            })
          }, stepType), stepType.titleMessage);
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          changePanel = _this$props2.changePanel,
          hasConnectedLSNIntegration = _this$props2.hasConnectedLSNIntegration,
          isFetchingLSNIntegration = _this$props2.isFetchingLSNIntegration;
      var showConnectButton = !isFetchingLSNIntegration && !hasConnectedLSNIntegration;
      return /*#__PURE__*/_jsxs(UIPanelSection, {
        children: [/*#__PURE__*/_jsxs(UIFlex, {
          justify: "between",
          children: [/*#__PURE__*/_jsx(H5, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.stepTypeSelection.LinkedInSection.title"
            })
          }), showConnectButton && /*#__PURE__*/_jsx(UIButton, {
            use: "link",
            onClick: partial(changePanel, InsertCardPanelViews.CONNECT_LINKEDIN),
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.stepTypeSelection.LinkedInSection.connect"
            })
          })]
        }), this.renderStepTypeButtons()]
      });
    }
  }]);

  return LinkedInStepTypeSection;
}(Component);

LinkedInStepTypeSection.propTypes = {
  changePanel: PropTypes.func.isRequired,
  handleSelection: PropTypes.func.isRequired,
  hasConnectedLSNIntegration: PropTypes.bool.isRequired,
  isFetchingLSNIntegration: PropTypes.bool.isRequired
};
export default connect(function (state) {
  return {
    hasConnectedLSNIntegration: hasConnectedLSNIntegrationSelector(state),
    isFetchingLSNIntegration: isFetchingLSNIntegrationSelector(state)
  };
})(LinkedInStepTypeSection);