'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import PropTypes from 'prop-types';
import Raven from 'Raven';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import UIModalPanel from 'UIComponents/dialog/UIModalPanel';

var PanelErrorBoundary = /*#__PURE__*/function (_Component) {
  _inherits(PanelErrorBoundary, _Component);

  _createClass(PanelErrorBoundary, null, [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError() {
      return {
        hasError: true
      };
    }
  }]);

  function PanelErrorBoundary(props) {
    var _this;

    _classCallCheck(this, PanelErrorBoundary);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PanelErrorBoundary).call(this, props));
    _this.state = {
      hasError: false
    };
    return _this;
  }

  _createClass(PanelErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorInfo) {
      Raven.captureException(error, {
        extra: errorInfo
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasError) {
        return /*#__PURE__*/_jsxs(UIModalPanel, {
          children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
            children: [/*#__PURE__*/_jsx(H4, {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "sequencesAutomation.panel.header.trigger"
              })
            }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
              onClick: this.props.onClose
            })]
          }), /*#__PURE__*/_jsx(UIDialogBody, {
            children: /*#__PURE__*/_jsx(UIErrorMessage, {
              title: /*#__PURE__*/_jsx(H4, {
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: this.props.flowIdBeingEdited ? 'sequencesAutomation.panelErrorBoundary.errorTitleEdit' : 'sequencesAutomation.panelErrorBoundary.errorTitleCreate'
                })
              }),
              children: /*#__PURE__*/_jsx("p", {
                children: /*#__PURE__*/_jsx(FormattedMessage, {
                  message: 'sequencesAutomation.panelErrorBoundary.tryAgain'
                })
              })
            })
          }), /*#__PURE__*/_jsx(UIDialogFooter, {
            children: /*#__PURE__*/_jsx(UIButton, {
              onClick: this.props.onClose,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "sequencesAutomation.button.cancel"
              })
            })
          })]
        });
      }

      return this.props.children;
    }
  }]);

  return PanelErrorBoundary;
}(Component);

PanelErrorBoundary.propTypes = {
  onClose: PropTypes.func.isRequired,
  flowIdBeingEdited: PropTypes.number,
  children: PropTypes.node.isRequired
};
export default PanelErrorBoundary;