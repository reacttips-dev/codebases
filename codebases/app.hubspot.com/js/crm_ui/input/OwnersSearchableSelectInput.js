'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { connect } from 'general-store';
import LegacyOwnersStore from 'crm_data/owners/LegacyOwnersStore';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import * as FormatOwnerName from 'customer-data-objects/owners/FormatOwnerName';
import UISelect from 'UIComponents/input/UISelect';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
var NO_OWNER_VALUE = '';

var _getOwnersOptions = function _getOwnersOptions(owners, _ref) {
  var provideAllOption = _ref.provideAllOption,
      provideNoneOption = _ref.provideNoneOption;

  if (owners == null || owners.size === 0) {
    return [];
  }

  var options = owners.toArray().map(function (owner) {
    return {
      objectType: CONTACT,
      text: FormatOwnerName.formatWithEmail(owner),
      value: String(owner.ownerId)
    };
  });

  if (provideAllOption) {
    options.unshift({
      text: I18n.text('ownersSearchableSelectInput.all'),
      value: 'all'
    });
  }

  if (provideNoneOption) {
    options.unshift({
      text: I18n.text('ownersSearchableSelectInput.noOwner'),
      value: NO_OWNER_VALUE
    });
  }

  return options;
};
/**
 * @deprecated use OwnerSelect instead of this component
 *
 * customer-data-objects-ui-components/owners/OwnerSelect
 */


var OwnersSearchableSelectInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(OwnersSearchableSelectInput, _PureComponent);

  function OwnersSearchableSelectInput() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, OwnersSearchableSelectInput);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(OwnersSearchableSelectInput)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleChange = function (_ref2) {
      var value = _ref2.target.value.value;
      return _this.props.onChange(value);
    };

    return _this;
  }

  _createClass(OwnersSearchableSelectInput, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          provideNoneOption = _this$props.provideNoneOption,
          ownersOptions = _this$props.ownersOptions,
          value = _this$props.value,
          disabled = _this$props.disabled;
      var placeholder = provideNoneOption ? I18n.text('ownersSearchableSelectInput.noOwner') : this.props.placeholder;
      return /*#__PURE__*/_jsx(UISelect, {
        "data-selenium-test": "owner-select",
        className: "avatar-select",
        onSelectedOptionChange: this.handleChange,
        options: ownersOptions,
        value: value,
        placeholder: placeholder,
        menuWidth: "auto",
        disabled: disabled
      });
    }
  }]);

  return OwnersSearchableSelectInput;
}(PureComponent);

OwnersSearchableSelectInput.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  ownersOptions: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  provideNoneOption: PropTypes.bool,
  value: PropTypes.string
};
OwnersSearchableSelectInput.defaultProps = {
  provideNoneOption: false
};
export default connect({
  ownersOptions: {
    propTypes: {
      provideAllOption: PropTypes.bool,
      provideNoneOption: PropTypes.bool
    },
    stores: [LegacyOwnersStore],
    deref: function deref(_ref3) {
      var _ref3$provideAllOptio = _ref3.provideAllOption,
          provideAllOption = _ref3$provideAllOptio === void 0 ? false : _ref3$provideAllOptio,
          provideNoneOption = _ref3.provideNoneOption;
      var owners = LegacyOwnersStore.get();

      if (!owners) {
        return [];
      }

      return _getOwnersOptions(owners, {
        provideAllOption: provideAllOption,
        provideNoneOption: provideNoneOption
      });
    }
  }
})(OwnersSearchableSelectInput);