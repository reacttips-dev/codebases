'use es6';

import { connect } from 'react-redux';
import WidgetBody from '../components/WidgetBody';
import { getSelectedCallProviderFromState } from '../../calling-providers/selectors/getCallingProviders';
import { setNotes } from '../../engagement/actions/engagementActions';
import { shouldShowGDPRMessage } from '../../gdpr/selectors/bypassGDPR';
import { getProviderSupportsCurrentObjectTypeFromState, getObjectTypeIdFromState, getSubjectIdFromState, getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  return {
    selectedCallProvider: getSelectedCallProviderFromState(state),
    shouldShowGDPRMessage: shouldShowGDPRMessage(state),
    providerSupportsObjectType: getProviderSupportsCurrentObjectTypeFromState(state),
    subjectId: getSubjectIdFromState(state),
    objectTypeId: getObjectTypeIdFromState(state),
    appIdentifier: getAppIdentifierFromState(state)
  };
};

var mapDispatchToProps = {
  setNotes: setNotes
};
export default connect(mapStateToProps, mapDispatchToProps)(WidgetBody);