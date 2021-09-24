'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import memoize from 'transmute/memoize';
import FormattedNumber from 'I18n/components/FormattedNumber';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils.js';
import ContactNameCell from './ContactNameCell';
import CompanyNameCell from './CompanyNameCell';
import UserNameCell from './UserNameCell';
import SequencesNameCell from './SequencesNameCell';
import EmptyCell from './EmptyCell';
import SequenceSummaryState from 'SequencesUI/components/summary/table/SequenceSummaryState';
import LastActionCell from './LastActionCell';
import ActionsCell from 'SequencesUI/components/summary/table/ActionsCell';
import UICheckbox from 'UIComponents/input/UICheckbox';
import FormattedDateTime from 'I18n/components/FormattedDateTime';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UITruncateString from 'UIComponents/text/UITruncateString';
import { EnrollmentSelectionPropType, isEnrollmentSelected } from '../../util/enrollmentSelection';
var getContactName = memoize(function (contact) {
  if (!contact) return '';
  return formatName({
    firstName: getPropertyValue(contact, 'firstname'),
    lastName: getPropertyValue(contact, 'lastname'),
    email: getPropertyValue(contact, 'email')
  });
});

var EnrollmentManagementTableRow = function EnrollmentManagementTableRow(_ref) {
  var columns = _ref.columns,
      contact = _ref.contact,
      enrollmentSelection = _ref.enrollmentSelection,
      isProcessing = _ref.isProcessing,
      properties = _ref.properties,
      query = _ref.query,
      sequenceEnrollment = _ref.sequenceEnrollment,
      showActions = _ref.showActions,
      startPolling = _ref.startPolling;

  var formatPropertyValue = function formatPropertyValue(property) {
    var propertyValue = getPropertyValue(sequenceEnrollment, property.name);

    switch (property.name) {
      case 'hs_company_id':
        {
          if (!propertyValue && getPropertyValue(sequenceEnrollment, 'hs_company_name')) {
            return /*#__PURE__*/_jsx(UITruncateString, {
              children: getPropertyValue(sequenceEnrollment, 'hs_company_name')
            });
          }

          if (!propertyValue) return /*#__PURE__*/_jsx(EmptyCell, {});
          return /*#__PURE__*/_jsx(CompanyNameCell, {
            companyId: propertyValue
          });
        }

      case 'hs_enrollment_state':
        {
          return /*#__PURE__*/_jsx(SequenceSummaryState, {
            sequenceEnrollment: sequenceEnrollment,
            isProcessing: isProcessing
          });
        }

      case 'hs_last_executed_step_order':
        {
          return /*#__PURE__*/_jsx(LastActionCell, {
            propertyValue: propertyValue,
            sequenceEnrollment: sequenceEnrollment
          });
        }

      case 'hs_contact_id':
        {
          return /*#__PURE__*/_jsx(ContactNameCell, {
            contactId: propertyValue
          });
        }

      case 'hs_enrolled_by':
        {
          return /*#__PURE__*/_jsx(UserNameCell, {
            userId: propertyValue
          });
        }

      case 'hs_sequence_id':
        {
          return /*#__PURE__*/_jsx(SequencesNameCell, {
            sequenceId: propertyValue
          });
        }

      default:
        {// skip
        }
    }

    switch (property.type) {
      case 'datetime':
        {
          if (!propertyValue) {
            return /*#__PURE__*/_jsx(FormattedMessage, {
              message: "summary.sequenceSummarySearchLastAction.none"
            });
          }

          return /*#__PURE__*/_jsx(FormattedDateTime, {
            format: "ll",
            value: +propertyValue
          });
        }

      case 'number':
        {
          if (!propertyValue) return /*#__PURE__*/_jsx(EmptyCell, {});
          return /*#__PURE__*/_jsx(FormattedNumber, {
            className: "text-right",
            value: +propertyValue
          });
        }

      default:
        {
          return propertyValue || /*#__PURE__*/_jsx(FormattedMessage, {
            message: "summary.sequenceSummarySearchLastAction.none"
          });
        }
    }
  };

  var renderActionsDropdown = function renderActionsDropdown() {
    if (isProcessing) return /*#__PURE__*/_jsx("td", {});
    return /*#__PURE__*/_jsx(ActionsCell, {
      enrollment: sequenceEnrollment,
      startPolling: startPolling,
      contactName: getContactName(contact),
      query: query,
      deselectAllEnrollments: enrollmentSelection.deselectAllEnrollments
    });
  };

  var renderCheckbox = function renderCheckbox() {
    return /*#__PURE__*/_jsx("td", {
      children: /*#__PURE__*/_jsx(UICheckbox, {
        "aria-label": I18n.text('summary.selectContactRow', {
          contactName: getContactName(contact)
        }),
        checked: isEnrollmentSelected(sequenceEnrollment, enrollmentSelection),
        disabled: isProcessing,
        onChange: function onChange(_ref2) {
          var checked = _ref2.target.checked;

          if (checked) {
            enrollmentSelection.selectEnrollments([sequenceEnrollment]);
          } else {
            enrollmentSelection.deselectEnrollments([sequenceEnrollment]);
          }
        }
      })
    });
  };

  return /*#__PURE__*/_jsxs("tr", {
    className: "summary-search-table-row",
    "data-reagan": "summary-table-row",
    "data-test-id": "table-row-enrollment-" + getPropertyValue(sequenceEnrollment, 'hs_enrollment_id'),
    children: [!!enrollmentSelection && renderCheckbox(), columns.map(function (column) {
      return /*#__PURE__*/_jsx("td", {
        children: formatPropertyValue(properties.get(column.propertyName))
      }, column.propertyName);
    }), showActions && renderActionsDropdown()]
  }, sequenceEnrollment.objectId);
};

EnrollmentManagementTableRow.propTypes = {
  sequenceEnrollment: PropTypes.object.isRequired,
  properties: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.shape({
    propertyName: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    defaultSort: PropTypes.bool,
    sortable: PropTypes.bool
  })).isRequired,
  enrollmentSelection: EnrollmentSelectionPropType.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  contact: PropTypes.object,
  query: PropTypes.object.isRequired,
  startPolling: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};
export default EnrollmentManagementTableRow;