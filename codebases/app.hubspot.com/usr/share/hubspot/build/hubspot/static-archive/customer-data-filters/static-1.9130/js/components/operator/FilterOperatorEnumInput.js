'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { List, Map as ImmutableMap } from 'immutable';
import { getTranslatedFieldLabel } from '../FieldTranslator';
import { listOf, recordOf } from 'react-immutable-proptypes';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import FilterFieldType from '../propTypes/FilterFieldType';
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import PropTypes from 'prop-types';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import ReferenceInputEnum from 'customer-data-reference-ui-components/ReferenceInputEnum';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import UIFormControl from 'UIComponents/form/UIFormControl';
import isEmpty from 'transmute/isEmpty';
import map from 'transmute/map';
import pipe from 'transmute/pipe';
import toJS from 'transmute/toJS';
import translate from 'transmute/translate';
import I18n from 'I18n';
import { getTransferableProps } from './filterInputProps';
import { isExternalOptionsField } from '../../utilities/isExternalOptionsField';
import FilterOperatorExternalOptionInput from './FilterOperatorExternalOptionInput';
import ReferenceResolverLiteType from 'reference-resolvers-lite/components/proptypes/ReferenceResolverLiteType';
var toTranslatedOptions = pipe(map(translate({
  help: function help(property) {
    return getTranslatedFieldLabel(property.label, property.description);
  },
  text: function text(property) {
    return propertyLabelTranslator(property.label);
  },
  value: true
})), toJS);

var tryConvertMapToPropertyOptionRecord = function tryConvertMapToPropertyOptionRecord(m) {
  return ImmutableMap.isMap(m) ? PropertyOptionRecord(m.toJS()) : m;
};

var getOptions = function getOptions(field, options, specialOptions, resolver) {
  // Some resolvers supply a map. When a map is provided the label is lost,
  // so we must convert them to PropertyOptionRecords
  var safeOptions = options && options.map(tryConvertMapToPropertyOptionRecord);

  if (resolver) {
    return List.isList(specialOptions) ? specialOptions : List();
  }

  if (List.isList(safeOptions) && List.isList(specialOptions)) {
    return specialOptions.concat(safeOptions);
  }

  if (isEmpty(safeOptions) && List.isList(specialOptions)) {
    return specialOptions;
  }

  if (field && field.hubspotDefined) {
    return toTranslatedOptions(safeOptions) || List();
  }

  return safeOptions || List();
};

export default function FilterOperatorEnumInput(_ref) {
  var error = _ref.error,
      field = _ref.field,
      filterFamily = _ref.filterFamily,
      isXoEnabled = _ref.isXoEnabled,
      options = _ref.options,
      resolver = _ref.resolver,
      specialOptions = _ref.specialOptions,
      rest = _objectWithoutProperties(_ref, ["error", "field", "filterFamily", "isXoEnabled", "options", "resolver", "specialOptions"]);

  var isError = error.get('error');
  var errorMessage = error.get('message');
  var SelectComponent = isExternalOptionsField(field, filterFamily) ? FilterOperatorExternalOptionInput : ReferenceInputEnum;
  return /*#__PURE__*/_jsx(UIFormControl, {
    "aria-label": I18n.text('customerDataFilters.FilterOperatorInput.ariaLabel'),
    error: isError,
    validationMessage: isError ? errorMessage : null,
    children: /*#__PURE__*/_jsx(SelectComponent, Object.assign({}, getTransferableProps(rest, {
      multi: true
    }), {
      menuWidth: isXoEnabled ? 0 : 'auto',
      options: getOptions(field, options, specialOptions, resolver),
      resolver: resolver
    }))
  });
}
FilterOperatorEnumInput.propTypes = {
  error: FilterOperatorErrorType.isRequired,
  field: FilterFieldType,
  filterFamily: PropTypes.string.isRequired,
  isXoEnabled: PropTypes.bool,
  options: listOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  resolver: PropTypes.oneOfType([ReferenceResolverType, ReferenceResolverLiteType]),
  specialOptions: listOf(recordOf({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }))
};