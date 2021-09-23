'use es6';

import { CONTACT, COMPANY } from 'customer-data-objects/constants/ObjectTypes';
import { List, Set as ImmutableSet } from 'immutable';
import set from 'transmute/set';
import always from 'transmute/always';
/**
 * Properties that should not be visible in Filters.
 */

export var HiddenFilterProperties = ImmutableSet.of('dealstage.probability');
export var VisibleFilterProperties = ImmutableSet.of('associatedcompanyid', 'associations.company', 'associations.contact');
/**
 * Returns `true` if the PropertyRecord should be visible to users in the filter panel.
 *
 * @param  {any}
 * @param  {PropertyRecord}
 * @return {bool}
 */

export function isVisibleFilterProperty(scopes, _ref, objectType) {
  var hidden = _ref.hidden,
      name = _ref.name,
      searchable = _ref.searchable;
  var getIsUngated = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : always(false);
  // All non-contact lists use ILS, but we are limiting it to just companies for now.
  // Contact lists are being migrated to ILS behind the 'crm:segments:ilsSegmentsUiRollup' gate.
  var hasILSLists = objectType === COMPANY || objectType === CONTACT && getIsUngated('crm:segments:ilsSegmentsUiRollup');

  if (name === 'ilsListMemberships.listId') {
    return hasILSLists && scopes && !!scopes['ils-lists-read'];
  }

  if (name === 'listMemberships.listId') {
    return !hasILSLists && scopes && !!scopes['contacts-lists-read'];
  }

  switch (name) {
    case '_inbounddbio.importid_':
      return scopes && !!scopes['crm-import'];

    case 'formSubmissions.formId':
      return scopes && !!scopes['crm-forms-filtering'];

    default:
      return VisibleFilterProperties.contains(name) || !hidden && !HiddenFilterProperties.contains(name) && searchable;
  }
}
/**
 * Properties that should not be visible in the Grid.
 */

export var HiddenGridProperties = ImmutableSet.of('_inbounddbio.importid_', 'associations.company', 'associations.contact', 'dealstage.probability', 'formSubmissions.formId', 'listMemberships.listId', 'ilsListMemberships.listId', 'engagement.createdBy', 'engagement.type');
export var VisibleGridProperties = ImmutableSet.of('associatedcompanyid', 'metadata.reminders');
/**
 * Returns `true` if the PropertyRecord should be visible to users in the grid.
 *
 * @param  {any}
 * @param  {PropertyRecord}
 * @return {bool}
 */

export function isVisibleGridProperty(scopes, _ref2) {
  var hidden = _ref2.hidden,
      name = _ref2.name,
      searchable = _ref2.searchable;
  return VisibleGridProperties.contains(name) || !hidden && searchable && !HiddenGridProperties.contains(name);
}
export var addHubspotDefinedToPropertyOptions = function addHubspotDefinedToPropertyOptions(property) {
  var hubspotDefined = property.hubspotDefined,
      _property$options = property.options,
      options = _property$options === void 0 ? List() : _property$options;
  var parsedOptions = hubspotDefined ? options.map(function (option) {
    return set('hubspotDefined', true, option);
  }) : options;
  return set('options', parsedOptions, property);
};