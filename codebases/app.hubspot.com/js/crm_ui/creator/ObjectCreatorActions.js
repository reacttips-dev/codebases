'use es6';

import { List } from 'immutable';
import { CONTACT, COMPANY, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { getProperty, setProperty, getId } from 'customer-data-objects/model/ImmutableModel';
import { createContact } from 'crm_data/contacts/ContactsActions';
import { createCompany } from 'crm_data/companies/CompaniesActions';
import { createDeal, createDealWithAssociations } from '../deals/DealsActions';
import { createTicket, createTicketWithAssociations } from 'crm_data/tickets/TicketsActions';
import { associate } from 'crm_data/associations/AssociationsActions';
import { addError } from 'customer-data-ui-utilities/alerts/Alerts';
import { CrmLogger } from 'customer-data-tracking/loggers';
import CurrentOwnerContainer from '../../setup-object-embed/containers/CurrentOwnerContainer';
import defer from 'hs-promise-utils/defer';
import { UNLABELED_ASSOCIATION_BY_OBJECT_TYPES } from '../associateObject/dependencies/labels/AssociationLabelConstants';
export var saveNewObject = function saveNewObject(_ref) {
  var isMarketable = _ref.isMarketable,
      record = _ref.record,
      properties = _ref.properties,
      objectType = _ref.objectType,
      associationObjectType = _ref.associationObjectType,
      associationObjectId = _ref.associationObjectId,
      requestedAssociatedObjects = _ref.requestedAssociatedObjects,
      isUngatedForFlexibleAssociations = _ref.isUngatedForFlexibleAssociations;
  var deferred = defer();
  var hasError = false; // reject if required properties are not filled out

  if (properties && properties.size) {
    properties.forEach(function (property) {
      if (property && property.required) {
        var propertyValue = getProperty(record, property.name);

        if (!propertyValue || propertyValue.length <= 0) {
          addError('crm_components.GenericModal.provideCategoryType', {
            categoryType: property.label
          });
          deferred.reject(record);
          hasError = true;
          return false;
        }
      }

      return true;
    });
  }

  if (hasError) {
    return deferred.promise;
  }

  if (objectType === CONTACT) {
    if (associationObjectType === COMPANY) {
      record = setProperty(record, 'associatedcompanyid', associationObjectId);
    }
  }

  var objectActions = {
    CONTACT: createContact,
    COMPANY: createCompany,
    DEAL: createDeal,
    TICKET: createTicket
  };
  var createAction = objectActions[objectType];

  if (requestedAssociatedObjects) {
    if (associationObjectType === CONTACT || associationObjectType === COMPANY) {
      // Allow the company and/or contacts chosen by the user via the associator
      // select in the panel to override the default we assumed from the record
      // they were viewing at the time
      associationObjectType = undefined;
      associationObjectId = undefined;
    }

    if (objectType === DEAL) {
      createAction = createDealWithAssociations;
    } else if (objectType === TICKET) {
      createAction = createTicketWithAssociations;
    }
  }

  var options = {
    requestedAssociatedObjects: requestedAssociatedObjects,
    isMarketable: isMarketable
  };
  createAction(record, options).then(function (createdObject) {
    if (objectType === TICKET) {
      CrmLogger.log('ticketsDayZero');
    }

    if (associationObjectId) {
      var associationId = isUngatedForFlexibleAssociations ? UNLABELED_ASSOCIATION_BY_OBJECT_TYPES[associationObjectType][objectType] : null;
      return associate(associationObjectId, List([getId(createdObject)]), associationObjectType, objectType, associationId).then(function () {
        return deferred.resolve(createdObject);
      });
    }

    return deferred.resolve(createdObject);
  }).catch(function (error) {
    return deferred.reject(error);
  }).done(); //# ********** PUBLIC EVENT **********
  //# Public Events help teams across HubSpot automate work and customize experiences based on user actions.
  //# Speak with #product-insight and your PM before any shipping any changes to this event

  CrmLogger.logImmediate('createRecord', {
    type: objectType.toLowerCase()
  });
  CrmLogger.logImmediate('createRecordActivation', {
    type: objectType.toLowerCase()
  }); //# ********** PUBLIC EVENT **********

  return deferred.promise;
}; // Creates an object of default properties - works with any object type

export var getDefaultProperties = function getDefaultProperties(objectType, defaultProperties, shouldDefaultOwnerId) {
  if (defaultProperties == null) {
    defaultProperties = {};
  }

  var currentOwner = CurrentOwnerContainer.get();

  if (shouldDefaultOwnerId && !defaultProperties.hubspot_owner_id && currentOwner !== -1) {
    defaultProperties.hubspot_owner_id = currentOwner;
  }

  return defaultProperties;
};