'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import invariant from 'react-utils/invariant';
import set from 'transmute/set';
import identity from 'transmute/identity';
import classNames from 'classnames';
import { useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UITruncateString from 'UIComponents/text/UITruncateString';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import PropertyInputDomain from 'customer-data-properties/input/PropertyInputDomain';
import { parsePropertyValueToList, formatListToPropertyValue } from 'customer-data-objects/property/MultiValuePropertyHelpers';
import PropertyInputMultipleDomainPopoverContent from './PropertyInputMultipleDomainPopoverContent';
var propTypes = Object.assign({
  onSecondaryChange: PropTypes.func.isRequired,
  subject: PropTypes.instanceOf(CompanyRecord),
  subjectId: PropTypes.string,
  additionalDomains: PropTypes.string
}, PropertyInputDomain.propTypes);
var PropertyInputMultipleDomain = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var value = _ref.value,
      subject = _ref.subject,
      additionalDomains = _ref.additionalDomains,
      onSecondaryChange = _ref.onSecondaryChange,
      objectType = _ref.objectType,
      onBlur = _ref.onBlur,
      onFocus = _ref.onFocus,
      onKeyUp = _ref.onKeyUp,
      property = _ref.property,
      _ref$readOnly = _ref.readOnly,
      readOnly = _ref$readOnly === void 0 ? false : _ref$readOnly,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      subjectId = _ref.subjectId,
      onChange = _ref.onChange,
      className = _ref.className;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      popoverOpen = _useState2[0],
      setPopoverOpen = _useState2[1];

  var handleShowPopover = function handleShowPopover() {
    setPopoverOpen(function (isOpen) {
      return !isOpen;
    });
  };

  useImperativeHandle(ref, function () {
    return {
      focus: function focus() {
        setPopoverOpen(true);
      }
    };
  });
  var domains = useMemo(function () {
    var result = [value];

    if (!subject || !additionalDomains) {
      return result;
    }

    return [].concat(result, _toConsumableArray(parsePropertyValueToList(additionalDomains)));
  }, [value, subject, additionalDomains]);

  var handleUpdatePrimaryDomain = function handleUpdatePrimaryDomain(e) {
    var updatedValue = set(0, e.target.value, domains).filter(identity);
    var primaryDomainValue = updatedValue[0] || '';
    var secondaryDomainValue = formatListToPropertyValue(updatedValue.slice(1));
    onChange(SyntheticEvent(primaryDomainValue));

    if (secondaryDomainValue !== additionalDomains) {
      onSecondaryChange('hs_additional_domains', secondaryDomainValue);
    }
  };

  var handleRemoveDomain = function handleRemoveDomain(domainToRemove) {
    invariant(domains.length > 1, 'PropertyInputMultipleDomain: there must be more than one domain in order for one to be removed');
    var updatedValue = domains.filter(function (domain) {
      return domain !== domainToRemove;
    });
    var primaryDomainValue = updatedValue[0];
    var secondaryDomainValue = formatListToPropertyValue(updatedValue.slice(1));
    onChange(SyntheticEvent(primaryDomainValue));
    onSecondaryChange('hs_additional_domains', secondaryDomainValue);
  };

  var handlePromoteDomain = function handlePromoteDomain(domainToPromote) {
    var valueWithoutPromotedDomain = domains.filter(function (domain) {
      return domain !== domainToPromote;
    });
    var primaryDomainValue = domainToPromote;
    var secondaryDomainValue = formatListToPropertyValue(valueWithoutPromotedDomain);
    onChange(SyntheticEvent(primaryDomainValue));
    onSecondaryChange('hs_additional_domains', secondaryDomainValue);
  };

  var handleUpdateSecondaryDomain = function handleUpdateSecondaryDomain(index, e) {
    var updatedValue = set(index, e.target.value, domains);
    var secondaryDomainValue = formatListToPropertyValue(updatedValue.slice(1));
    onSecondaryChange('hs_additional_domains', secondaryDomainValue);
  };

  var handleAddNewDomain = function handleAddNewDomain(newDomain) {
    var updatedValue = [].concat(_toConsumableArray(domains), [newDomain]);
    var secondaryDomainValue = formatListToPropertyValue(updatedValue.slice(1));
    onSecondaryChange('hs_additional_domains', secondaryDomainValue);
  };

  var popoverContent = /*#__PURE__*/_jsx(PropertyInputMultipleDomainPopoverContent, {
    domains: domains,
    readOnly: readOnly,
    disabled: disabled,
    objectType: objectType,
    onBlur: onBlur,
    onFocus: onFocus,
    onKeyUp: onKeyUp,
    property: property,
    subject: subject,
    subjectId: subjectId,
    onUpdatePrimaryDomain: handleUpdatePrimaryDomain,
    onUpdateSecondaryDomain: handleUpdateSecondaryDomain,
    onRemoveDomain: handleRemoveDomain,
    onPromoteDomain: handlePromoteDomain,
    onAddNewDomain: handleAddNewDomain
  });

  var readOnlyValueClassNames = classNames(className, value === '' ? 'p-bottom-5' : 'p-top-1');
  return /*#__PURE__*/_jsx(UIGridItem, {
    size: {
      xs: 12
    },
    className: "p-x-0",
    children: /*#__PURE__*/_jsx(UIPopover, {
      open: popoverOpen,
      closeOnOutsideClick: true,
      onOpenChange: function onOpenChange(evt) {
        return setPopoverOpen(evt.target.value);
      },
      placement: "right",
      content: popoverContent,
      width: 350,
      children: /*#__PURE__*/_jsx("div", {
        "data-test-id": "domain-input",
        className: readOnlyValueClassNames,
        onClick: handleShowPopover,
        children: /*#__PURE__*/_jsx(UITruncateString, {
          children: I18n.formatList(domains)
        })
      })
    })
  });
});
PropertyInputMultipleDomain.propTypes = propTypes;
export default PropertyInputMultipleDomain;