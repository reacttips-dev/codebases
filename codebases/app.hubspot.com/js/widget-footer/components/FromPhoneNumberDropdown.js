'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import get from 'transmute/get';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISelect from 'UIComponents/input/UISelect';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import CallExtensionsContext from '../../WidgetBase/context/CallingExtensionsContext';
import { createSelectedFromNumberMessage } from 'calling-internal-common/iframe-events/internalEventMessageCreators';
import Small from 'UIComponents/elements/Small';
import { getFromNumberDescription } from 'calling-ui-library/utils/phoneNumberSourceUtils';
import { useSelector } from 'react-redux';
import { getIsUngatedForPhoneNumberAcquisition } from '../../calling-admin-settings/selectors/getCallingAdminSettingsFromState';

function FromPhoneNumberDropdown(_ref) {
  var disabled = _ref.disabled,
      fromPhoneNumbers = _ref.fromPhoneNumbers,
      selectedFromNumber = _ref.selectedFromNumber,
      setSelectedConnectFromNumber = _ref.setSelectedConnectFromNumber,
      setSelectedFromNumber = _ref.setSelectedFromNumber,
      isUsingTwilioConnect = _ref.isUsingTwilioConnect,
      setRegisterFromNumberType = _ref.setRegisterFromNumberType,
      appIdentifier = _ref.appIdentifier;
  var callExtensions = useContext(CallExtensionsContext);
  var isUngatedForPhoneNumberAcquisition = useSelector(getIsUngatedForPhoneNumberAcquisition);
  var selectOptions = useMemo(function () {
    if (!fromPhoneNumbers) {
      return [];
    }

    return fromPhoneNumbers.reduce(function (acc, number) {
      if (!number) return acc;
      acc.push({
        value: get('friendlyName', number),
        text: number.formatted,
        source: getFromNumberDescription(get('source', number))
      });
      return acc;
    }, []);
  }, [fromPhoneNumbers]);
  var onAddNewNumber = useCallback(function () {
    setRegisterFromNumberType({
      isUsingTwilioConnect: isUsingTwilioConnect
    });
    CommunicatorLogger.log('communicatorInteraction', {
      action: 'Add New "from" Phone Number',
      activity: 'call',
      channel: 'outbound call',
      source: appIdentifier
    });
  }, [isUsingTwilioConnect, setRegisterFromNumberType, appIdentifier]);
  var handleSetSelectedFromNumber = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    var setter = isUsingTwilioConnect ? setSelectedConnectFromNumber : setSelectedFromNumber;
    var number = fromPhoneNumbers.get(value);
    setter(number);
    var message = createSelectedFromNumberMessage(number.toJS());
    callExtensions.postMessageToHost(message);
    CommunicatorLogger.log('communicatorInteraction', {
      action: 'Change "from" number',
      activity: 'call',
      channel: 'outbound call',
      source: appIdentifier
    });
  }, [callExtensions, fromPhoneNumbers, setSelectedConnectFromNumber, setSelectedFromNumber, isUsingTwilioConnect, appIdentifier]);
  var Item = useMemo(function () {
    return function (_ref3) {
      var option = _ref3.option;
      return /*#__PURE__*/_jsxs("div", {
        "data-option": true,
        className: "p-y-2 p-x-10",
        "data-selenium-test": "from-number-option-" + option.value,
        children: [/*#__PURE__*/_jsx("div", {
          children: option.text
        }), isUngatedForPhoneNumberAcquisition && /*#__PURE__*/_jsx(Small, {
          use: "help",
          children: option.source
        })]
      });
    };
  }, [isUngatedForPhoneNumberAcquisition]);

  if (!selectOptions || selectOptions.length === 0) {
    return null;
  }

  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(FormattedMessage, {
      message: "calling-communicator-ui.settings.fromPhoneNumber"
    }), /*#__PURE__*/_jsx(UISelect, {
      "data-selenium-test": "calling-widget-from-number-dropdown",
      onChange: handleSetSelectedFromNumber,
      options: selectOptions,
      value: get('friendlyName', selectedFromNumber),
      disabled: disabled,
      className: "p-all-1 non-responsive-dropdown",
      buttonUse: "transparent",
      menuWidth: 250,
      optionComponent: Item,
      searchable: false,
      dropdownFooter: /*#__PURE__*/_jsxs(UIButton, {
        onClick: onAddNewNumber,
        use: "link",
        className: "is--single-line",
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "add",
          size: "xxs"
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "calling-communicator-ui.settings.addFromNumber"
        })]
      })
    })]
  });
}

FromPhoneNumberDropdown.propTypes = {
  disabled: PropTypes.bool.isRequired,
  fromPhoneNumbers: ImmutablePropTypes.orderedMap.isRequired,
  selectedFromNumber: RecordPropType('RegisteredFromNumber'),
  setSelectedConnectFromNumber: PropTypes.func.isRequired,
  setSelectedFromNumber: PropTypes.func.isRequired,
  isUsingTwilioConnect: PropTypes.bool.isRequired,
  setRegisterFromNumberType: PropTypes.func.isRequired,
  appIdentifier: PropTypes.string.isRequired
};
export default FromPhoneNumberDropdown;