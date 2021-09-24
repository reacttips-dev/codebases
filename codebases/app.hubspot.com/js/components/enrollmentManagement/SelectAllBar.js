'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import PropTypes from 'prop-types';
import Small from 'UIComponents/elements/Small';
import UILink from 'UIComponents/link/UILink';
import { EnrollmentSelectionPropType } from '../../util/enrollmentSelection';
import { CALYPSO_LIGHT } from 'HubStyleTokens/colors';
import { tracker } from '../../util/UsageTracker';

function SelectAllBar(_ref) {
  var _ref$enrollmentSelect = _ref.enrollmentSelection,
      deselectAllEnrollments = _ref$enrollmentSelect.deselectAllEnrollments,
      selectAllMatches = _ref$enrollmentSelect.selectAllMatches,
      selectedAllMatches = _ref$enrollmentSelect.selectedAllMatches,
      selectedEnrollments = _ref$enrollmentSelect.selectedEnrollments,
      sequenceEnrollments = _ref.sequenceEnrollments;

  if (selectedEnrollments.length === sequenceEnrollments.total) {
    return null;
  }

  var onSelectAllClick = function onSelectAllClick() {
    tracker.track('sequencesInteraction', {
      action: 'Select all enrollments',
      subscreen: 'sequence-summary'
    });
    selectAllMatches();
  };

  return /*#__PURE__*/_jsx("tr", {
    style: {
      backgroundColor: CALYPSO_LIGHT
    },
    children: /*#__PURE__*/_jsx("td", {
      colSpan: 9,
      className: "text-center",
      style: {
        height: 'auto',
        padding: '10px'
      },
      children: selectedAllMatches ? /*#__PURE__*/_jsx(Small, {
        children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
          elements: {
            Link: function Link(props) {
              return /*#__PURE__*/_jsx(UILink, Object.assign({
                onClick: deselectAllEnrollments
              }, props));
            }
          },
          message: "summary.selectAllBar.allSelected_jsx",
          options: {
            pageEnrollmentCount: selectedEnrollments.length,
            totalEnrollmentCount: sequenceEnrollments.total
          }
        })
      }) : /*#__PURE__*/_jsx(Small, {
        children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
          elements: {
            Link: function Link(props) {
              return /*#__PURE__*/_jsx(UILink, Object.assign({
                onClick: onSelectAllClick
              }, props));
            }
          },
          message: "summary.selectAllBar.pageSelected_jsx",
          options: {
            pageEnrollmentCount: selectedEnrollments.length,
            totalEnrollmentCount: sequenceEnrollments.total
          }
        })
      })
    })
  });
}

SelectAllBar.propTypes = {
  enrollmentSelection: EnrollmentSelectionPropType.isRequired,
  sequenceEnrollments: PropTypes.object.isRequired
};
export default SelectAllBar;