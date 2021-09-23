'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIPopoverHeader from 'UIComponents/tooltip/UIPopoverHeader';
import UIPopoverBody from 'UIComponents/tooltip/UIPopoverBody';
import H5 from 'UIComponents/elements/headings/H5';
import UIList from 'UIComponents/list/UIList';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import PropertyInputMultipleDomainInput from './PropertyInputMultipleDomainInput';
import PropertyInputMultipleDomainNewValue from './PropertyInputMultipleDomainNewValue';
import { CALYPSO_DARK } from 'HubStyleTokens/colors';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import styled from 'styled-components';
var propTypes = {
  domains: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  objectType: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyUp: PropTypes.func,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  subject: PropTypes.instanceOf(CompanyRecord),
  subjectId: PropTypes.string,
  onUpdatePrimaryDomain: PropTypes.func.isRequired,
  onUpdateSecondaryDomain: PropTypes.func.isRequired,
  onRemoveDomain: PropTypes.func.isRequired,
  onPromoteDomain: PropTypes.func.isRequired,
  onAddNewDomain: PropTypes.func.isRequired
};
var SizeRestrictedUIPopoverBody = styled(UIPopoverBody).withConfig({
  displayName: "PropertyInputMultipleDomainPopoverContent__SizeRestrictedUIPopoverBody",
  componentId: "sc-1ft9rp2-0"
})(["max-height:50vh;overflow-y:auto;"]);

function PropertyInputMultipleDomainPopoverContent(_ref) {
  var domains = _ref.domains,
      readOnly = _ref.readOnly,
      disabled = _ref.disabled,
      objectType = _ref.objectType,
      onBlur = _ref.onBlur,
      onFocus = _ref.onFocus,
      onKeyUp = _ref.onKeyUp,
      property = _ref.property,
      subject = _ref.subject,
      subjectId = _ref.subjectId,
      onUpdatePrimaryDomain = _ref.onUpdatePrimaryDomain,
      onUpdateSecondaryDomain = _ref.onUpdateSecondaryDomain,
      onRemoveDomain = _ref.onRemoveDomain,
      onPromoteDomain = _ref.onPromoteDomain,
      onAddNewDomain = _ref.onAddNewDomain;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showNewDomainInput = _useState2[0],
      setShowNewDomainInput = _useState2[1];

  var handleAddNewDomainInput = function handleAddNewDomainInput() {
    return setShowNewDomainInput(true);
  };

  var handleCancelNewDomainInput = function handleCancelNewDomainInput() {
    return setShowNewDomainInput(false);
  };

  var handleSaveNewDomain = function handleSaveNewDomain(newDomain) {
    onAddNewDomain(newDomain);
    setShowNewDomainInput(false);
  };

  var renderDomainInput = function renderDomainInput(domain, index) {
    var isPrimary = index === 0;
    return /*#__PURE__*/_jsx(PropertyInputMultipleDomainInput, {
      autoFocus: isPrimary,
      isInline: false,
      objectType: objectType,
      onBlur: onBlur,
      onChange: isPrimary ? onUpdatePrimaryDomain : function (_value) {
        return onUpdateSecondaryDomain(index, _value);
      },
      onFocus: onFocus,
      onKeyUp: onKeyUp,
      property: property,
      readOnly: readOnly,
      disabled: disabled,
      showError: true,
      subject: subject,
      subjectId: subjectId,
      value: domain,
      isPrimaryDomain: isPrimary,
      onDelete: onRemoveDomain,
      promoteToPrimary: onPromoteDomain
    }, index);
  };

  var addNewDomainButton = readOnly || disabled ? null : /*#__PURE__*/_jsxs(UIButton, {
    use: "transparent",
    onClick: handleAddNewDomainInput,
    className: "p-left-0",
    disabled: readOnly,
    children: [/*#__PURE__*/_jsx(UIIcon, {
      name: "add",
      size: "xxs",
      color: CALYPSO_DARK
    }), /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataProperties.PropertyInputMultipleDomain.addDomain"
    })]
  });
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(UIPopoverHeader, {
      children: /*#__PURE__*/_jsx(H5, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "customerDataProperties.PropertyInputMultipleDomain.label"
        })
      })
    }), /*#__PURE__*/_jsxs(SizeRestrictedUIPopoverBody, {
      children: [/*#__PURE__*/_jsxs(UIList, {
        childClassName: "m-bottom-2",
        children: [domains.map(renderDomainInput), showNewDomainInput ? /*#__PURE__*/_jsx(PropertyInputMultipleDomainNewValue, {
          domains: domains,
          onSave: handleSaveNewDomain,
          onCancel: handleCancelNewDomainInput
        }) : null]
      }), addNewDomainButton]
    })]
  });
}

PropertyInputMultipleDomainPopoverContent.propTypes = propTypes;
export default PropertyInputMultipleDomainPopoverContent;