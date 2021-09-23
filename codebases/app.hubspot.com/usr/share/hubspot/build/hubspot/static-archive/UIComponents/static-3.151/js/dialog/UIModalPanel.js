'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import omit from '../utils/underscore/omit';
import UIModalDialog from './UIModalDialog';
import { hidden } from '../utils/propTypes/decorators';
import * as PanelContext from '../context/PanelContext';
import ModalPanelTransition from './internal/ModalPanelTransition';
import AbstractModal from './internal/AbstractModal';
import { callIfPossible } from '../core/Functions';
import { isSafari } from '../utils/BrowserTest';
import { createPlacementWarning, DropdownContext } from '../context/DropdownContext';
var inPanelContext = {
  inPanel: true
};

var UIModalPanel = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIModalPanel, _PureComponent);

  function UIModalPanel() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIModalPanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIModalPanel)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleOpenComplete = function () {
      var onOpenComplete = _this.props.onOpenComplete;
      callIfPossible(onOpenComplete);

      if (isSafari()) {
        _this._autoFocusedEl.focus();
      }
    };

    return _this;
  }

  _createClass(UIModalPanel, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Safari glitches the transition if an element in the modal panel is focused (#6033)
      if (isSafari()) {
        this._autoFocusedEl = document.activeElement;

        this._autoFocusedEl.blur();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var shouldLogModalWarning = this.context.shouldLogModalWarning,
          _this$props = this.props,
          __panelKey = _this$props.panelKey,
          width = _this$props.width,
          rest = _objectWithoutProperties(_this$props, ["panelKey", "width"]);

      var _createPlacementWarning = createPlacementWarning(UIModalPanel.displayName);

      if (shouldLogModalWarning) {
        _createPlacementWarning();
      }

      return /*#__PURE__*/_jsx(PanelContext.Provider, {
        value: inPanelContext,
        children: /*#__PURE__*/_jsx(AbstractModal, Object.assign({}, rest, {
          _use: "sidebar",
          _dialogWidth: width,
          componentName: "UIModalPanel",
          Transition: ModalPanelTransition,
          onOpenComplete: this.handleOpenComplete
        }))
      });
    }
  }]);

  return UIModalPanel;
}(PureComponent);

UIModalPanel.propTypes = Object.assign({}, omit(UIModalDialog.propTypes, ['centered', 'size', 'use']), {
  onCloseComplete: PropTypes.func,
  onCloseStart: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onOpenStart: PropTypes.func,
  panelKey: hidden(PropTypes.string),
  _contextual: PropTypes.bool,
  rootNode: AbstractModal.propTypes.rootNode
});
UIModalPanel.defaultProps = {
  width: 700,
  _contextual: false
};
UIModalPanel.displayName = 'UIModalPanel';
UIModalPanel.contextType = DropdownContext;
export default UIModalPanel;