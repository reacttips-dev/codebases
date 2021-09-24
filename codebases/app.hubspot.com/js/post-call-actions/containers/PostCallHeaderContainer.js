'use es6';

import { connect } from 'react-redux';
import getActivityTypesAreEnabledFromState from '../../hub-settings/selectors/getActivityTypesAreEnabledFromState';
import PostCallHeader from '../components/PostCallHeader';
import { getIsScopedForBETActivityTypes } from '../../Auth/selectors/scopes';
import { getEngagementDispositionFromState } from '../../engagement/selectors/getEngagement';
import { hasCalloutcomesCapability, hasCallTypesCapability } from '../../capabilities/selectors/getCapabilities';

var mapStateToProps = function mapStateToProps(state) {
  return {
    isScopedForBETActivityTypes: getIsScopedForBETActivityTypes(state),
    activityTypesAreEnabled: getActivityTypesAreEnabledFromState(state),
    selectedDisposition: getEngagementDispositionFromState(state),
    hasCalloutcomesCapability: hasCalloutcomesCapability(state),
    hasCallTypesCapability: hasCallTypesCapability(state)
  };
};

export default connect(mapStateToProps)(PostCallHeader);