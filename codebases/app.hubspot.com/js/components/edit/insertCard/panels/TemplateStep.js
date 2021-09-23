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
import FormattedMessage from 'I18n/components/FormattedMessage';
import H2 from 'UIComponents/elements/headings/H2';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import SidebarTemplateList from 'SequencesUI/components/edit/templateSidebar/SidebarTemplateList';

var TemplateStep = /*#__PURE__*/function (_Component) {
  _inherits(TemplateStep, _Component);

  function TemplateStep() {
    _classCallCheck(this, TemplateStep);

    return _possibleConstructorReturn(this, _getPrototypeOf(TemplateStep).apply(this, arguments));
  }

  _createClass(TemplateStep, [{
    key: "renderFooter",
    value: function renderFooter() {
      var _this$props = this.props,
          onCancel = _this$props.onCancel,
          closeModal = _this$props.closeModal;
      return /*#__PURE__*/_jsx(UIPanelFooter, {
        children: /*#__PURE__*/_jsx(UIButton, {
          use: "secondary",
          onClick: onCancel || closeModal,
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
          templateFolders = _this$props2.templateFolders,
          selectTemplate = _this$props2.selectTemplate,
          numAutoEmailSteps = _this$props2.numAutoEmailSteps,
          __onCancel = _this$props2.onCancel,
          isTemplateReplacementFlow = _this$props2.isTemplateReplacementFlow,
          propsToPass = _objectWithoutProperties(_this$props2, ["closeModal", "panelKey", "width", "templateFolders", "selectTemplate", "numAutoEmailSteps", "onCancel", "isTemplateReplacementFlow"]);

      return /*#__PURE__*/_jsxs(UIPanel, Object.assign({
        width: width,
        panelKey: panelKey,
        "data-selenium-test": "TEMPLATE_STEP"
      }, propsToPass, {
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: closeModal
        }), /*#__PURE__*/_jsx(UIPanelHeader, {
          children: /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "edit.insertCardPanel.title.TEMPLATES"
            })
          })
        }), /*#__PURE__*/_jsx(UIPanelBody, {
          children: /*#__PURE__*/_jsx(SidebarTemplateList, {
            templateFolders: templateFolders,
            selectTemplate: selectTemplate,
            numAutoEmailSteps: numAutoEmailSteps,
            isTemplateReplacementFlow: isTemplateReplacementFlow
          })
        }), this.renderFooter()]
      }));
    }
  }]);

  return TemplateStep;
}(Component);

TemplateStep.propTypes = Object.assign({
  closeModal: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  panelKey: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
}, SidebarTemplateList.propTypes, {
  isTemplateReplacementFlow: PropTypes.bool
});
export default TemplateStep;