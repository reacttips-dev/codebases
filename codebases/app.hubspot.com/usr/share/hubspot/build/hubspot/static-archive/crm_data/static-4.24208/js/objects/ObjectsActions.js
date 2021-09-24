'use es6';

import * as CompaniesActions from 'crm_data/companies/CompaniesActions';
import * as ContactsActions from 'crm_data/contacts/ContactsActions';
import * as CrmObjectActions from 'crm_data/crmObjects/CrmObjectActions';
import * as DealsActions from 'crm_data/deals/DealsActions';
import { Map as ImmutableMap } from 'immutable';
import { getObjectType } from 'customer-data-objects/model/ImmutableModel';
import { EMPTY } from 'crm_data/constants/LoadingStatus';
import { COMPANY, CONTACT, DEAL, TICKET, VISIT } from 'customer-data-objects/constants/ObjectTypes';
import * as VisitsActions from 'crm_data/visits/VisitsActions';
import * as TicketsActions from 'crm_data/tickets/TicketsActions';

var getUpdateObjectPropertiesPromise = function getUpdateObjectPropertiesPromise(objectType, subject, updates, options) {
  switch (objectType) {
    case COMPANY:
      return CompaniesActions.updateCompanyProperties(subject, updates, options);

    case CONTACT:
      return ContactsActions.updateContactProperties(subject, updates, options);

    case DEAL:
      return DealsActions.updateDealProperties(subject, updates, options);

    case TICKET:
      return TicketsActions.updateTicketProperties(subject, updates, options);

    default:
      return CrmObjectActions.updateCrmObjectProperties(subject, updates, options);
  }
};

export default {
  bulkUpdateStoresLocal: function bulkUpdateStoresLocal(objectType, ids, updates) {
    var propertyMap = updates ? updates.reduce(function (acc, val, key) {
      return acc.setIn(['properties', key, 'value'], val);
    }, ImmutableMap()) : EMPTY;
    var objectMap = ids.reduce(function (acc, id) {
      return acc.set(id, propertyMap);
    }, ImmutableMap());

    switch (objectType) {
      case COMPANY:
        return CompaniesActions.updateCompanies(objectMap);

      case CONTACT:
        return ContactsActions.updateContacts(objectMap);

      case DEAL:
        return DealsActions.updateDeals(objectMap);

      case TICKET:
        return TicketsActions.updateTickets(objectMap);

      case VISIT:
        return VisitsActions.updateCompanies(objectMap);

      default:
        return CrmObjectActions.updateCrmObjects(objectMap, objectType);
    }
  },
  updateStores: function updateStores(subject, updates, options) {
    if (options == null) {
      options = {};
    }

    var objectType = getObjectType(subject);
    return getUpdateObjectPropertiesPromise(objectType, subject, updates, options).then(function () {
      return options.onSuccess && options.onSuccess(updates);
    }).catch(function (error) {
      return options.onError && options.onError(error);
    });
  },
  refresh: function refresh(objectType, subjectId) {
    if (!objectType || !subjectId) {
      return undefined;
    }

    var ids = [subjectId];

    switch (objectType) {
      case COMPANY:
        return CompaniesActions.refresh(ids);

      case CONTACT:
        return ContactsActions.refresh(ids);

      case DEAL:
        return DealsActions.refresh(ids);

      case TICKET:
        return TicketsActions.refresh(ids);

      case VISIT:
        return VisitsActions.refresh(ids);

      default:
        return CrmObjectActions.refresh(ids, objectType);
    }
  }
};