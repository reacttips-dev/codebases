'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import classNames from 'classnames';
import UIFlex from 'UIComponents/layout/UIFlex';
import SequenceSetTimezone from 'sales-modal/components/enrollModal/header/SequenceSetTimezone';
import EnrollmentSettingsPopover from 'sales-modal/components/enrollmentSettings/EnrollmentSettingsPopover';
import SequenceEnrollBreadcrumbs from 'sales-modal/components/enrollModal/header/SequenceEnrollBreadcrumbs';
import UIBox from 'UIComponents/layout/UIBox';
import StartingStepSelect from './header/StartingStepSelect';

function EnrollmentEditorHeader(_ref) {
  var className = _ref.className,
      sequenceEnrollment = _ref.sequenceEnrollment,
      goBackToSequences = _ref.goBackToSequences,
      isWithinSalesModal = _ref.isWithinSalesModal,
      timezone = _ref.timezone;
  return /*#__PURE__*/_jsx("div", {
    className: classNames(className, 'sequence-enroll-modal-header p-x-5 p-y-3'),
    children: /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      children: [/*#__PURE__*/_jsx(UIBox, {
        grow: 1,
        children: /*#__PURE__*/_jsxs(UIFlex, {
          align: "center",
          children: [/*#__PURE__*/_jsx(SequenceEnrollBreadcrumbs, {
            isWithinSalesModal: isWithinSalesModal,
            goBackToSequences: goBackToSequences
          }), /*#__PURE__*/_jsx(StartingStepSelect, {}), /*#__PURE__*/_jsx(SequenceSetTimezone, {
            timezone: timezone
          })]
        })
      }), /*#__PURE__*/_jsx(UIBox, {
        children: /*#__PURE__*/_jsx(EnrollmentSettingsPopover, {
          sequenceEnrollment: sequenceEnrollment
        })
      })]
    })
  });
}

EnrollmentEditorHeader.propTypes = {
  className: PropTypes.string,
  sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
  goBackToSequences: PropTypes.func,
  isWithinSalesModal: PropTypes.bool.isRequired,
  timezone: PropTypes.string.isRequired
};
export default EnrollmentEditorHeader;