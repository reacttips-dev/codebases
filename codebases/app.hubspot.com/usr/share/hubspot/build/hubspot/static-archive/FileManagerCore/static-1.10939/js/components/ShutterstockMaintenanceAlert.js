'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { getIsUngatedForShutterstockMaintenance } from '../selectors/Auth';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import FormattedDateTime from 'I18n/components/FormattedDateTime';
import UIAlert from 'UIComponents/alert/UIAlert';

function getI18nKey(suffix) {
  return "FileManagerCore.shutterstockMaintenanceAlert." + suffix;
}

var ShutterstockMaintenanceAlert = /*#__PURE__*/function (_Component) {
  _inherits(ShutterstockMaintenanceAlert, _Component);

  function ShutterstockMaintenanceAlert() {
    _classCallCheck(this, ShutterstockMaintenanceAlert);

    return _possibleConstructorReturn(this, _getPrototypeOf(ShutterstockMaintenanceAlert).apply(this, arguments));
  }

  _createClass(ShutterstockMaintenanceAlert, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          isUngatedForShutterstockMaintenance = _this$props.isUngatedForShutterstockMaintenance,
          className = _this$props.className,
          useShortVersion = _this$props.useShortVersion;

      if (isUngatedForShutterstockMaintenance) {
        return /*#__PURE__*/_jsx(UIAlert, {
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: getI18nKey('title')
          }),
          type: "warning",
          className: className,
          children: /*#__PURE__*/_jsx(FormattedReactMessage, {
            message: useShortVersion ? getI18nKey('shortContent') : getI18nKey('content'),
            options: {
              date: /*#__PURE__*/_jsx(FormattedDateTime, {
                value: 1589587200000,
                format: "LLLL"
              })
            }
          })
        });
      }

      return null;
    }
  }]);

  return ShutterstockMaintenanceAlert;
}(Component);

ShutterstockMaintenanceAlert.propTypes = {
  className: PropTypes.string,
  useShortVersion: PropTypes.bool,
  isUngatedForShutterstockMaintenance: PropTypes.bool.isRequired
};
ShutterstockMaintenanceAlert.defaultProps = {
  useShortVersion: false
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    isUngatedForShutterstockMaintenance: getIsUngatedForShutterstockMaintenance(state)
  };
};

export default connect(mapStateToProps)(ShutterstockMaintenanceAlert);