'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import EnrollmentManagementTable from 'SequencesUI/components/enrollmentManagement/EnrollmentManagementTable';
import SequenceSummarySearchZeroState from './SequenceSummarySearchZeroState';
import SequenceSummaryTableHeader from 'SequencesUI/components/summary/table/SequenceSummaryTableHeader';
import TableError from 'SequencesUI/components/enrollmentManagement/TableError';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import { EnrollmentSelectionPropType } from '../../util/enrollmentSelection';

var SequenceSummaryTableWrapper = function SequenceSummaryTableWrapper(_ref) {
  var bulkProcessingIds = _ref.bulkProcessingIds,
      connectedAccounts = _ref.connectedAccounts,
      enrollmentSelection = _ref.enrollmentSelection,
      onUpdateQuery = _ref.onUpdateQuery,
      query = _ref.query;

  var ErrorComponent = function ErrorComponent() {
    return /*#__PURE__*/_jsx(TableError, {
      navMarkerName: "ENROLLMENTS_TABLE_FAIL"
    });
  };

  var EmptyStateComponent = function EmptyStateComponent() {
    return /*#__PURE__*/_jsx(SequenceSummarySearchZeroState, {
      query: query,
      connectedAccounts: connectedAccounts
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
    propertyName: 'hs_enrolled_by',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchTableHeader.enrolledBy"
    })
  }, {
    propertyName: 'hs_enrolled_at',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchTableHeader.enrolledAt"
    })
  }, {
    propertyName: 'hs_last_executed_step_order',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchTableHeader.lastStepCompleted"
    })
  }, {
    propertyName: 'hs_last_step_executed_at',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchTableHeader.lastStepCompletedAt"
    })
  }, {
    propertyName: 'hs_enrollment_state',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchTableHeader.contactEngagement"
    })
  }];
  return /*#__PURE__*/_jsx(UICardWrapper, {
    className: "sequences-summary-search-table",
    children: /*#__PURE__*/_jsx(EnrollmentManagementTable, {
      bulkProcessingIds: bulkProcessingIds,
      columns: columns,
      EmptyStateComponent: EmptyStateComponent,
      enrollmentSelection: enrollmentSelection,
      ErrorComponent: ErrorComponent,
      HeaderComponent: SequenceSummaryTableHeader,
      onUpdateQuery: onUpdateQuery,
      query: query,
      showPageSizeOptions: true
    })
  });
};

SequenceSummaryTableWrapper.propTypes = {
  bulkProcessingIds: PropTypes.array,
  connectedAccounts: PropTypes.object,
  enrollmentSelection: EnrollmentSelectionPropType.isRequired,
  onUpdateQuery: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired
};
export default connect(function (state) {
  return {
    bulkProcessingIds: state.bulkActionProcessing.actionableIds
  };
})(SequenceSummaryTableWrapper);