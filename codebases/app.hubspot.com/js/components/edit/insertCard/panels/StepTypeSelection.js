'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
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
import InsertCardPanelAlertStore from '../InsertCardPanelAlertStore';
import LinkedInStepTypeSection from './components/LinkedInStepTypeSection';
import StepTypeSelectableBox from './components/StepTypeSelectableBox';
import { getBasicOptions } from 'SequencesUI/constants/getStepTypeSelectionOptions';
import H2 from 'UIComponents/elements/headings/H2';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIFloatingAlertList from 'UIComponents/alert/UIFloatingAlertList';
import UIList from 'UIComponents/list/UIList';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';

var StepTypeSelection = /*#__PURE__*/function (_Component) {
  _inherits(StepTypeSelection, _Component);

  function StepTypeSelection() {
    _classCallCheck(this, StepTypeSelection);

    return _possibleConstructorReturn(this, _getPrototypeOf(StepTypeSelection).apply(this, arguments));
  }

  _createClass(StepTypeSelection, [{
    key: "renderLinkedInSection",
    value: function renderLinkedInSection() {
      var _this$props = this.props,
          changePanel = _this$props.changePanel,
          handleSelection = _this$props.handleSelection;
      return /*#__PURE__*/_jsx(LinkedInStepTypeSection, {
        changePanel: changePanel,
        handleSelection: handleSelection
      });
    }
  }, {
    key: "renderBasicStepTypesSection",
    value: function renderBasicStepTypesSection() {
      var handleSelection = this.props.handleSelection;
      return /*#__PURE__*/_jsx(UIPanelSection, {
        children: /*#__PURE__*/_jsx(UIList, {
          childClassName: "m-bottom-3",
          children: getBasicOptions().map(function (stepType) {
            return /*#__PURE__*/_jsx(StepTypeSelectableBox, Object.assign({
              onClick: partial(handleSelection, {
                taskMeta: stepType.taskMeta,
                panel: stepType.panel
              })
            }, stepType), stepType.titleMessage);
          })
        })
      });
    }
  }, {
    key: "renderFooter",
    value: function renderFooter() {
      var closeModal = this.props.closeModal;
      return /*#__PURE__*/_jsx(UIPanelFooter, {
        children: /*#__PURE__*/_jsx(UIButton, {
          use: "secondary",
          onClick: closeModal,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.insertCardPanel.footer.cancel"
          })
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          closeModal = _this$props2.closeModal,
          panelKey = _this$props2.panelKey,
          width = _this$props2.width,
          __changePanel = _this$props2.changePanel,
          __handleSelection = _this$props2.handleSelection,
          rest = _objectWithoutProperties(_this$props2, ["closeModal", "panelKey", "width", "changePanel", "handleSelection"]);

      return /*#__PURE__*/_jsxs(UIPanel, Object.assign({
        width: width,
        panelKey: panelKey
      }, rest, {
        "data-selenium-test": "STEP_TYPE_SELECTION",
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: closeModal
        }), /*#__PURE__*/_jsx(UIPanelHeader, {
          children: /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.insertCardPanel.title.STEP_TYPE_SELECTION"
            })
          })
        }), /*#__PURE__*/_jsxs(UIPanelBody, {
          children: [/*#__PURE__*/_jsx(UIFloatingAlertList, {
            alertStore: InsertCardPanelAlertStore,
            use: "contextual"
          }), this.renderBasicStepTypesSection(), this.renderLinkedInSection()]
        }), this.renderFooter()]
      }));
    }
  }]);

  return StepTypeSelection;
}(Component);

StepTypeSelection.propTypes = {
  changePanel: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSelection: PropTypes.func.isRequired,
  panelKey: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
};
export default StepTypeSelection;