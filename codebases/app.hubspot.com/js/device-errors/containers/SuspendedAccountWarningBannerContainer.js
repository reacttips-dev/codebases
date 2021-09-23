'use es6';

import { connect } from 'react-redux';
import compose from 'transmute/compose';
import { withUserSettingsData } from '../../userSettings/decorators/RequireUserSettingsData';
import { getShowSuspendedWarningMessage } from '../../userSettings/selectors/getUserSettingsData';
import SuspendedAccountWarningBanner from '../components/SuspendedAccountWarningBanner';

var mapStateToProps = function mapStateToProps(state) {
  return {
    showSuspendedWarningMessage: getShowSuspendedWarningMessage(state)
  };
};

export default compose(connect(mapStateToProps), withUserSettingsData())(SuspendedAccountWarningBanner);