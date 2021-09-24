'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import { CREATE, CREATE_AND_ADD_ANOTHER, CANCEL, SAVE, DELETE } from '../constants/TaskFormButtonTypes';
import TaskFormButtons from './TaskFormButtons';
import TaskFormHeader from './TaskFormHeader';

var TaskFormError = /*#__PURE__*/function (_PureComponent) {
  _inherits(TaskFormError, _PureComponent);

  function TaskFormError() {
    _classCallCheck(this, TaskFormError);

    return _possibleConstructorReturn(this, _getPrototypeOf(TaskFormError).apply(this, arguments));
  }

  _createClass(TaskFormError, [{
    key: "renderFooter",
    value: function renderFooter() {
      return /*#__PURE__*/_jsx(TaskFormButtons, {
        buttons: this.props.buttonTypes,
        onCancel: this.props.onClose,
        saveDisabled: true,
        deleteDisabled: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          children = _this$props.children,
          edit = _this$props.edit,
          BodyComponent = _this$props.BodyComponent,
          HeaderComponent = _this$props.HeaderComponent,
          FooterComponent = _this$props.FooterComponent,
          onClose = _this$props.onClose;
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsxs(HeaderComponent, {
          children: [/*#__PURE__*/_jsx(TaskFormHeader, {
            edit: edit
          }), onClose && /*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: onClose
          })]
        }), /*#__PURE__*/_jsx(BodyComponent, {
          children: /*#__PURE__*/_jsx(UIErrorMessage, {
            title: title,
            children: children
          })
        }), /*#__PURE__*/_jsx(FooterComponent, {
          children: this.renderFooter()
        })]
      });
    }
  }]);

  return TaskFormError;
}(PureComponent);

TaskFormError.propTypes = {
  edit: PropTypes.bool,
  buttonTypes: PropTypes.arrayOf(PropTypes.oneOf([CREATE, CREATE_AND_ADD_ANOTHER, CANCEL, SAVE, DELETE])),
  onClose: PropTypes.func,
  BodyComponent: PropTypes.elementType,
  HeaderComponent: PropTypes.elementType,
  FooterComponent: PropTypes.elementType,
  title: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};
TaskFormError.defaultProps = {
  BodyComponent: function BodyComponent(_ref) {
    var children = _ref.children;
    return /*#__PURE__*/_jsx(UIPanelBody, {
      children: /*#__PURE__*/_jsx(UIPanelSection, {
        children: children
      })
    });
  },
  HeaderComponent: UIPanelHeader,
  FooterComponent: UIPanelFooter,
  buttonTypes: [CREATE, CREATE_AND_ADD_ANOTHER, CANCEL]
};
export { TaskFormError as default };