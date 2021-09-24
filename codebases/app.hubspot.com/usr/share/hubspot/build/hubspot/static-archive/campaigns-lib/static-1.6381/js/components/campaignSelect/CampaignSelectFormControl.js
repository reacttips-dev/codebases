'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import CampaignSelect from 'campaigns-lib/components/CampaignSelect';
import passthroughProps from 'UIComponents/utils/propTypes/passthroughProps';
import { fetchIsCampaignAtLimit } from 'campaigns-lib/campaignsApi';
import { SUPPORTED_ASSET_OBJECTS_TYPES } from 'campaigns-lib/constants/campaignSelect';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
var InlineFormControl = styled(UIFormControl).withConfig({
  displayName: "CampaignSelectFormControl__InlineFormControl",
  componentId: "zdbo71-0"
})(["label{display:inline !important;}"]);

function CampaignSelectFormControl(_ref) {
  var hasCampaignsReadAccess = _ref.hasCampaignsReadAccess,
      hasCampaignsWriteAccess = _ref.hasCampaignsWriteAccess,
      _ref$showMissingAcces = _ref.showMissingAccessError,
      showMissingAccessError = _ref$showMissingAcces === void 0 ? false : _ref$showMissingAcces,
      value = _ref.value,
      onChange = _ref.onChange,
      _ref$formControlProps = _ref.formControlProps,
      formControlProps = _ref$formControlProps === void 0 ? {} : _ref$formControlProps,
      multi = _ref.multi,
      assetObjectType = _ref.assetObjectType,
      rest = _objectWithoutProperties(_ref, ["hasCampaignsReadAccess", "hasCampaignsWriteAccess", "showMissingAccessError", "value", "onChange", "formControlProps", "multi", "assetObjectType"]);

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      notFoundError = _useState2[0],
      setNotFoundError = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      limitError = _useState4[0],
      setLimitError = _useState4[1];

  var handleCurrentValueNotFound = function handleCurrentValueNotFound() {
    return setNotFoundError(true);
  };

  var handleChange = function handleChange() {
    setNotFoundError(false);
    setLimitError(false);
    var previousValue = value;

    for (var _len = arguments.length, data = new Array(_len), _key = 0; _key < _len; _key++) {
      data[_key] = arguments[_key];
    }

    onChange.apply(void 0, data);

    if (assetObjectType) {
      var selectedCampaign = multi ? data[1][data[1].length - 1] : data[1];

      if (selectedCampaign && selectedCampaign.guid) {
        fetchIsCampaignAtLimit({
          assetObjectType: assetObjectType,
          campaignGuid: selectedCampaign.guid
        }).then(function (isAtLimit) {
          setLimitError(isAtLimit);

          if (isAtLimit) {
            if (multi) {
              onChange(SyntheticEvent(previousValue), previousValue);
            } else {
              onChange(SyntheticEvent(''), {});
            }
          }
        });
      }
    }
  };

  var getValidationMessage = useCallback(function () {
    if (notFoundError && showMissingAccessError) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "campaignSelect.validationErrors.campaignNotFoundWithNoAccess"
      });
    } else if (notFoundError) {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "campaignSelect.validationErrors.campaignNotFound"
      });
    } else if (limitError) {
      if (SUPPORTED_ASSET_OBJECTS_TYPES.indexOf(assetObjectType) > -1) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "campaignSelect.validationErrors.limitError." + assetObjectType
        });
      } else {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "campaignSelect.validationErrors.limitError.generic"
        });
      }
    }

    return null;
  }, [assetObjectType, limitError, notFoundError, showMissingAccessError]);

  if (!hasCampaignsReadAccess) {
    return null;
  }

  console.log(formControlProps);
  return /*#__PURE__*/_jsx(InlineFormControl, {
    error: notFoundError || limitError || formControlProps.error,
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "campaignSelect.formControlLabel"
    }),
    tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "campaignSelect.formControlTooltip"
    }),
    validationMessage: getValidationMessage() || formControlProps.validationMessage,
    children: /*#__PURE__*/_jsx(CampaignSelect, Object.assign({
      error: notFoundError || limitError,
      onChange: handleChange,
      onCurrentValueNotFound: handleCurrentValueNotFound,
      placeholder: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "campaignSelect.selectCampaign"
      }),
      value: value,
      canCreateCampaigns: hasCampaignsWriteAccess,
      multi: multi
    }, rest))
  });
}

CampaignSelectFormControl.propTypes = {
  hasCampaignsReadAccess: PropTypes.bool,
  hasCampaignsWriteAccess: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onChange: PropTypes.func.isRequired,
  formControlProps: passthroughProps(UIFormControl),
  multi: PropTypes.bool,
  showMissingAccessError: PropTypes.bool,
  assetObjectType: PropTypes.string
};
export default CampaignSelectFormControl;