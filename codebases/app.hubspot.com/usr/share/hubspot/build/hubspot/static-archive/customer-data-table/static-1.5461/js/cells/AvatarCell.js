'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { COMPANY, CONTACT, OWNER } from 'customer-data-objects/property/ExternalOptionTypes';
import { EERIE } from 'HubStyleTokens/colors';
import { delayUntilIdle } from '../utils/delayUntilIdle';
import { getIdFromRecordOrValue, getIdTypeFromRecordOrValue, getPropertyOrValue } from '../tableFunctions';
import AvatarLabel from 'customer-data-table/Components/AvatarLabel';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import ImmutablePropTypes from 'react-immutable-proptypes';
import OwnerLabel from 'customer-data-table/Components/OwnerLabel';
import OwnerRecord from 'customer-data-objects/owners/OwnerRecord';
import PreviewClickButton from 'customer-data-table/Components/PreviewClickButton';
import PropTypes from 'prop-types';
import { memo, useEffect, useMemo, useState } from 'react';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIconCircle from 'UIComponents/icon/UIIconCircle';
import always from 'transmute/always';
import get from 'transmute/get';
import styled from 'styled-components';
export var getLookup = function getLookup(record) {
  var type = getIdTypeFromRecordOrValue(record); // Passing a lookup for ownerId causes the avatar to fail to load

  if (type === 'ownerId') {
    return undefined;
  }

  return type ? {
    type: type,
    primaryIdentifier: getIdFromRecordOrValue(record)
  } : undefined;
};
var StyledWrapper = styled(UIFlex).attrs({
  align: 'center',
  direction: 'row'
}).withConfig({
  displayName: "AvatarCell__StyledWrapper",
  componentId: "sc-1avty76-0"
})(["color:", ";"], function (_ref) {
  var isEmpty = _ref.isEmpty;
  return isEmpty ? EERIE : null;
});

var AvatarCell = function AvatarCell(props) {
  var canEdit = props.canEdit,
      objectType = props.objectType,
      onAssignContact = props.onAssignContact,
      onPreviewClick = props.onPreviewClick,
      original = props.original,
      record = props.value;
  var id = getIdFromRecordOrValue(record);
  var rowId = getIdFromRecordOrValue(original);
  var lookup = getLookup(record);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      browserIsIdle = _useState2[0],
      setBrowserIsIdle = _useState2[1];

  useEffect(function () {
    delayUntilIdle(function () {
      setBrowserIsIdle(true);
    });
  }, []);
  var avatar = useMemo(function () {
    if (!browserIsIdle) {
      return /*#__PURE__*/_jsx(UIIconCircle, {
        backgroundColor: EERIE,
        className: "m-right-3",
        name: "blank",
        size: 7
      });
    }

    return /*#__PURE__*/_jsx(UIAvatar, {
      className: "m-right-3",
      companyId: objectType === COMPANY ? Number(id) : null,
      domain: objectType === COMPANY ? getPropertyOrValue(record, 'domain') : null,
      email: objectType === CONTACT ? getPropertyOrValue(record, 'email') : null,
      hubSpotUserEmail: get('email', record),
      lookup: lookup,
      size: "xs",
      style: {
        width: '100px !important'
      },
      truncateLength: -1,
      type: objectType === OWNER ? 'hubSpotUserEmail' : null
    }, record && record.hashCode());
  }, [browserIsIdle, id, lookup, objectType, record]);
  return /*#__PURE__*/_jsxs(StyledWrapper, {
    className: "truncate-text",
    isEmpty: !id,
    children: [avatar, objectType === OWNER ? /*#__PURE__*/_jsx(OwnerLabel, {
      canEdit: canEdit(original),
      id: id,
      objectType: objectType,
      onAssignContact: onAssignContact,
      record: record,
      rowId: rowId
    }) : /*#__PURE__*/_jsx(AvatarLabel, {
      id: id,
      objectType: objectType,
      record: record
    }), onPreviewClick && /*#__PURE__*/_jsx(PreviewClickButton, {
      id: id,
      onPreviewClick: onPreviewClick
    })]
  });
};

AvatarCell.propTypes = {
  canEdit: PropTypes.func,
  objectType: PropTypes.string.isRequired,
  onAssignContact: PropTypes.func,
  onPreviewClick: PropTypes.func,
  original: PropTypes.oneOfType([PropTypes.object, ImmutablePropTypes.map, ImmutablePropTypes.record]),
  value: PropTypes.oneOfType([PropTypes.instanceOf(OwnerRecord), PropTypes.instanceOf(ContactRecord), PropTypes.instanceOf(CompanyRecord)])
};
AvatarCell.defaultProps = {
  canEdit: always(false)
};
export default /*#__PURE__*/memo(AvatarCell);