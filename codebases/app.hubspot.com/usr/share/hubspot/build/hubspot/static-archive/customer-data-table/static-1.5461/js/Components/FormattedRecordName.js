'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { COMPANY, CONTACT, OWNER } from 'customer-data-objects/property/ExternalOptionTypes';
import { formatOwner } from '../tableFunctions';
import { formatWithEmail } from 'customer-data-objects/owners/FormatOwnerName';
import { getProperty } from 'customer-data-objects/record/ObjectRecordAccessors';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import EmptyState from './EmptyState';
import FormattedName from 'I18n/components/FormattedName';
import OwnerRecord from 'customer-data-objects/owners/OwnerRecord';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var FormattedRecordName = function FormattedRecordName(props) {
  var objectType = props.objectType,
      record = props.record;
  var formattedName = useMemo(function () {
    if (objectType === COMPANY) {
      var name = getProperty(record, 'name');
      return name;
    } else if (objectType === OWNER) {
      return formatWithEmail(formatOwner(record));
    } else if (objectType === CONTACT) {
      var familyName = getProperty(record, 'lastname');
      var givenName = getProperty(record, 'firstname');

      if (givenName || familyName) {
        return /*#__PURE__*/_jsx(FormattedName, {
          familyName: familyName,
          givenName: givenName
        });
      } else {
        return getProperty(record, 'email');
      }
    }

    return undefined;
  }, [objectType, record]);
  if (!record) return /*#__PURE__*/_jsx(EmptyState, {});
  return /*#__PURE__*/_jsx(UITooltip, {
    title: formattedName,
    children: /*#__PURE__*/_jsx("span", {
      className: "truncate-text",
      children: formattedName || /*#__PURE__*/_jsx(EmptyState, {})
    })
  });
};

FormattedRecordName.propTypes = {
  objectType: PropTypes.string.isRequired,
  record: PropTypes.oneOfType([PropTypes.instanceOf(OwnerRecord), PropTypes.instanceOf(ContactRecord), PropTypes.instanceOf(CompanyRecord)])
};
export default FormattedRecordName;