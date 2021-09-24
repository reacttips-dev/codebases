'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import defaultTopEnrollmentsQuery from '../../query/defaultTopEnrollmentsQuery';
import EnrollmentManagementTable from 'SequencesUI/components/enrollmentManagement/EnrollmentManagementTable';
import TableError from 'SequencesUI/components/enrollmentManagement/TableError';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UICardSection from 'UIComponents/card/UICardSection';
import H2 from 'UIComponents/elements/headings/H2';
import UIResultsMessage from 'UIComponents/results/UIResultsMessage';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIEmptyState from 'UIComponents/empty/UIEmptyState';
import H4 from 'UIComponents/elements/headings/H4';

var TopEnrollmentsTable = function TopEnrollmentsTable(_ref) {
  var location = _ref.location,
      filterGroups = _ref.filterGroups;

  var _useState = useState(defaultTopEnrollmentsQuery(filterGroups)),
      _useState2 = _slicedToArray(_useState, 2),
      query = _useState2[0],
      setQuery = _useState2[1];

  useEffect(function () {
    setQuery(defaultTopEnrollmentsQuery(filterGroups));
  }, [filterGroups]);

  var EmptyStateComponent = function EmptyStateComponent() {
    return location.search ? /*#__PURE__*/_jsxs(UIResultsMessage, {
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
    }) : /*#__PURE__*/_jsx(UIEmptyState, {
      className: "m-bottom-10",
      titleText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "summary.sequenceSummaryZeroState.title"
      }),
      primaryContent: /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.table.emptyState.noEnrollments"
        })
      }),
      secondaryContent: /*#__PURE__*/_jsx(UIIllustration, {
        name: "empty-state-charts",
        width: "100%",
        responsive: false
      }),
      secondaryContentWidth: 210
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
  }, {
    propertyName: 'hs_email_open_count',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesui.analyze.table.headers.opens"
    })
  }, {
    propertyName: 'hs_email_click_count',
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesui.analyze.table.headers.clicks"
    })
  }];
  return /*#__PURE__*/_jsxs(UICardWrapper, {
    compact: true,
    "data-test-id": "top-enrollments-table",
    children: [/*#__PURE__*/_jsx(UICardSection, {
      children: /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.analyze.topEnrollmentsTable.title"
        })
      })
    }), /*#__PURE__*/_jsx(EnrollmentManagementTable, {
      query: query,
      onUpdateQuery: function onUpdateQuery(newQuery) {
        return setQuery(newQuery);
      },
      ErrorComponent: TableError,
      EmptyStateComponent: EmptyStateComponent,
      columns: columns,
      showActions: false,
      limit: 20
    })]
  });
};

TopEnrollmentsTable.propTypes = {
  filterGroups: PropTypes.instanceOf(List),
  location: PropTypes.object.isRequired
};
export default TopEnrollmentsTable;