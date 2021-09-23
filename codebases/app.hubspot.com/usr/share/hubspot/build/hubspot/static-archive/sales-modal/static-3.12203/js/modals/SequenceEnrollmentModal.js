'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap, List } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIFloatingAlertList from 'UIComponents/alert/UIFloatingAlertList';
import SalesModalAlertsStore from 'sales-modal/utils/SalesModalAlertsStore';
import SequenceEnrollmentContainer from 'sales-modal/containers/SequenceEnrollmentContainer';
import FireAlarm from '../FireAlarm';
import { TEMPLATES_SEQUENCES_APPNAME } from '../constants/FireAlarmAppNames';
import H2 from 'UIComponents/elements/headings/H2';
import { EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';

var SequenceEnrollmentModal = function SequenceEnrollmentModal(_ref) {
  var onConfirm = _ref.onConfirm,
      enrolledSequence = _ref.enrolledSequence,
      sequenceId = _ref.sequenceId,
      stepEnrollments = _ref.stepEnrollments,
      isWithinSalesModal = _ref.isWithinSalesModal,
      closeModal = _ref.closeModal,
      enrollmentState = _ref.enrollmentState,
      enrollType = _ref.enrollType;
  return /*#__PURE__*/_jsxs(UIModal, {
    use: "default",
    size: "medium",
    width: 980,
    "data-test-id": "sequence-enrollment-modal",
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: closeModal
      }), /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.title.enrollType." + enrollType
        })
      })]
    }), /*#__PURE__*/_jsx(FireAlarm, {
      appName: TEMPLATES_SEQUENCES_APPNAME
    }), /*#__PURE__*/_jsxs(UIDialogBody, {
      className: "sequence-editor-modal-dialog p-x-0 p-bottom-1 p-top-0",
      children: [/*#__PURE__*/_jsx(UIFloatingAlertList, {
        alertStore: SalesModalAlertsStore,
        use: "contextual"
      }), /*#__PURE__*/_jsx(SequenceEnrollmentContainer, {
        onConfirm: onConfirm,
        enrolledSequence: enrolledSequence,
        sequenceId: sequenceId,
        stepEnrollments: stepEnrollments,
        isWithinSalesModal: isWithinSalesModal,
        enrollmentState: enrollmentState
      })]
    })]
  });
};

SequenceEnrollmentModal.defaultProps = {
  onConfirm: function onConfirm() {}
};
SequenceEnrollmentModal.propTypes = {
  enrolledSequence: PropTypes.instanceOf(ImmutableMap),
  sequenceId: PropTypes.number,
  onConfirm: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isWithinSalesModal: PropTypes.bool,
  enrollmentState: PropTypes.string,
  enrollType: EnrollTypePropType.isRequired,
  stepEnrollments: PropTypes.instanceOf(List)
};
export default SequenceEnrollmentModal;