'use es6';

import { connect } from 'react-redux';
import CalleeSelection from '../components/CalleeSelection';
import compose from 'transmute/compose';
import { getObjectTypeIdFromState, getSubjectIdFromState, getToNumberIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { withCallees } from '../../callees/decorators/RequireCallees';
import { setToNumberIdentifier } from '../../active-call-settings/actions/activeCallSettingsActions';

var mapStateToProps = function mapStateToProps(state) {
  return {
    toNumberIdentifier: getToNumberIdentifierFromState(state),
    subjectId: getSubjectIdFromState(state),
    objectTypeId: getObjectTypeIdFromState(state)
  };
};

var mapDispatchToProps = {
  onChange: setToNumberIdentifier
};
export default compose(connect(mapStateToProps, mapDispatchToProps), withCallees())(CalleeSelection);