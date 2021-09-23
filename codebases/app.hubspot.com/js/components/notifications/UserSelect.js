'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import I18n from 'I18n';
import { memoize } from 'underscore';
import UISelect from 'UIComponents/input/UISelect';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import { usersProp } from '../../lib/propTypes';

var UserSelect = /*#__PURE__*/function (_PureComponent) {
  _inherits(UserSelect, _PureComponent);

  function UserSelect() {
    _classCallCheck(this, UserSelect);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserSelect).apply(this, arguments));
  }

  _createClass(UserSelect, [{
    key: "render",
    value: function render() {
      var options = UserSelect.getOptions(this.props.users, this.props.showEmail);

      if (!options.length) {
        return null;
      }

      return /*#__PURE__*/_jsx(UISelect, {
        className: "user-select",
        placeholder: I18n.text('sui.filters.createdBy.placeholder'),
        options: options,
        value: this.props.value,
        clearable: true,
        buttonUse: "transparent",
        menuWidth: "auto",
        onChange: this.props.onChange
      });
    }
  }]);

  return UserSelect;
}(PureComponent);

UserSelect.propTypes = {
  users: usersProp,
  value: PropTypes.number,
  showEmail: PropTypes.bool,
  onChange: PropTypes.func
};
UserSelect.defaultProps = {
  showEmail: false
};
UserSelect.getOptions = memoize(function (users, showEmail) {
  var showAvatar = users.size < 100;
  return users.map(function (u) {
    var text = showEmail ? u.getFullName() + " (" + u.email + ")" : u.getFullName();
    var avatar;

    if (showAvatar) {
      avatar = /*#__PURE__*/_jsx(UIAvatar, {
        lookup: {
          type: 'hubSpotUserEmail',
          primaryIdentifier: u.email
        },
        size: "xs"
      });
    }

    return {
      value: u.id,
      avatar: avatar,
      text: text
    };
  }).toArray();
});
export { UserSelect as default };