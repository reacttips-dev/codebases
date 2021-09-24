'use es6'; // See https://git.hubteam.com/HubSpot/InboundDbAssociations/blob/c5e9a5281b2b172f558e80f82371d6280297e9fb/InboundDbAssociationsBase/src/main/java/com/hubspot/inbounddb/associations/base/AssociationCategory.java

export var HUBSPOT_DEFINED = 'HUBSPOT_DEFINED';
export var USER_DEFINED = 'USER_DEFINED';
export var INTEGRATOR_DEFINED = 'INTEGRATOR_DEFINED';
export var AssociationCategoryTypesToIds = {
  HUBSPOT_DEFINED: '0',
  USER_DEFINED: '1',
  INTEGRATOR_DEFINED: '2'
};
export var AssociationCategoryIdsToTypes = {
  '0': HUBSPOT_DEFINED,
  '1': USER_DEFINED,
  '2': INTEGRATOR_DEFINED
};