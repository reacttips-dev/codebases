'use es6';

import { connect } from 'react-redux';
import compose from 'transmute/compose';
import { getHasTwilioConnectFromState, getInitialLoadSettingsSucceededFromState } from 'calling-communicator-ui/initial-load-settings/selectors/getInitialLoadSettings';
import { getUserMinutesUsedFromState, getMinutesAvailableFromState, getHasMinutesAvailableFromState, getTotalMinutesPerMonthFromState } from '../selectors/getMinutesUsage';
import { getHasErrorsFromState } from '../selectors/getHasErrorsFromState';
import MinutesAlertBanner from '../components/MinutesAlertBanner';
import { getSelectedCallProviderFromState } from '../../calling-providers/selectors/getCallingProviders';
import { getScopesFromState } from '../../Auth/selectors/authSelectors';
import { setSelectedProvider } from '../../calling-providers/actions/callingProvidersActions';

var mapStateToProps = function mapStateToProps(state) {
  return {
    selectedCallProvider: getSelectedCallProviderFromState(state),
    hasMinutesAvailable: getHasMinutesAvailableFromState(state),
    hasTwilioConnect: getHasTwilioConnectFromState(state),
    minutesUsed: getUserMinutesUsedFromState(state),
    minutesAvailable: getMinutesAvailableFromState(state),
    scopes: getScopesFromState(state),
    isLoadSettingsSucceeded: getInitialLoadSettingsSucceededFromState(state),
    hasErrors: getHasErrorsFromState(state),
    totalMinutesPerMonth: getTotalMinutesPerMonthFromState(state)
  };
};

var mapDispatchToProps = {
  setSelectedProvider: setSelectedProvider
};
export default compose(connect(mapStateToProps, mapDispatchToProps))(MinutesAlertBanner);