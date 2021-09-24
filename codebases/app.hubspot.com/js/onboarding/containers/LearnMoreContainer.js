'use es6';

import { connect } from 'react-redux';
import LearnMore from '../components/LearnMore';
import { getTotalMinutesPerMonthFromState } from '../../minutes-alert-banner/selectors/getMinutesUsage';
import { getIsUsingTwilioConnectFromState } from '../../calling-providers/selectors/getCallingProviders';
import { getIsUngatedForPhoneNumberAcquisition } from '../../calling-admin-settings/selectors/getCallingAdminSettingsFromState';

var mapStateToProps = function mapStateToProps(state) {
  return {
    isUsingTwilioConnect: getIsUsingTwilioConnectFromState(state),
    totalMinutesPerMonth: getTotalMinutesPerMonthFromState(state),
    isUngatedForPhoneNumberAcquisition: getIsUngatedForPhoneNumberAcquisition(state)
  };
};

export var LearnMoreContainer = connect(mapStateToProps)(LearnMore);
export default LearnMoreContainer;