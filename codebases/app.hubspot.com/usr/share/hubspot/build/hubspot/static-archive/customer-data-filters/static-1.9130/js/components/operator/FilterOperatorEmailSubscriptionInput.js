'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import { listOf, recordOf } from 'react-immutable-proptypes';
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import ReferenceInputEnum from 'customer-data-reference-ui-components/ReferenceInputEnum';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import UIFormControl from 'UIComponents/form/UIFormControl';
import isEmpty from 'transmute/isEmpty';
import { getTransferableProps } from './filterInputProps';

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

var formatOption = function formatOption(group) {
  var label = group.get('id') === 'DEFAULT' ? I18n.text('customerDataFilters.FilterOperatorEmailSubscriptionInput.defaultSubscriptionTypes') : group.get('label');
  return {
    text: label,
    options: group.getIn(['referencedObject', 'translatedSubscriptionDefinitions']).reduce(function (options, type) {
      return [].concat(_toConsumableArray(options), [{
        text: type.getIn(['subscriptionDefinition', 'name']),
        value: "" + type.getIn(['subscriptionDefinition', 'id']),
        help: type.getIn(['subscriptionDefinition', 'description'])
      }]);
    }, [])
  };
};

export default function FilterOperatorEmailSubscriptionInput(_ref) {
  var error = _ref.error,
      options = _ref.options,
      resolver = _ref.resolver,
      specialOptions = _ref.specialOptions,
      rest = _objectWithoutProperties(_ref, ["error", "options", "resolver", "specialOptions"]);

  var isError = error.get('error');
  var errorMessage = error.get('message');
  return /*#__PURE__*/_jsx(UIFormControl, {
    "aria-label": I18n.text('customerDataFilters.FilterOperatorInput.ariaLabel'),
    error: isError,
    validationMessage: isError ? errorMessage : null,
    children: /*#__PURE__*/_jsx(ReferenceInputEnum, Object.assign({}, getTransferableProps(rest, {
      multi: true
    }), {
      menuWidth: "auto",
      optionFormatter: formatOption,
      options: getOptions(options, specialOptions, resolver),
      resolver: resolver
    }))
  });
}
FilterOperatorEmailSubscriptionInput.propTypes = {
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