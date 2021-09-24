'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _storesByType;

import CompaniesStore from 'crm_data/companies/CompaniesStore';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import ContactsStore from 'crm_data/contacts/ContactsStore';
import DealsStore from 'crm_data/deals/DealsStore';
import * as LoadingStatus from 'crm_data/constants/LoadingStatus';
import { COMPANY, CONTACT, DEAL, VISIT, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import PropTypes from 'prop-types';
import VisitsStore from 'crm_data/prospects/VisitsStore';
import TicketsStore from 'crm_data/tickets/TicketsStore';
import CrmObjectStore from 'crm_data/crmObjects/CrmObjectStore';
import { toCrmObjectKey } from 'customer-data-objects/crmObject/CrmObjectKey';
var storesByType = (_storesByType = {}, _defineProperty(_storesByType, COMPANY, CompaniesStore), _defineProperty(_storesByType, CONTACT, ContactsStore), _defineProperty(_storesByType, DEAL, DealsStore), _defineProperty(_storesByType, VISIT, VisitsStore), _defineProperty(_storesByType, TICKET, TicketsStore), _storesByType);
var SubjectDependency = {
  propTypes: {
    objectType: AnyCrmObjectTypePropType.isRequired,
    subjectId: PropTypes.string
  },
  stores: [CompaniesStore, ContactsStore, CrmObjectStore, DealsStore, TicketsStore, VisitsStore],
  deref: function deref(props) {
    var objectType = props.objectType,
        subjectId = props.subjectId;

    if (subjectId === null) {
      return LoadingStatus.EMPTY;
    }

    var isHubSpotDefinedObject = [COMPANY, CONTACT, DEAL, VISIT, TICKET].includes(objectType);

    if (!isHubSpotDefinedObject) {
      var key = toCrmObjectKey({
        objectId: subjectId,
        objectTypeId: objectType
      });
      return CrmObjectStore.get(key);
    }

    var store = storesByType[objectType];
    return store && store.get(subjectId);
  }
};
export default SubjectDependency;