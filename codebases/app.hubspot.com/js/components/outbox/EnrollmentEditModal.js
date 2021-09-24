'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { fromJS, Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import UserContainer from 'SequencesUI/data/UserContainer';
import PortalContainer from 'SequencesUI/data/PortalContainer';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
import { SEQUENCESUI } from 'sales-modal/constants/Platform';
import * as SequenceScheduleActions from 'SequencesUI/actions/SequenceScheduleActions';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import { getEnrollmentIdAsNumberMaybeImmutable } from 'SequencesUI/util/summary/CRMSearchUtils';
import { SequenceEnrollmentRootDeprecated } from 'SequencesUI/components/async/AsyncSalesModal';
var EnrollmentEditModal = createReactClass({
  displayName: "EnrollmentEditModal",
  propTypes: {
    enrollment: PropTypes.oneOfType([PropTypes.instanceOf(ImmutableMap), PropTypes.object]).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    fetchPastEnrollment: PropTypes.func.isRequired,
    pastEnrollment: PropTypes.instanceOf(ImmutableMap),
    updateEnrollment: PropTypes.func.isRequired
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
        fetchPastEnrollment = _this$props.fetchPastEnrollment,
        enrollment = _this$props.enrollment,
        pastEnrollment = _this$props.pastEnrollment;

    if (enrollment && !pastEnrollment) {
      fetchPastEnrollment(getEnrollmentIdAsNumberMaybeImmutable(enrollment));
    }
  },
  handleUpdateSequence: function handleUpdateSequence(_ref) {
    var updatedSequence = _ref.enrollment;
    var pastEnrollment = this.props.pastEnrollment;
    this.props.updateEnrollment(pastEnrollment.set('sequence', updatedSequence)).then(this.props.onConfirm);
  },
  render: function render() {
    var _this$props2 = this.props,
        onReject = _this$props2.onReject,
        pastEnrollment = _this$props2.pastEnrollment;

    if (!pastEnrollment) {
      return null;
    }

    var sequence = pastEnrollment.get('sequence').merge({
      enrolledAt: pastEnrollment.get('enrolledAt')
    });
    return /*#__PURE__*/_jsx(SequenceEnrollmentRootDeprecated, {
      user: fromJS(UserContainer.get()),
      portal: fromJS(PortalContainer.get()),
      platform: SEQUENCESUI,
      recipient: pastEnrollment.get('toEmail'),
      closeModal: onReject,
      sender: {
        inboxAddress: pastEnrollment.getIn(['sequence', 'inboxAddress']),
        fromAddress: pastEnrollment.getIn(['sequence', 'fromAddress'])
      },
      enrollSequence: this.handleUpdateSequence,
      selectConnectedAccount: false,
      enrolledSequence: sequence,
      stepEnrollments: pastEnrollment.get('steps'),
      enrollmentState: pastEnrollment.get('state'),
      enrollType: EnrollTypes.EDIT
    });
  }
});
export default connect(function (_ref2, _ref3) {
  var pastEnrollments = _ref2.pastEnrollments;
  var enrollment = _ref3.enrollment;
  return {
    pastEnrollment: pastEnrollments.get(getEnrollmentIdAsNumberMaybeImmutable(enrollment))
  };
}, {
  fetchPastEnrollment: SequenceActions.fetchPastEnrollment,
  updateEnrollment: SequenceScheduleActions.updateEnrollment
})(EnrollmentEditModal);