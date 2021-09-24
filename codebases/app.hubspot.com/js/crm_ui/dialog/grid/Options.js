'use es6';

import I18n from 'I18n';
import { Map as ImmutableMap } from 'immutable';
import { getPropertyLabel } from 'customer-data-property-utils/PropertyDisplay';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { isAppId } from 'customer-data-objects/property/PropertyIdentifier'; // Not the cleanest way to accomplish this but needed to override the appId label\
// for Marketing Event objects

export var getOptionLabelOverride = function getOptionLabelOverride(property) {
  if (isAppId(property)) {
    return I18n.text('index.header.columnSelector.propertyLabelOverrides.hs_app_id');
  }

  return null;
};

var fromProperty = function fromProperty(options) {
  var name = options.name,
      type = options.type,
      searchable = options.searchable,
      hidden = options.hidden,
      groupName = options.groupName;
  return ImmutableMap({
    text: getOptionLabelOverride(options) || getPropertyLabel(options),
    value: name,
    type: type,
    searchable: searchable,
    hidden: hidden,
    groupName: groupName
  });
};

var fromProperties = function fromProperties(properties) {
  return properties.map(fromProperty).toList();
};

var fromPropertyGroup = function fromPropertyGroup(group) {
  return ImmutableMap({
    options: group.properties.map(fromProperty),
    text: group.hubspotDefined ? propertyLabelTranslator(group.get('displayName')) : group.get('displayName'),
    value: group.name
  });
};

var fromPropertyGroups = function fromPropertyGroups(groups) {
  return groups.map(fromPropertyGroup).toList();
};

export default {
  fromProperties: fromProperties,
  fromProperty: fromProperty,
  fromPropertyGroup: fromPropertyGroup,
  fromPropertyGroups: fromPropertyGroups
};