'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { COMPANY, CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { createLinkFromIdAndObjectType } from 'customer-data-table/tableFunctions';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import EmptyState from './EmptyState';
import FormattedRecordName from './FormattedRecordName';
import PropTypes from 'prop-types';
import { memo } from 'react';
import UILink from 'UIComponents/link/UILink';
export var AvatarLabel = function AvatarLabel(props) {
  var objectType = props.objectType,
      id = props.id,
      record = props.record;

  if (!record) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  var url = id && objectType ? createLinkFromIdAndObjectType(id, objectType) : undefined;

  var formattedName = /*#__PURE__*/_jsx(FormattedRecordName, {
    objectType: objectType,
    record: record
  });

  return url && [CONTACT, COMPANY].includes(objectType) ? /*#__PURE__*/_jsx(UILink, {
    className: "truncate-text align-center",
    href: url,
    children: formattedName
  }) : formattedName;
};
AvatarLabel.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  objectType: PropTypes.oneOf([CONTACT, COMPANY]).isRequired,
  record: PropTypes.oneOfType([PropTypes.instanceOf(ContactRecord), PropTypes.instanceOf(CompanyRecord)])
};
export default /*#__PURE__*/memo(AvatarLabel);