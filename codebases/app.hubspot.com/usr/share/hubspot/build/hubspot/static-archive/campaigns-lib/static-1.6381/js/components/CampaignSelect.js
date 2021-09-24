'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UILink from 'UIComponents/link/UILink';
import UISelect from 'UIComponents/input/UISelect';
import { RECENTLY_USED_PREFIX } from '../constants/campaignSelect';
import useLoadCampaignSelectOptions from '../hooks/useLoadCampaignSelectOptions';
import useLoadInitialCampaignSelectOption from '../hooks/useLoadInitialCampaignSelectOption';
import useCreateCampaign from '../hooks/useCreateCampaign';
import CampaignSelectItemComponent from './CampaignSelectItemComponent';
import UIFloatingAlertList from 'UIComponents/alert/UIFloatingAlertList';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import CampaignEditPanel from './panels/CampaignEditPanel';

function sanitizeValue() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return value.replace(RECENTLY_USED_PREFIX, '');
}

function CampaignSelect(_ref) {
  var _ref$canCreateCampaig = _ref.canCreateCampaigns,
      canCreateCampaigns = _ref$canCreateCampaig === void 0 ? false : _ref$canCreateCampaig,
      numberOfRecentlyUsed = _ref.numberOfRecentlyUsed,
      onChange = _ref.onChange,
      onCurrentValueNotFound = _ref.onCurrentValueNotFound,
      pageLimit = _ref.pageLimit,
      placeholder = _ref.placeholder,
      recentlyUsedCacheGracePeriod = _ref.recentlyUsedCacheGracePeriod,
      selectElementRef = _ref.selectElementRef,
      value = _ref.value,
      buttonUse = _ref.buttonUse,
      _ref$multi = _ref.multi,
      multi = _ref$multi === void 0 ? false : _ref$multi,
      _ref$disabledOptionsB = _ref.disabledOptionsByName,
      disabledOptionsByName = _ref$disabledOptionsB === void 0 ? [] : _ref$disabledOptionsB,
      rest = _objectWithoutProperties(_ref, ["canCreateCampaigns", "numberOfRecentlyUsed", "onChange", "onCurrentValueNotFound", "pageLimit", "placeholder", "recentlyUsedCacheGracePeriod", "selectElementRef", "value", "buttonUse", "multi", "disabledOptionsByName"]);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showCreatePanel = _useState2[0],
      setShowCreatePanel = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      createdCampaigns = _useState4[0],
      setCreatedCampaigns = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      hasOpened = _useState6[0],
      setHasOpened = _useState6[1];

  var _useState7 = useState(function () {
    return FloatingAlertStore.newFloatingAlertStore();
  }),
      _useState8 = _slicedToArray(_useState7, 1),
      alertStore = _useState8[0];

  var loadOptions = useLoadCampaignSelectOptions({
    numberOfRecentlyUsed: numberOfRecentlyUsed,
    onCurrentValueNotFound: onCurrentValueNotFound,
    pageLimit: pageLimit,
    recentlyUsedCacheGracePeriod: recentlyUsedCacheGracePeriod,
    value: value,
    createdCampaigns: createdCampaigns,
    multi: multi,
    disabledOptionsByName: disabledOptionsByName
  });
  var initialOptions = useLoadInitialCampaignSelectOption({
    value: value,
    hasOpened: hasOpened,
    multi: multi,
    onCurrentValueNotFound: onCurrentValueNotFound
  });

  var _useCreateCampaign = useCreateCampaign({
    showError: function showError(errorMessage) {
      alertStore.addAlert({
        message: errorMessage,
        titleText: I18n.text('campaignsLib.errors.campaignCreateFailed.title'),
        type: 'danger'
      });
    }
  }),
      loading = _useCreateCampaign.loading,
      failed = _useCreateCampaign.failed,
      createCampaign = _useCreateCampaign.createCampaign;

  var handleSelectedOptionChange = useCallback(function (_ref2) {
    var option = _ref2.target.value;

    if (!multi) {
      return onChange(SyntheticEvent(sanitizeValue(option.value)), option);
    }

    if (option) {
      var sanitizedOptions = option.map(function (campaign) {
        return sanitizeValue(campaign.value || campaign);
      });
      return onChange(SyntheticEvent(sanitizedOptions), option);
    }

    return onChange(SyntheticEvent([]), option);
  }, [onChange, multi]);
  var onCampaignCreated = useCallback(function (newCampaign) {
    if (!newCampaign) {
      return;
    }

    setCreatedCampaigns(function (currentCreatedCampaigns) {
      return currentCreatedCampaigns.concat([newCampaign]);
    });
    var newCampaignOption = Object.assign({}, newCampaign, {
      text: newCampaign.display_name,
      value: newCampaign.guid
    });

    if (multi) {
      newCampaignOption = [].concat(_toConsumableArray(value), [newCampaignOption]);
    }

    handleSelectedOptionChange(SyntheticEvent(newCampaignOption));
    setShowCreatePanel(false);
  }, [handleSelectedOptionChange, multi, value]);
  var handleCreateCampaignV2 = useCallback(function (campaign) {
    createCampaign(campaign).then(onCampaignCreated);
  }, [createCampaign, onCampaignCreated]);

  var dropdownFooter = canCreateCampaigns && /*#__PURE__*/_jsx(UILink, {
    "data-test-id": "create-campaign-button",
    onClick: function onClick() {
      return setShowCreatePanel(true);
    },
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "campaignSelect.createCampaign"
    })
  });

  var defaultPlaceholder = /*#__PURE__*/_jsx(FormattedMessage, {
    message: "campaignSelect.placeholder"
  });

  var CampaignSelectItemComponentWithProps = useCallback(function (props) {
    return /*#__PURE__*/_jsx(CampaignSelectItemComponent, Object.assign({
      buttonUse: buttonUse,
      multi: multi
    }, props));
  }, [buttonUse, multi]);
  return /*#__PURE__*/_jsxs("span", {
    children: [/*#__PURE__*/_createElement(UISelect, Object.assign({}, rest, {
      key: createdCampaigns.length,
      clearable: true,
      dropdownFooter: dropdownFooter,
      itemComponent: CampaignSelectItemComponentWithProps,
      loadOptions: loadOptions,
      options: initialOptions,
      minimumSearchCount: 1,
      onSelectedOptionChange: handleSelectedOptionChange,
      placeholder: placeholder || defaultPlaceholder,
      ref: selectElementRef,
      searchable: true,
      value: value,
      autoload: hasOpened || multi,
      buttonUse: buttonUse,
      onOpenChange: function onOpenChange() {
        if (!hasOpened) {
          setHasOpened(true);
        }
      },
      multi: multi
    })), showCreatePanel && /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(CampaignEditPanel, {
        failed: failed,
        loading: loading,
        onClose: function onClose() {
          return setShowCreatePanel(false);
        },
        onSubmit: handleCreateCampaignV2,
        use: "create",
        uiPanelProps: {
          onClick: function onClick(e) {
            return e.stopPropagation();
          }
        } // prevents select being closed on clicking panel

      }), /*#__PURE__*/_jsx(UIFloatingAlertList, {
        alertStore: alertStore
      })]
    })]
  });
}

CampaignSelect.propTypes = {
  canCreateCampaigns: PropTypes.bool,
  numberOfRecentlyUsed: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onCurrentValueNotFound: PropTypes.func,
  pageLimit: PropTypes.number,
  placeholder: PropTypes.node,
  recentlyUsedCacheGracePeriod: PropTypes.number,
  selectElementRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  }),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  buttonUse: PropTypes.string,
  multi: PropTypes.bool,
  disabledOptionsByName: PropTypes.arrayOf(PropTypes.string)
};
export default CampaignSelect;