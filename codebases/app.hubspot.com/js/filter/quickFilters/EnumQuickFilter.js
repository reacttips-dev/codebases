'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import I18n from 'I18n';
import { IN, NOT_KNOWN } from 'customer-data-filters/converters/contactSearch/FilterContactSearchOperatorTypes';
import { Map as ImmutableMap, List } from 'immutable';
import ConnectReferenceResolvers from 'reference-resolvers/ConnectReferenceResolvers';
import In from 'customer-data-filters/filterQueryFormat/operator/In';
import NotKnown from 'customer-data-filters/filterQueryFormat/operator/NotKnown';
import PropTypes from 'prop-types';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import PropertyNameToReferencedObjectType from 'customer-data-reference-ui-components/property/PropertyNameToReferencedObjectType';
import PropertyType from 'customer-data-objects-ui-components/propTypes/PropertyType';
import ReferenceInputEnum from 'customer-data-reference-ui-components/ReferenceInputEnum';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import toJS from 'transmute/toJS';
import * as specialFilterOptions from '../utils/specialFilterOptions';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import UITruncateString from 'UIComponents/text/UITruncateString';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UISelect from 'UIComponents/input/UISelect';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { isPropertySupportedByExternalOptions } from 'customer-data-objects/property/PropertyIdentifier';
import { normalizeTypeId } from '../../utils/normalizeTypeId';
import ExternalOptionEnumQuickFilter from './ExternalOptionEnumQuickFilter';

var getReferencedObjectType = function getReferencedObjectType(property, objectType) {
  var propertyName = get('name', property);
  return getIn([objectType, propertyName], PropertyNameToReferencedObjectType) || get('referencedObjectType', property);
};

var getFormattedOptions = function getFormattedOptions(property, objectType, disabled) {
  var specialOptionsByReferenceType = specialFilterOptions.getSpecialOptionsByReferenceType();
  var referencedObjectType = getReferencedObjectType(property, objectType);

  if (Object.prototype.hasOwnProperty.call(specialOptionsByReferenceType, referencedObjectType)) {
    var optionsRecord = specialOptionsByReferenceType[referencedObjectType]().map(function (option) {
      return PropertyOptionRecord({
        icon: option.icon,
        label: option.label,
        description: option.description,
        value: option.value,
        disabled: disabled
      });
    });
    return List(optionsRecord);
  }

  return property.options.reduce(function (accumulator, option) {
    var label = get('label', option);
    var translatedLabel = property.hubspotDefined ? propertyLabelTranslator(label) : label;
    accumulator.push({
      text: translatedLabel,
      value: get('value', option),
      disabled: disabled
    });
    return accumulator;
  }, []);
};

var getFilterValue = function getFilterValue(filter, operatorType) {
  if (operatorType === NOT_KNOWN) return List(['__hs__NONE']);
  return get('value', filter) || get('values', filter);
};

var checkIfOperatorSupported = function checkIfOperatorSupported(operatorType) {
  return operatorType === IN || operatorType === NOT_KNOWN;
};

var isNoneOptionChecked = function isNoneOptionChecked(filter) {
  if (filter && ImmutableMap.isMap(filter)) return filter.get('operator') === NOT_KNOWN;
  return filter ? filter['operator'] === NOT_KNOWN : false;
};

