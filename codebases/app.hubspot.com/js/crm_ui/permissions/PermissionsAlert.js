/*
   This is a WIP, we have various permission alerts that
   we can replace with this abstraction

   Currently addresses:
    - create ObjectTypes (right sidebar)

   Todo:
    - edit SubjectPermissions
*/
'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import PropTypes from 'prop-types';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import canCreate from '../utils/canCreate';
import { CREATE, EDIT } from './permissionsConstants';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import UIColumnWrapper from 'UIComponents/column/UIColumnWrapper';
import UIColumn from 'UIComponents/column/UIColumn';
import UIColumnSpreads from 'UIComponents/column/UIColumnSpreads';
import UIIcon from 'UIComponents/icon/UIIcon';
import { EERIE } from 'HubStyleTokens/colors';

var PermissionsAlert = /*#__PURE__*/function (_PureComponent) {
  _inherits(PermissionsAlert, _PureComponent);

  function PermissionsAlert() {
    _classCallCheck(this, PermissionsAlert);

    return _possibleConstructorReturn(this, _getPrototypeOf(PermissionsAlert).apply(this, arguments));
  }

  _createClass(PermissionsAlert, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          objectType = _this$props.objectType,
          actionType = _this$props.actionType,
          className = _this$props.className;

      var userHasPermission = function () {
        switch (actionType) {
          case CREATE:
            return canCreate(objectType);

          default:
            return true;
        }
      }();

      if (userHasPermission) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIColumnWrapper, {
        className: className,
        children: [/*#__PURE__*/_jsx(UIColumn, {
          children: /*#__PURE__*/_jsx(UIIcon, {
            className: "m-right-2",
            name: "info",
            size: "xxs",
            color: EERIE
          })
        }), /*#__PURE__*/_jsx(UIColumnSpreads, {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "permissionsAlert." + actionType.toLowerCase() + "." + objectType.toLowerCase()
          })
        })]
      });
    }
  }]);

  return PermissionsAlert;
}(PureComponent);

export { PermissionsAlert as default };
PermissionsAlert.propTypes = {
  objectType: ObjectTypesType.isRequired,
  actionType: PropTypes.oneOf([CREATE, EDIT]),
  className: PropTypes.string
};