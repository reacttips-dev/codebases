'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _groupNames;

import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import memoize from 'transmute/memoize';
import toJS from 'transmute/toJS';
import AssociatedCompanyProperty from 'customer-data-objects/property/special/AssociatedCompanyProperty';
import AssociatedContactProperty from 'customer-data-objects/property/special/AssociatedContactProperty';
import InboundDbImportProperty from 'customer-data-objects/property/special/InboundDbImportProperty';
import InboundDbListMembershipProperty from 'customer-data-objects/property/special/InboundDbListMembershipProperty';
import FormSubmissionsProperty from 'customer-data-objects/property/special/FormSubmissionsProperty';
import ListMembershipsProperty from 'customer-data-objects/property/special/ListMembershipsProperty';
import DealStageProbabilityProperty from 'customer-data-objects/property/special/DealStageProbabilityProperty'; // These groupnames MUST match the internal names of the groups on each object type
// for these magic properties to appear in the correct place.

var groupNames = (_groupNames = {}, _defineProperty(_groupNames, CONTACT_TYPE_ID, 'contactinformation'), _defineProperty(_groupNames, COMPANY_TYPE_ID, 'companyinformation'), _defineProperty(_groupNames, DEAL_TYPE_ID, 'dealinformation'), _defineProperty(_groupNames, TICKET_TYPE_ID, 'ticketinformation'), _groupNames);
export var getMagicPropertyAsJS = function getMagicPropertyAsJS(property, objectTypeId) {
  return Object.assign({}, toJS(property), {
    groupName: groupNames[objectTypeId]
  });
}; // HACK: These are psuedo-properties (magic) that are accepted by crmsearch but are not real properties.
// They are used to filter by things like list membership and associated objects, but cannot be used
// as table columns. This is enforced by GridProperties.

export var getMagicPropertiesForObjectType = memoize(function (objectTypeId) {
  var associatedCompanyProperty = getMagicPropertyAsJS(AssociatedCompanyProperty, objectTypeId);
  var associatedContactProperty = getMagicPropertyAsJS(AssociatedContactProperty, objectTypeId);
  var inbounddbImportProperty = getMagicPropertyAsJS(InboundDbImportProperty, objectTypeId);
  var inbounddbListMembershipProperty = getMagicPropertyAsJS(InboundDbListMembershipProperty, objectTypeId);

  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      {
        var _ref;

        var formSubmissionsProperty = getMagicPropertyAsJS(FormSubmissionsProperty, objectTypeId);
        var listMembershipsProperty = getMagicPropertyAsJS(ListMembershipsProperty, objectTypeId);
        return _ref = {}, _defineProperty(_ref, inbounddbImportProperty.name, inbounddbImportProperty), _defineProperty(_ref, inbounddbListMembershipProperty.name, inbounddbListMembershipProperty), _defineProperty(_ref, formSubmissionsProperty.name, formSubmissionsProperty), _defineProperty(_ref, listMembershipsProperty.name, listMembershipsProperty), _ref;
      }

    case COMPANY_TYPE_ID:
      {
        var _ref2;

        return _ref2 = {}, _defineProperty(_ref2, inbounddbImportProperty.name, inbounddbImportProperty), _defineProperty(_ref2, inbounddbListMembershipProperty.name, inbounddbListMembershipProperty), _ref2;
      }

    case DEAL_TYPE_ID:
      {
        var _ref3;

        var dealStageProbabilityProperty = getMagicPropertyAsJS(DealStageProbabilityProperty, objectTypeId);
        return _ref3 = {}, _defineProperty(_ref3, associatedCompanyProperty.name, associatedCompanyProperty), _defineProperty(_ref3, associatedContactProperty.name, associatedContactProperty), _defineProperty(_ref3, inbounddbImportProperty.name, inbounddbImportProperty), _defineProperty(_ref3, inbounddbListMembershipProperty.name, inbounddbListMembershipProperty), _defineProperty(_ref3, dealStageProbabilityProperty.name, dealStageProbabilityProperty), _ref3;
      }

    case TICKET_TYPE_ID:
      {
        var _ref4;

        return _ref4 = {}, _defineProperty(_ref4, associatedCompanyProperty.name, associatedCompanyProperty), _defineProperty(_ref4, associatedContactProperty.name, associatedContactProperty), _defineProperty(_ref4, inbounddbImportProperty.name, inbounddbImportProperty), _defineProperty(_ref4, inbounddbListMembershipProperty.name, inbounddbListMembershipProperty), _ref4;
      }

    default:
      {
        return {};
      }
  }
});