export var EnumQuickFilter = function EnumQuickFilter(props) {
  var filter = props.filter,
      objectType = props.objectType,
      onValueChange = props.onValueChange,
      property = props.property,
      resolver = props.resolver;

  var _useState = useState(isNoneOptionChecked(filter)),
      _useState2 = _slicedToArray(_useState, 2),
      noneOptionChecked = _useState2[0],
      setNoneOption = _useState2[1];

  useEffect(function () {
    setNoneOption(isNoneOptionChecked(filter));
  }, [filter]);

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isOpen = _useState4[0],
      setOpen = _useState4[1];

  var operatorType = get('operator', filter); // If the operator type is not supported in the quick filter then we don't
  // want to use the quick filter, it will show up in the advanced panel

  var value = checkIfOperatorSupported(operatorType) ? getFilterValue(filter, operatorType) : undefined;
  var options = getFormattedOptions(property, objectType, noneOptionChecked);
  var numberOfSelectedOptions = value && value.size ? value.size : 0;

  var renderButtonContent = function renderButtonContent() {
    var label = property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label;
    return /*#__PURE__*/_jsx(UITruncateString, {
      maxWidth: 120,
      children: numberOfSelectedOptions > 0 ? I18n.text('indexPage.quickFilters.enum.activeDisplay', {
        label: label,
        value: numberOfSelectedOptions
      }) : label
    });
  };

  var onEnumValueChange = useCallback(function (_ref) {
    var newValue = _ref.target.value;
    var filterQueryFormat = null;

    if (newValue) {
      // filters only accepts immutable values, so we should ensure these values are immutable objects
      // see: https://issues.hubspotcentral.com/browse/CRM-28019
      var immutableNewValue = List(newValue);

      if (immutableNewValue.get(0) === '__hs__NONE') {
        filterQueryFormat = NotKnown.of(property);
      } else {
        filterQueryFormat = !immutableNewValue.isEmpty() ? In.of(property, immutableNewValue) : null;
      }
    }

    onValueChange(property.name, filterQueryFormat);
  }, [onValueChange, property]);
  var handleOnChange = useCallback(function (_ref2) {
    var checked = _ref2.target.checked;
    onEnumValueChange({
      target: {
        value: checked ? List.of('__hs__NONE') : null
      }
    });
    setNoneOption(checked);
    setOpen(true);
  }, [onEnumValueChange]);

  var handleOpenChange = function handleOpenChange(_ref3) {
    var open = _ref3.target.value;
    return setOpen(open);
  };

  var isExternalOptionsFilter = isPropertySupportedByExternalOptions({
    property: property,
    objectTypeId: normalizeTypeId(objectType)
  });
  var UnassignedDropdownFooter = useMemo(function () {
    return /*#__PURE__*/_jsx(UICheckbox, {
      "data-selenium-test": "quickfilters-unassigned",
      checked: noneOptionChecked,
      onChange: handleOnChange,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "indexPage.quickFilters.enum.unknown"
      })
    });
  }, [noneOptionChecked, handleOnChange]);

  if (isExternalOptionsFilter) {
    return (
      /*#__PURE__*/
      // bizarrely enough, this <label> tag is required for every quick filter but this one, but I've wrapped it for consistency anyway
      _jsx("label", {
        children: /*#__PURE__*/_jsx(ExternalOptionEnumQuickFilter, {
          dropdownFooter: UnassignedDropdownFooter,
          buttonUse: "transparent",
          "data-selenium-test": "quickfilters-" + property.name,
          menuWidth: "auto",
          open: isOpen,
          objectTypeId: normalizeTypeId(objectType),
          onChange: onEnumValueChange,
          options: options,
          optionFormatter: function optionFormatter(record) {
            var option = ReferenceRecord.toOption(record);
            return Object.assign({}, option, {
              disabled: noneOptionChecked
            });
          },
          property: property,
          placeholder: property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label,
          value: value
        }, noneOptionChecked ? 'none' : 'all')
      })
    );
  } // UISelect expects plain JS arrays, so we have to optimistically convert Lists to arrays


  if (!resolver) {
    var jsValue = toJS(value);
    var jsOptions = toJS(options);
    return /*#__PURE__*/_jsx("label", {
      children: /*#__PURE__*/_jsx(UISelect, {
        anchorType: "button",
        ButtonContent: renderButtonContent,
        buttonUse: "transparent",
        clearable: true,
        "data-selenium-test": "quickfilters-" + property.name,
        dropdownFooter: UnassignedDropdownFooter,
        menuWidth: "auto",
        multi: true,
        open: isOpen,
        onChange: onEnumValueChange,
        onOpenChange: handleOpenChange,
        options: jsOptions,
        optionFormatter: function optionFormatter(record) {
          var option = ReferenceRecord.toOption(record);
          return Object.assign({}, option, {
            disabled: noneOptionChecked
          });
        },
        placeholder: property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label,
        value: jsValue
      }, noneOptionChecked ? 'none' : 'all')
    });
  }

  return /*#__PURE__*/_jsx("label", {
    children: /*#__PURE__*/_jsx(ReferenceInputEnum // this component uses `resolver` to resolve options if provided, uses `options` otherwise
    , {
      dropdownFooter: UnassignedDropdownFooter,
      open: isOpen,
      onOpenChange: handleOpenChange,
      "data-selenium-test": "quickfilters-" + property.name,
      ButtonContent: renderButtonContent,
      showTags: false,
      buttonUse: "transparent",
      clearable: true,
      menuWidth: "auto",
      multi: true,
      onChange: onEnumValueChange,
      options: options,
      optionFormatter: function optionFormatter(record) {
        var option = ReferenceRecord.toOption(record);
        return Object.assign({}, option, {
          disabled: noneOptionChecked
        });
      },
      placeholder: property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label,
      resolver: resolver,
      value: value
    }, noneOptionChecked ? 'none' : 'all')
  });
};
EnumQuickFilter.propTypes = {
  filter: PropTypes.object,
  // use FQF object?
  // Used in mapResolversToProps
  // eslint-disable-next-line react/no-unused-prop-types
  objectType: AnyCrmObjectTypePropType.isRequired,
  onValueChange: PropTypes.func.isRequired,
  property: PropertyType.isRequired,
  resolver: ReferenceResolverType
};
export var mapResolversToProps = function mapResolversToProps(resolvers, _ref4) {
  var objectType = _ref4.objectType,
      property = _ref4.property;
  var referencedObjectType = getReferencedObjectType(property, objectType);

  if (!referencedObjectType) {
    return undefined;
  }

  return {
    resolver: resolvers[ReferenceObjectTypes[referencedObjectType]]
  };
};
export default ConnectReferenceResolvers(mapResolversToProps, EnumQuickFilter);