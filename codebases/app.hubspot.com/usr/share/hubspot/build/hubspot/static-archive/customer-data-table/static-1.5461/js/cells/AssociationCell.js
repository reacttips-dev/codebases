'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { Map as ImmutableMap } from 'immutable';
import AvatarCell from './AvatarCell';
import EmptyState from '../Components/EmptyState';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ProfileLinkCell from './ProfileLinkCell';
import PropTypes from 'prop-types';
import { memo } from 'react';
import ResolvedCell from './ResolvedCell';
import get from 'transmute/get';

var AssociationCell = function AssociationCell(_ref) {
  var value = _ref.value,
      objectType = _ref.objectType;
  var associatedCompanyIds = get('associatedCompanyIds', value);
  var associatedDealIds = get('associatedDealIds', value);
  var associatedVids = get('associatedVids', value);
  var associatedTicketIds = get('associatedTicketIds', value);

  if (objectType === CONTACT && associatedVids) {
    return /*#__PURE__*/_jsx(ResolvedCell, {
      CustomCell: AvatarCell,
      id: associatedVids.first(),
      objectType: CONTACT
    });
  }

  if (objectType === COMPANY && associatedCompanyIds) {
    return /*#__PURE__*/_jsx(ResolvedCell, {
      CustomCell: AvatarCell,
      id: associatedCompanyIds.first(),
      objectType: COMPANY
    });
  }

  if (associatedCompanyIds && associatedCompanyIds.size) {
    return /*#__PURE__*/_jsx(ResolvedCell, {
      CustomCell: AvatarCell,
      id: associatedCompanyIds.first(),
      objectType: COMPANY
    });
  }

  if (associatedVids && associatedVids.size) {
    return /*#__PURE__*/_jsx(ResolvedCell, {
      CustomCell: AvatarCell,
      id: associatedVids.first(),
      objectType: CONTACT
    });
  }

  if (associatedDealIds && associatedDealIds.size) {
    return /*#__PURE__*/_jsx(ResolvedCell, {
      CustomCell: ProfileLinkCell,
      id: associatedDealIds.first(),
      objectType: DEAL
    });
  }

  if (associatedTicketIds && associatedTicketIds.size) {
    return /*#__PURE__*/_jsx(ResolvedCell, {
      CustomCell: ProfileLinkCell,
      id: associatedTicketIds.first(),
      objectType: TICKET
    });
  }

  return /*#__PURE__*/_jsx(EmptyState, {});
};

AssociationCell.propTypes = {
  objectType: PropTypes.string,
  value: ImmutablePropTypes.map
};
AssociationCell.defaultProps = {
  value: ImmutableMap()
};
export default /*#__PURE__*/memo(AssociationCell);