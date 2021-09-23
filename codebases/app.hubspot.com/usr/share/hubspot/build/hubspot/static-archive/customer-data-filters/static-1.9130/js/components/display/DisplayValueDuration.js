'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { formatDurationToUnit, getDefaultUnit } from '../../utilities/durationUtilities';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { memo } from 'react';

var DisplayValueDuration = function DisplayValueDuration(props) {
  var duration = props.value;
  var unit = getDefaultUnit(duration);
  var formattedDuration = formatDurationToUnit(duration, unit);
  var langKey = 'customerDataFilters.FilterOperatorDurationInput.DurationUnits.countAndUnit';
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: langKey + "." + unit,
    options: {
      count: formattedDuration
    }
  });
};

DisplayValueDuration.propTypes = {
  value: PropTypes.number.isRequired
};
export default /*#__PURE__*/memo(DisplayValueDuration);