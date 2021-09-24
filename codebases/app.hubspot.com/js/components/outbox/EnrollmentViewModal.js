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
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import { SequenceEnrollmentRootDeprecated } from 'SequencesUI/components/async/AsyncSalesModal';
import { getEnrollmentIdAsNumber } from '../../util/summary/CRMSearchUtils';
var EnrollmentViewModal = createReactClass({
  displayName: "EnrollmentViewModal",
  propTypes: {
    enrollment: PropTypes.oneOfType([PropTypes.instanceOf(ImmutableMap), PropTypes.object]).isRequired,
    onReject: PropTypes.func.isRequired,
    fetchPastEnrollment: PropTypes.func.isRequired,
    pastEnrollment: PropTypes.instanceOf(ImmutableMap)
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
        fetchPastEnrollment = _this$props.fetchPastEnrollment,
        enrollment = _this$props.enrollment,
        pastEnrollment = _this$props.pastEnrollment;

    if (enrollment && !pastEnrollment) {
      fetchPastEnrollment(getEnrollmentIdAsNumber(enrollment));
    }
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
      selectConnectedAccount: false,
      enrolledSequence: sequence,
      stepEnrollments: pastEnrollment.get('steps'),
      enrollmentState: pastEnrollment.get('state'),
      enrollType: EnrollTypes.VIEW
    });
  }
});
export default connect(function (_ref, _ref2) {
  var pastEnrollments = _ref.pastEnrollments;
  var enrollment = _ref2.enrollment;
  return {
    pastEnrollment: pastEnrollments.get(getEnrollmentIdAsNumber(enrollment))
  };
}, {
  fetchPastEnrollment: SequenceActions.fetchPastEnrollment
})(EnrollmentViewModal);