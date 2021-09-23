'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UISelect from 'UIComponents/input/UISelect';
import { CALL_FROM_BROWSER, CALL_FROM_PHONE } from 'calling-lifecycle-internal/constants/CallMethods';
import { getIsOnboardingComplete } from 'calling-lifecycle-internal/onboarding/operators/getOnboardingStatuses';
import { OnboardingStatusPropType } from 'calling-lifecycle-internal/onboarding/operators/OnboardingStatusPropType';
import CallExtensionsContext from '../../WidgetBase/context/CallingExtensionsContext';
import { createSelectedCallMethodMessage } from 'calling-internal-common/iframe-events/internalEventMessageCreators';

function CallMethodDropdown(_ref) {
  var disabled = _ref.disabled,
      selectedCallMethod = _ref.selectedCallMethod,
      setSelectedCallMethod = _ref.setSelectedCallMethod,
      onboardingStatus = _ref.onboardingStatus,
      hasMicrophoneAccess = _ref.hasMicrophoneAccess,
      getMicrophonePermissionsState = _ref.getMicrophonePermissionsState;
  var callExtensions = useContext(CallExtensionsContext);
  var handleUpdateCallMethod = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setSelectedCallMethod(value);
    var message = createSelectedCallMethodMessage(value);
    callExtensions.postMessageToHost(message);

    if (!hasMicrophoneAccess && value === CALL_FROM_BROWSER) {
      getMicrophonePermissionsState();
    }
  }, [callExtensions, setSelectedCallMethod, hasMicrophoneAccess, getMicrophonePermissionsState]);
  var options = [{
    value: CALL_FROM_BROWSER,
    text: I18n.text('calling-communicator-ui.settings.callFromBrowser')
  }, {
    value: CALL_FROM_PHONE,
    text: I18n.text('calling-communicator-ui.settings.callFromPhone')
  }];

  if (!getIsOnboardingComplete(onboardingStatus)) {
    return null;
  }

  return /*#__PURE__*/_jsx(UISelect, {
    "data-selenium-test": "calling-widget-call-method-dropdown",
    onChange: handleUpdateCallMethod,
    options: options,
    value: selectedCallMethod,
    disabled: disabled,
    className: "p-y-1 p-left-0 p-right-1 non-responsive-dropdown",
    buttonUse: "transparent",
    menuWidth: 200,
    placement: "top left"
  });
}

CallMethodDropdown.propTypes = {
  selectedCallMethod: PropTypes.oneOf([CALL_FROM_PHONE, CALL_FROM_BROWSER]).isRequired,
  setSelectedCallMethod: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  hasMicrophoneAccess: PropTypes.bool,
  getMicrophonePermissionsState: PropTypes.func.isRequired,
  onboardingStatus: OnboardingStatusPropType.isRequired
};
export default /*#__PURE__*/memo(CallMethodDropdown);