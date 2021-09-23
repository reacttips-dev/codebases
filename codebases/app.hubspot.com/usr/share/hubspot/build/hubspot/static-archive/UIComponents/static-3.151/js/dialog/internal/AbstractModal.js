'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { makeEventRelay } from '../../core/EventRelay';
import memoizeOne from 'react-utils/memoizeOne';
import UIModalDialog from '../UIModalDialog';
import UIFullScreen from '../UIFullScreen';
import getTransitionProps from './getTransitionProps';

var AbstractModal = /*#__PURE__*/function (_Component) {
  _inherits(AbstractModal, _Component);

  function AbstractModal(props) {
    var _this;

    _classCallCheck(this, AbstractModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractModal).call(this, props));
    _this._closeStartRelay = makeEventRelay();
    _this._openCompleteRelay = makeEventRelay();
    _this._getTransitionProps = memoizeOne(getTransitionProps);
    return _this;
  }

  _createClass(AbstractModal, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          componentName = _this$props.componentName,
          _contextual = _this$props._contextual,
          ModalDialog = _this$props.ModalDialog,
          onOpenStart = _this$props.onOpenStart,
          onOpenComplete = _this$props.onOpenComplete,
          onCloseStart = _this$props.onCloseStart,
          onCloseComplete = _this$props.onCloseComplete,
          Transition = _this$props.Transition,
          rootNode = _this$props.rootNode,
          rest = _objectWithoutProperties(_this$props, ["componentName", "_contextual", "ModalDialog", "onOpenStart", "onOpenComplete", "onCloseStart", "onCloseComplete", "Transition", "rootNode"]);

      var sandboxed = _contextual || this.context.sandboxed;

      var renderedModalDialog = /*#__PURE__*/_jsx(ModalDialog, Object.assign({}, rest, {
        contextual: _contextual,
        _openCompleteRelay: sandboxed ? null : this._openCompleteRelay,
        _closeStartRelay: sandboxed ? null : this._closeStartRelay
      }));

      return sandboxed ? renderedModalDialog : /*#__PURE__*/_jsx(UIFullScreen, {
        "data-layer-for": componentName,
        rootNode: rootNode,
        Transition: Transition,
        transitionProps: this._getTransitionProps(onOpenStart, this._openCompleteRelay.getHandle(onOpenComplete), this._closeStartRelay.getHandle(onCloseStart), onCloseComplete),
        children: renderedModalDialog
      });
    }
  }]);

  return AbstractModal;
}(Component);

export { AbstractModal as default };
AbstractModal.propTypes = {
  componentName: PropTypes.string.isRequired,
  _contextual: PropTypes.bool,
  ModalDialog: PropTypes.elementType.isRequired,
  onOpenStart: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onCloseStart: PropTypes.func,
  onCloseComplete: PropTypes.func,
  rootNode: UIFullScreen.propTypes.rootNode,
  Transition: PropTypes.elementType
};
AbstractModal.contextTypes = {
  sandboxed: PropTypes.bool
};
AbstractModal.defaultProps = {
  ModalDialog: UIModalDialog
};
AbstractModal.displayName = 'AbstractModal';