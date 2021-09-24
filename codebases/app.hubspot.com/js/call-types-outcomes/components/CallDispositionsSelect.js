'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import I18n from 'I18n';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import get from 'transmute/get';
import TruncatedSelect from './TruncatedSelect';
import { getAllCallDispositions } from '../../bet-activity-types/constants/CallOutcomeDispositions';

function CallDispositionsSelect(_ref) {
  var options = _ref.options,
      setCallDisposition = _ref.setCallDisposition,
      disabled = _ref.disabled,
      appIdentifier = _ref.appIdentifier;
  var optionsRef = useRef(null);
  optionsRef.current = options;
  var handleSelect = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setCallDisposition(value);
    var selectedDispositionOption = optionsRef.current.find(function (option) {
      return get('value', option) === value;
    });
    CommunicatorLogger.log('communicatorInteraction', {
      action: 'select call outcome',
      activity: 'call',
      channel: 'outbound call',
      source: appIdentifier,
      outcomeType: get('text', selectedDispositionOption)
    });
  }, [setCallDisposition, appIdentifier]);
  var formattedOptions = useMemo(function () {
    var defaultDispositions = getAllCallDispositions();
    return options.map(function (option) {
      var value = option.get('value');
      var translatedLabel = defaultDispositions.get(value);
      var text = translatedLabel || option.get('text');
      return {
        text: text,
        value: value
      };
    }).toJS();
  }, [options]);
  return /*#__PURE__*/_jsx(TruncatedSelect, {
    disabled: disabled,
    className: "p-right-3 display-flex",
    buttonUse: "link",
    options: formattedOptions,
    placeholder: I18n.text('calling-communicator-ui.callDisposition.select'),
    onChange: handleSelect,
    maxValueWidth: 200,
    menuWidth: 200,
    placement: "bottom right",
    "data-selenium-test": "calling-widget-select-call-disposition-button"
  });
}

CallDispositionsSelect.propTypes = {
  options: ImmutablePropTypes.list.isRequired,
  setCallDisposition: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  appIdentifier: PropTypes.string.isRequired
};
export default CallDispositionsSelect;