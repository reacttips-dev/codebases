'use es6';

import { connect } from 'react-redux';
import CallingWidgetWrapper from '../components/CallingWidgetWrapper';
import { getSubjectIdFromState, getObjectTypeIdFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  return {
    subjectId: getSubjectIdFromState(state),
    objectTypeId: getObjectTypeIdFromState(state)
  };
};

export default connect(mapStateToProps)(CallingWidgetWrapper);