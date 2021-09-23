'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import getAdditionalPropertiesByEventType from '../../util/getAdditionalPropertiesByEventType';
import EnrollmentManagementTable from 'SequencesUI/components/enrollmentManagement/EnrollmentManagementTable';
import TableError from 'SequencesUI/components/enrollmentManagement/TableError';
import H2 from 'UIComponents/elements/headings/H2';
import H4 from 'UIComponents/elements/headings/H4';
import UIResultsMessage from 'UIComponents/results/UIResultsMessage';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import Small from 'UIComponents/elements/Small';

var EnrollmentEngagementEventTable = function EnrollmentEngagementEventTable(_ref) {
  var eventType = _ref.eventType,
      query = _ref.query,
      onReject = _ref.onReject,
      onUpdateQuery = _ref.onUpdateQuery,
      totalEnrollments = _ref.totalEnrollments;

  var EmptyStateComponent = function EmptyStateComponent() {
    return /*#__PURE__*/_jsxs(UIResultsMessage, {
      illustration: "empty-state-charts",
      children: [/*#__PURE__*/_jsx(H4, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.table.emptyState.filter.title"
        })
      }), /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.table.emptyState.filter.description"
        })
      })]
    });
  }; // TODO In the future, the property labels will be sufficient for the column names
  // Will need to use PropertyTranslator for HubSpot defined properties


  var columns = [{
    propertyName: 'hs_contact_id',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesui.analyze.table.headers.contact"
    })
  }, {
    propertyName: 'hs_company_id',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchTableHeader.company"
    })
  }, {
    propertyName: 'hs_sequence_id',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesui.analyze.table.headers.sequence"
    })
  }, {
    propertyName: 'hs_enrollment_state',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchTableHeader.contactEngagement"
    })
  }];
  return /*#__PURE__*/_jsxs(UIModal, {
    width: "90%",
    "data-test-id": "overview-drilldown-table",
    children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.engagementEventModal.title." + eventType
        })
      }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
        "data-test-id": "overview-drilldown-table-close-button",
        onClick: onReject
      })]
    }), /*#__PURE__*/_jsx(UIDialogBody, {
      children: /*#__PURE__*/_jsxs("div", {
        className: "p-bottom-8",
        children: [totalEnrollments > 0 && /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(Small, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sequencesui.analyze.engagementEventModal.description.totalEnrollments",
              options: {
                count: totalEnrollments
              }
            })
          })
        }), /*#__PURE__*/_jsx(EnrollmentManagementTable, {
          query: query,
          onUpdateQuery: onUpdateQuery,
          ErrorComponent: TableError,
          EmptyStateComponent: EmptyStateComponent,
          columns: columns.concat(getAdditionalPropertiesByEventType(eventType)),
          showActions: false
        })]
      })
    })]
  });
};

export default EnrollmentEngagementEventTable;