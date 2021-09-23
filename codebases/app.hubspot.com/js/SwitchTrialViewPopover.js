'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import GenericTrialBannerPopover from './GenericTrialBannerPopover';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { MultiTrialDropdownContext } from './contexts/MultiTrialDropdownContext';
export var SWITCH_TRIAL_VIEW_POPOVER_SETTINGS_KEY = 'trial-banner:hasSeenSwitchTrialViewPopover';

var TrialDropdownPopover = function TrialDropdownPopover(_ref) {
  var showFlydown = _ref.showFlydown;

  var _useContext = useContext(MultiTrialDropdownContext),
      switchTrialViewRef = _useContext.switchTrialViewRef;

  return /*#__PURE__*/_jsx(GenericTrialBannerPopover, {
    popoverTargetRef: switchTrialViewRef,
    popoverHeight: 500,
    popoverName: "switch-trial-view",
    popoverWidth: 350,
    showFlydown: showFlydown,
    shouldUseDelay: true,
    translatedTitle: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.trialDropdown.onboardingTooltip.header"
    }),
    translatedBody: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.trialDropdown.onboardingTooltip.body"
    }),
    translatedConfirmButtonText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.trialDropdown.onboardingTooltip.confirmButtonText"
    }),
    userAttributesKey: SWITCH_TRIAL_VIEW_POPOVER_SETTINGS_KEY
  });
};

TrialDropdownPopover.propTypes = {
  showFlydown: PropTypes.bool
};
export default TrialDropdownPopover;