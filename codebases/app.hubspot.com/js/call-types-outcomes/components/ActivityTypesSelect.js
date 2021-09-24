'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import I18n from 'I18n';
import get from 'transmute/get';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import TruncatedSelect from './TruncatedSelect';

function ActivityTypesSelect(_ref) {
  var options = _ref.options,
      setActivityType = _ref.setActivityType,
      disabled = _ref.disabled,
      appIdentifier = _ref.appIdentifier;
  var optionsRef = useRef(null);
  optionsRef.current = options;
  var handleSelect = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setActivityType(value);
    var selectedActivityType = optionsRef.current.find(function (option) {
      return get('value', option) === value;
    });
    CommunicatorLogger.log('communicatorInteraction', {
      action: 'select call type',
      activity: 'call',
      channel: 'outbound call',
      callType: get('text', selectedActivityType),
      source: appIdentifier
    });
  }, [setActivityType, appIdentifier]);
  var formattedOptions = useMemo(function () {
    return options.toJS();
  }, [options]);
  return /*#__PURE__*/_jsx(TruncatedSelect, {
    disabled: disabled,
    className: "p-right-3",
    buttonUse: "link",
    options: formattedOptions,
    placeholder: I18n.text('calling-communicator-ui.activityType.select'),
    onChange: handleSelect,
    maxValueWidth: 200,
    menuWidth: 200,
    placement: "bottom right",
    "data-selenium-test": "calling-widget-select-call-type-button display-flex"
  });
}

ActivityTypesSelect.propTypes = {
  options: ImmutablePropTypes.list.isRequired,
  setActivityType: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  appIdentifier: PropTypes.string.isRequired
};
export default ActivityTypesSelect;