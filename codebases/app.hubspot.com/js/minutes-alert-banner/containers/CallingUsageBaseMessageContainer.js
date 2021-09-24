'use es6';

import { connect } from 'react-redux';
import compose from 'transmute/compose';
import { getUserMinutesUsedFromState, getMinutesAvailableFromState, getTotalMinutesPerMonthFromState } from '../selectors/getMinutesUsage';
import CallingUsageBaseMessage from '../components/CallingUsageBaseMessage';

var mapStateToProps = function mapStateToProps(state) {
  return {
    minutesUsed: getUserMinutesUsedFromState(state),
    minutesAvailable: getMinutesAvailableFromState(state),
    totalMinutesPerMonth: getTotalMinutesPerMonthFromState(state)
  };
};

export default compose(connect(mapStateToProps))(CallingUsageBaseMessage);