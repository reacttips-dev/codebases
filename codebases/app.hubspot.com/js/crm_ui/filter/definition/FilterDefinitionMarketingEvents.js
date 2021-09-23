'use es6';

import always from 'transmute/always';
import I18n from 'I18n';
import { MARKETING_EVENT_APP_NAME } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { makeReferenceIdFieldDefinition } from 'customer-data-filters/filterQueryFormat/fieldDefinitions/makeReferenceIdFieldDefinition';
export default {
  hs_app_id: makeReferenceIdFieldDefinition({
    getLabelString: always(I18n.text('filterSidebar.fieldDefinitions.marketingEvents.appId')),
    referencedObjectType: MARKETING_EVENT_APP_NAME
  })
};