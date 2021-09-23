'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { fromJS, Map as ImmutableMap } from 'immutable';
import UserContainer from 'SequencesUI/data/UserContainer';
import PortalContainer from 'SequencesUI/data/PortalContainer';
import { tracker } from 'SequencesUI/util/UsageTracker';
import { SEQUENCESUI } from 'sales-modal/constants/Platform';
import { connect } from 'react-redux';
import emptyFunction from 'react-utils/emptyFunction';
import * as SequenceActions from 'SequencesUI/actions/SequenceActions';
import { getEnrollmentIdAsNumber } from 'SequencesUI/util/summary/CRMSearchUtils';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
import { SequenceEnrollmentRootDeprecated } from 'SequencesUI/components/async/AsyncSalesModal';
var SequenceReenrollModal = createReactClass({
  displayName: "SequenceReenrollModal",
  propTypes: {
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    enroll: PropTypes.func.isRequired,
    enrollment: PropTypes.oneOfType([PropTypes.instanceOf(ImmutableMap), PropTypes.object]).isRequired,
    fetchPastEnrollment: PropTypes.func.isRequired,
    pastEnrollment: PropTypes.instanceOf(ImmutableMap),
    startPolling: PropTypes.func.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      startPolling: emptyFunction
    };
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
        fetchPastEnrollment = _this$props.fetchPastEnrollment,
        enrollment = _this$props.enrollment;
    tracker.track('pageView', {
      subscreen: 'reenroll'
    });

    if (enrollment) {
      fetchPastEnrollment(getEnrollmentIdAsNumber(enrollment));
    }
  },
  handleReenroll: function handleReenroll(_ref) {
    var enrollment = _ref.enrollment;
    var _this$props2 = this.props,
        enroll = _this$props2.enroll,
        onConfirm = _this$props2.onConfirm,
        pastEnrollment = _this$props2.pastEnrollment,
        startPolling = _this$props2.startPolling;
    enroll({
      enrollment: enrollment.set('userPlatform', 'SEQUENCES_UI'),
      vid: pastEnrollment.get('vid'),
      isReenroll: true
    }).then(function () {
      startPolling();
      onConfirm();
    });
  },
  render: function render() {
    var _this$props3 = this.props,
        onReject = _this$props3.onReject,
        pastEnrollment = _this$props3.pastEnrollment;

    if (!pastEnrollment) {
      return null;
    }

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
      enrollSequence: this.handleReenroll,
      enrolledSequence: pastEnrollment.get('sequence'),
      stepEnrollments: pastEnrollment.get('steps'),
      enrollType: EnrollTypes.REENROLL
    });
  }
});
export default connect(function (_ref2, _ref3) {
  var pastEnrollments = _ref2.pastEnrollments;
  var enrollment = _ref3.enrollment;
  return {
    pastEnrollment: pastEnrollments.get(getEnrollmentIdAsNumber(enrollment))
  };
}, {
  enroll: SequenceActions.enroll,
  fetchPastEnrollment: SequenceActions.fetchPastEnrollment
})(SequenceReenrollModal);