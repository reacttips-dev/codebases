'use es6';

import always from 'transmute/always';
import I18n from 'I18n';
import { USER } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { makeReferenceIdFieldDefinition } from 'customer-data-filters/filterQueryFormat/fieldDefinitions/makeReferenceIdFieldDefinition';
export default {
  hs_created_by: makeReferenceIdFieldDefinition({
    getLabelString: always(I18n.text('recordProperties.activity_created_by')),
    referencedObjectType: USER
  })
};