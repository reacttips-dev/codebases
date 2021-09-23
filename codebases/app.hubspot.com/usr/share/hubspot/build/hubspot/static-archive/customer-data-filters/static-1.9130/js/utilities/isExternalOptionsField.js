'use es6';

import { ObjectTypesToIds, ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { isBusinessUnit, isPipelineProperty, isPipelineStageProperty } from 'customer-data-objects/property/PropertyIdentifier'; // This function is meant to provide a way for us to turn on certain external
// options properites as they are added. Eventually we'll be able to remove it
// once all the options we need to resolve are supported by the External Options
// Service.

export var isExternalOptionsField = function isExternalOptionsField(field, filterFamily) {
  // some filters use cases do not provide filterFamily, do not use external options
  // in this case as it will fail
  // details https://hubspot.slack.com/archives/C50LV5B97/p1628177516067500
  if (!filterFamily) {
    return false;
  } // Some usages of the filter still use the old object type constants as a
  // filter family. reference-resolvers-lite requires objectTypeId. This just
  // normalizes the filter family to be an objectTypeId, if the filter family
  // isn't an object type it does nothing.


  var normalizedFilterFamily = ObjectTypesToIds[filterFamily] || filterFamily;
  var denormalizedFilterFamily = ObjectTypeFromIds[filterFamily] || filterFamily;

  if (isPipelineStageProperty(field, normalizedFilterFamily)) {
    return true;
  }

  if (isPipelineProperty(field, normalizedFilterFamily)) {
    return true;
  }

  if (isBusinessUnit(field, denormalizedFilterFamily)) {
    return true;
  }

  return false;
};