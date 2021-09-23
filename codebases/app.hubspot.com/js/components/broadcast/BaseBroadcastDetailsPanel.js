'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIPanelBody from 'UIComponents/panel/UIPanelBody';
import UIPanelFooter from 'UIComponents/panel/UIPanelFooter';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import UIPanel from 'UIComponents/panel/UIPanel';
import { BROADCAST_DETAILS_PANEL_WIDTH } from '../../lib/constants';
import { accountTypeProp, broadcastProp } from '../../lib/propTypes';

var BaseBroadcastDetailsPanel = /*#__PURE__*/function (_PureComponent) {
  _inherits(BaseBroadcastDetailsPanel, _PureComponent);

  function BaseBroadcastDetailsPanel() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, BaseBroadcastDetailsPanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BaseBroadcastDetailsPanel)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onClose = function () {
      _this.props.onClose();
    };

    return _this;
  }

  _createClass(BaseBroadcastDetailsPanel, [{
    key: "renderBody",
    value: function renderBody() {
      return null;
    }
  }, {
    key: "renderFooter",
    value: function renderFooter() {
      return null;
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var footer = this.renderFooter();
      return /*#__PURE__*/_jsxs(UIPanel, {
        className: "broadcast-details-panel",
        width: BROADCAST_DETAILS_PANEL_WIDTH,
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: this.onClose
        }), /*#__PURE__*/_jsx(UIPanelHeader, {
          children: this.renderHeader()
        }), /*#__PURE__*/_jsx(UIPanelBody, {
          children: this.renderBody()
        }), footer && /*#__PURE__*/_jsx(UIPanelFooter, {
          children: footer
        })]
      });
    }
  }]);

  return BaseBroadcastDetailsPanel;
}(PureComponent);

BaseBroadcastDetailsPanel.propTypes = {
  broadcast: broadcastProp,
  network: accountTypeProp,
  onClose: PropTypes.func.isRequired,
  portalId: PropTypes.number.isRequired,
  trackInteraction: PropTypes.func.isRequired
};
export { BaseBroadcastDetailsPanel as default };