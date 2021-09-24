'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";

var _this = this;

import { useCallback, useContext } from 'react';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIButton from 'UIComponents/button/UIButton';
import UIList from 'UIComponents/list/UIList';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { CALYPSO_LIGHT } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import { tracker } from './tracker';
import { TrialStateContext } from './App';
import { MultiTrialDropdownContext } from './contexts/MultiTrialDropdownContext';
import { OLAF } from 'HubStyleTokens/colors';
import { useDismissMultiTrialDropdownOnOutsideClick } from './hooks/useDismissMultiTrialDropdownOnOutsideClick';
import { useSetAlert } from './utils/AlertWrapper'; // don't pass useHighlight prop to UIButton

var StyledUIButton = styled(function (_ref) {
  var __useHighlight = _ref.useHighlight,
      rest = _objectWithoutProperties(_ref, ["useHighlight"]);

  return /*#__PURE__*/_jsx(UIButton, Object.assign({}, rest));
}).withConfig({
  displayName: "MultiTrialDropdown__StyledUIButton",
  componentId: "sc-1o7xqv0-0"
})(["&&&{background-color:", ";}"], function (_ref2) {
  var useHighlight = _ref2.useHighlight;
  return useHighlight && CALYPSO_LIGHT;
});
var DropdownToggleButton = styled(UIButton).withConfig({
  displayName: "MultiTrialDropdown__DropdownToggleButton",
  componentId: "sc-1o7xqv0-1"
})(["&&&{text-decoration:none;&:hover{text-decoration:underline;color:", ";}}"], OLAF);

var MultiTrialDropdown = function MultiTrialDropdown(_ref3) {
  var onChangePreferredTrial = _ref3.onChangePreferredTrial;

  var _useContext = useContext(TrialStateContext),
      trialState = _useContext.trialState,
      preferredTrial = _useContext.preferredTrial;

  var _useContext2 = useContext(MultiTrialDropdownContext),
      showMultiTrialDropdown = _useContext2.showMultiTrialDropdown,
      setShowMultiTrialDropdown = _useContext2.setShowMultiTrialDropdown,
      setSwitchTrialViewRef = _useContext2.setSwitchTrialViewRef;

  var preferredTrialUpgradeProduct = preferredTrial.trialName;
  useDismissMultiTrialDropdownOnOutsideClick();
  var setAlert = useSetAlert();
  var handleChangePreferredTrial = useCallback(function (trial) {
    tracker.track('interaction', {
      action: "select " + trial.rawTrialName
    });
    var isPreferredTrial = trial.trialName === preferredTrialUpgradeProduct;
    if (isPreferredTrial) return; // no-op

    setAlert({
      message: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.alerts.activeTrialChange.message"
      }),
      timestamp: Date.now(),
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.alerts.activeTrialChange.titleText"
      }),
      type: 'success'
    });
    onChangePreferredTrial(trial);
  }, [onChangePreferredTrial, preferredTrialUpgradeProduct, setAlert]);
  var renderOption = useCallback(function (trial) {
    var upgradeProduct = trial.trialName;
    var key = "active-trial-dropdown-button__" + upgradeProduct;
    var isPreferredTrial = trial.trialName === preferredTrialUpgradeProduct;
    return /*#__PURE__*/_jsx(StyledUIButton, {
      "data-unit-test": key,
      onClick: handleChangePreferredTrial.bind(_this, trial),
      useHighlight: isPreferredTrial,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui." + upgradeProduct
      })
    }, key);
  }, [handleChangePreferredTrial, preferredTrialUpgradeProduct]);
  var handleOpenChange = useCallback(function () {
    if (!showMultiTrialDropdown) {
      tracker.track('interaction', {
        action: 'click switch trial view'
      });
    }

    setShowMultiTrialDropdown(!showMultiTrialDropdown);
  }, [setShowMultiTrialDropdown, showMultiTrialDropdown]);
  var hasMultipleTrials = trialState.length >= 2;

  if (!hasMultipleTrials) {
    return null;
  }

  return /*#__PURE__*/_jsx("div", {
    ref: setSwitchTrialViewRef,
    children: /*#__PURE__*/_jsx(UIDropdown, {
      animateOnToggle: false,
      Button: DropdownToggleButton,
      buttonClassName: "p-right-4",
      buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "trial-banner-ui.trialDropdown.buttonText"
      }),
      buttonUse: "link-on-dark",
      closeOnOutsideClick: false // useDismissMultiTrialDropdownOnOutsideClick hook works better with iframe empty space than closeOnOutsideClick prop
      ,
      onOpenChange: handleOpenChange,
      open: showMultiTrialDropdown,
      children: /*#__PURE__*/_jsx(UIList, {
        children: trialState.map(renderOption)
      })
    })
  });
};

MultiTrialDropdown.propTypes = {
  onChangePreferredTrial: PropTypes.func.isRequired
};
export default MultiTrialDropdown;