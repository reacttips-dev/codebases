'use es6';

import unescapedText from 'I18n/utils/unescapedText';
import { propertyDescriptionTranslator, propertyLabelTranslator } from 'property-translator/propertyTranslator';
export var defaultLabelsByName = {
  'associations.contact': 'customerDataPropertyUtils.PropertyDisplay.associatedcontactid',
  '_inbounddbio.importid_': 'customerDataPropertyUtils.PropertyDisplay.inbounddbImport',
  'associations.company': 'customerDataPropertyUtils.PropertyDisplay.associatedcompanyid',
  'engagement.createdBy': 'customerDataPropertyUtils.PropertyDisplay.taskCreatedBy',
  'engagement.ownerId': 'customerDataPropertyUtils.PropertyDisplay.taskOwner',
  'engagement.timestamp': 'customerDataPropertyUtils.PropertyDisplay.taskDueDate',
  'engagement.type': 'customerDataPropertyUtils.PropertyDisplay.engagementType',
  'formSubmissions.formId': 'customerDataPropertyUtils.PropertyDisplay.formSubmissions',
  'listMemberships.listId': 'customerDataPropertyUtils.PropertyDisplay.listMemberships',
  'metadata.body': 'customerDataPropertyUtils.PropertyDisplay.taskBody',
  'metadata.reminders': 'customerDataPropertyUtils.PropertyDisplay.taskReminder',
  'metadata.status': 'customerDataPropertyUtils.PropertyDisplay.taskStatus',
  'metadata.subject': 'customerDataPropertyUtils.PropertyDisplay.taskSubject',
  'metadata.taskType': 'customerDataPropertyUtils.PropertyDisplay.taskType',
  associatedcompanyid: 'customerDataPropertyUtils.PropertyDisplay.associatedcompanyid',
  relatesTo: 'customerDataPropertyUtils.PropertyDisplay.taskRelatesTo',
  pipeline: 'customerDataPropertyUtils.PropertyDisplay.deals.pipeline',
  days_to_close: 'customerDataPropertyUtils.PropertyDisplay.deals.days_to_close',
  amount_in_home_currency: 'customerDataPropertyUtils.PropertyDisplay.deals.amount_in_home_currency',
  hs_projected_amount: 'customerDataPropertyUtils.PropertyDisplay.deals.hs_projected_amount',
  hs_closed_amount: 'customerDataPropertyUtils.PropertyDisplay.deals.hs_closed_amount',
  hs_projected_amount_in_home_currency: 'customerDataPropertyUtils.PropertyDisplay.deals.hs_projected_amount_in_home_currency',
  hs_closed_amount_in_home_currency: 'customerDataPropertyUtils.PropertyDisplay.deals.hs_closed_amount_in_home_currency',
  hs_deal_stage_probability: 'customerDataPropertyUtils.PropertyDisplay.deals.hs_deal_stage_probability'
};
export function getPropertyDescription(property) {
  if (!property) {
    return undefined;
  }

  var description = property.description,
      label = property.label,
      hubspotDefined = property.hubspotDefined;
  return hubspotDefined ? propertyDescriptionTranslator(label, description) || description : description;
}
export function getPropertyLabel(property) {
  var labelsByName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultLabelsByName;

  if (!property) {
    return undefined;
  }

  var hubspotDefined = property.hubspotDefined,
      label = property.label,
      name = property.name,
      isBidenProperty = property.isBidenProperty;

  if (hubspotDefined && Object.prototype.hasOwnProperty.call(labelsByName, name)) {
    return unescapedText(labelsByName[name]);
  }

  var labelToTranslate = isBidenProperty ? name : label || name;
  var nameSpaceKey = isBidenProperty ? 'bidenProperties' : undefined;
  return hubspotDefined || isBidenProperty ? propertyLabelTranslator(labelToTranslate, nameSpaceKey) || name : labelToTranslate;
}