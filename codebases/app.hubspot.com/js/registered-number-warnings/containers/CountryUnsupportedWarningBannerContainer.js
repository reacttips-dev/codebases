'use es6';

import { connect } from 'react-redux';
import compose from 'transmute/compose';
import { getSelectedFromNumberFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { isUngatedFor } from '../../Auth/selectors/authSelectors';
import CountryUnsupportedWarningBanner from '../components/CountryUnsupportedWarningBanner';
import { CALLING_COUNTRY_UNSUPPORTED_MESSAGING } from 'calling-lifecycle-internal/constants/CallingGates';
import { getSelectedCallProviderFromState } from '../../calling-providers/selectors/getCallingProviders';
import { withUserSettingsData } from '../../userSettings/decorators/RequireUserSettingsData';
import { getShowCountryUnsupportedWarning } from '../../userSettings/selectors/getUserSettingsData';
import { saveUserSetting } from '../../userSettings/actions/userSettingsActions';
var mapDispatchToProps = {
  saveUserSetting: saveUserSetting
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    isUngatedForCountryUnsupportedMessaging: isUngatedFor(state, {
      gate: CALLING_COUNTRY_UNSUPPORTED_MESSAGING
    }),
    selectedFromNumber: getSelectedFromNumberFromState(state),
    selectedCallProvider: getSelectedCallProviderFromState(state),
    showCountryUnsupportedWarning: getShowCountryUnsupportedWarning(state)
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withUserSettingsData())(CountryUnsupportedWarningBanner);