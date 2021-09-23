'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import { getFrom, setFrom } from 'customer-data-filters/filterQueryFormat/LocalSettings';
import { isOnlyActiveSalesforceOwner } from 'customer-data-objects/owners/isActiveOwner';
import { listOf, recordOf } from 'react-immutable-proptypes';
import FilterOperatorErrorType from '../propTypes/FilterOperatorErrorType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import ReferenceInputEnum from 'customer-data-reference-ui-components/ReferenceInputEnum';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIFormControl from 'UIComponents/form/UIFormControl';
import isEmpty from 'transmute/isEmpty';

var ownerOptionFormatter = function ownerOptionFormatter(record) {
  var isActive = record.referencedObject.get('remoteList').some(function (remote) {
    return remote.get('active') === true;
  });
  var option = ReferenceRecord.toOption(record);

  if (isOnlyActiveSalesforceOwner(record.referencedObject)) {
    option.text = I18n.text('customerDataFilters.FilterOperatorOwnerInput.salesforceUser', {
      name: option.text
    });
  }

  return Object.assign({}, option, {
    help: isActive ? record.description : I18n.text('customerDataFilters.FilterOperatorOwnerInput.inactiveOwner', {
      email: record.description
    })
  });
};

var getOptions = function getOptions(options, specialOptions, resolver) {
  if (resolver) {
    return List.isList(specialOptions) ? specialOptions : List();
  }

  if (List.isList(options) && List.isList(specialOptions)) {
    return specialOptions.concat(options);
  }

  if (isEmpty(options) && List.isList(specialOptions)) {
    return specialOptions;
  }

  return options || List();
};

var FilterOperatorOwnerInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(FilterOperatorOwnerInput, _PureComponent);

  function FilterOperatorOwnerInput(props) {
    var _this;

    _classCallCheck(this, FilterOperatorOwnerInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterOperatorOwnerInput).call(this, props));

    _this.handleDeactivatedUsersChange = function (_ref) {
      var checked = _ref.target.checked;
      setFrom(window.localStorage, 'showInactiveOwners', "" + checked);

      _this.setState({
        open: true,
        showInactiveOwners: checked
      });
    };

    _this.handleOpenChange = function (_ref2) {
      var value = _ref2.target.value;

      _this.setState({
        open: value
      });
    };

    _this.state = {
      open: false,
      showInactiveOwners: getFrom(window.localStorage, 'showInactiveOwners') === 'true'
    };
    return _this;
  }

  _createClass(FilterOperatorOwnerInput, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          error = _this$props.error,
          options = _this$props.options,
          resolver = _this$props.resolver,
          specialOptions = _this$props.specialOptions,
          rest = _objectWithoutProperties(_this$props, ["error", "options", "resolver", "specialOptions"]);

      var _this$state = this.state,
          open = _this$state.open,
          showInactiveOwners = _this$state.showInactiveOwners;
      var isError = error.get('error');
      var errorMessage = error.get('message');
      return /*#__PURE__*/_jsx(UIFormControl, {
        error: isError,
        style: {
          width: '100%'
        },
        validationMessage: isError ? errorMessage : null,
        children: /*#__PURE__*/_createElement(ReferenceInputEnum, Object.assign({}, rest, {
          dropdownFooter: /*#__PURE__*/_jsx(UICheckbox, {
            checked: showInactiveOwners,
            onChange: this.handleDeactivatedUsersChange,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "customerDataFilters.FilterOperatorOwnerInput.showInactiveOwners"
            })
          }),
          key: showInactiveOwners ? 'all' : 'active',
          menuWidth: "auto",
          onOpenChange: this.handleOpenChange,
          open: open,
          optionFormatter: ownerOptionFormatter,
          options: getOptions(options, specialOptions, resolver),
          requestOptions: {
            includeInactive: showInactiveOwners
          },
          resolver: resolver
        }))
      });
    }
  }]);

  return FilterOperatorOwnerInput;
}(PureComponent);

FilterOperatorOwnerInput.propTypes = {
  error: FilterOperatorErrorType.isRequired,
  options: listOf(recordOf({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  resolver: ReferenceResolverType,
  specialOptions: listOf(recordOf({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }))
};
export default FilterOperatorOwnerInput;