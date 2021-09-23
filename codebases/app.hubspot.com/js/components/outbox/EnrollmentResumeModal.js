'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { fromJS, Map as ImmutableMap } from 'immutable';
import emptyFunction from 'react-utils/emptyFunction';
import UserContainer from 'SequencesUI/data/UserContainer';
import PortalContainer from 'SequencesUI/data/PortalContainer';
import { SEQUENCESUI } from 'sales-modal/constants/Platform';
import * as SequenceEnrollmentTableActions from 'SequencesUI/actions/SequenceEnrollmentTableActions';
import { getEnrollmentIdAsNumber } from 'SequencesUI/util/summary/CRMSearchUtils';
import { SequenceEnrollmentRootDeprecated } from 'SequencesUI/components/async/AsyncSalesModal';
import { fetchResumePreview } from 'SequencesUI/api/SequenceApi';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
var EnrollmentResumeModal = createReactClass({
  displayName: "EnrollmentResumeModal",
  propTypes: {
    enrollment: PropTypes.oneOfType([PropTypes.instanceOf(ImmutableMap), PropTypes.object]).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    startPolling: PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      startPolling: emptyFunction
    };
  },
  getInitialState: function getInitialState() {
    return {
      resumePreview: null
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var enrollmentId = getEnrollmentIdAsNumber(this.props.enrollment);
    fetchResumePreview(enrollmentId).then(function (resumePreview) {
      return _this.setState({
        resumePreview: resumePreview
      });
    });
  },
  handleResume: function handleResume(_ref) {
    var updatedSequence = _ref.enrollment;
    var resumePreview = this.state.resumePreview;
    var startPolling = this.props.startPolling;
    SequenceEnrollmentTableActions.resumeEnrollment(resumePreview.set('sequence', updatedSequence)).then(function (resumedEnrollment) {
      startPolling(["" + resumedEnrollment.get('id')]);
    }).then(this.props.onConfirm);
  },
  render: function render() {
    var onReject = this.props.onReject;
    var resumePreview = this.state.resumePreview;

    if (!resumePreview) {
      return null;
    }

    var sequence = resumePreview.get('sequence').merge({
      enrolledAt: resumePreview.get('enrolledAt')
    });
    return /*#__PURE__*/_jsx(SequenceEnrollmentRootDeprecated, {
      user: fromJS(UserContainer.get()),
      portal: fromJS(PortalContainer.get()),
      platform: SEQUENCESUI,
      recipient: resumePreview.get('toEmail'),
      closeModal: onReject,
      sender: {
        inboxAddress: resumePreview.getIn(['sequence', 'inboxAddress']),
        fromAddress: resumePreview.getIn(['sequence', 'fromAddress'])
      },
      enrollSequence: this.handleResume,
      selectConnectedAccount: false,
      enrolledSequence: sequence,
      stepEnrollments: resumePreview.get('steps'),
      enrollmentState: resumePreview.get('state'),
      enrollType: EnrollTypes.RESUME
    });
  }
});
export default EnrollmentResumeModal;