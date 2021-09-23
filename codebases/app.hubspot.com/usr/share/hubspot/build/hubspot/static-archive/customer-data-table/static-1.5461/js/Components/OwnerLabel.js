'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { OWNER } from 'customer-data-objects/property/ExternalOptionTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedRecordName from './FormattedRecordName';
import OwnerRecord from 'customer-data-objects/owners/OwnerRecord';
import PropTypes from 'prop-types';
import { memo } from 'react';
import UILink from 'UIComponents/link/UILink';

var OwnerLabel = function OwnerLabel(props) {
  var objectType = props.objectType,
      onAssignContact = props.onAssignContact,
      rowId = props.rowId,
      id = props.id,
      record = props.record,
      canEdit = props.canEdit;

  var handleAssignContact = function handleAssignContact() {
    onAssignContact(rowId);
  };

  return onAssignContact && canEdit ? /*#__PURE__*/_jsx(UILink, {
    className: "truncate-text align-center",
    id: "assign-owner-link-" + id,
    onClick: handleAssignContact,
    children: id ? /*#__PURE__*/_jsx(FormattedRecordName, {
      objectType: objectType,
      record: record
    }) : /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataTable.cells.avatar.unassigned"
    })
  }) : id ? /*#__PURE__*/_jsx(FormattedRecordName, {
    className: "truncate-text align-center",
    objectType: objectType,
    record: record
  }) : /*#__PURE__*/_jsx(FormattedMessage, {
    className: "truncate-text align-center",
    message: "customerDataTable.cells.avatar.unassigned"
  });
};

OwnerLabel.propTypes = {
  canEdit: PropTypes.bool,
  id: PropTypes.number,
  objectType: PropTypes.string,
  onAssignContact: PropTypes.func,
  record: PropTypes.instanceOf(OwnerRecord),
  rowId: PropTypes.number
};
OwnerLabel.defaultProps = {
  objectType: OWNER
};
export default /*#__PURE__*/memo(OwnerLabel);