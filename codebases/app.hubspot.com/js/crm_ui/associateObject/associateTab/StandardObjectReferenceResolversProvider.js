'use es6'; // copied from https://git.hubteam.com/HubSpot/object-builder-ui/blob/master/object-builder-ui-kitchen-sink/static/js/components/ReferenceResolversProvider.js
// but made to be used only with standard objects

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _OBJECT_TYPE_TO_REFER, _ProvideReferenceReso;

import PropTypes from 'prop-types';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import CompanyReferenceResolver from 'reference-resolvers/resolvers/CompanyReferenceResolver';
import ContactReferenceResolver from 'reference-resolvers/resolvers/ContactReferenceResolver';
import DealReferenceResolver from 'reference-resolvers/resolvers/DealReferenceResolver';
import TicketReferenceResolver from 'reference-resolvers/resolvers/TicketReferenceResolver';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';

var StandardObjectReferenceResolversProvider = function StandardObjectReferenceResolversProvider(_ref) {
  var children = _ref.children;
  return children;
};

export var OBJECT_TYPE_TO_REFERENCE_TYPE = (_OBJECT_TYPE_TO_REFER = {}, _defineProperty(_OBJECT_TYPE_TO_REFER, COMPANY, ReferenceObjectTypes.COMPANY), _defineProperty(_OBJECT_TYPE_TO_REFER, CONTACT, ReferenceObjectTypes.CONTACT), _defineProperty(_OBJECT_TYPE_TO_REFER, DEAL, ReferenceObjectTypes.DEAL), _defineProperty(_OBJECT_TYPE_TO_REFER, TICKET, ReferenceObjectTypes.TICKET), _OBJECT_TYPE_TO_REFER);
StandardObjectReferenceResolversProvider.propTypes = {
  children: PropTypes.node
};
export default ProvideReferenceResolvers((_ProvideReferenceReso = {}, _defineProperty(_ProvideReferenceReso, ReferenceObjectTypes.COMPANY, CompanyReferenceResolver), _defineProperty(_ProvideReferenceReso, ReferenceObjectTypes.CONTACT, ContactReferenceResolver), _defineProperty(_ProvideReferenceReso, ReferenceObjectTypes.DEAL, DealReferenceResolver), _defineProperty(_ProvideReferenceReso, ReferenceObjectTypes.TICKET, TicketReferenceResolver), _ProvideReferenceReso))(StandardObjectReferenceResolversProvider);