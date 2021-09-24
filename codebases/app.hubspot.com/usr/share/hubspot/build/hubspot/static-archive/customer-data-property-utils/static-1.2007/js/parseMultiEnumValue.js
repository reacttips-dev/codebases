'use es6';
/**
 * Parses the value of a multi enum property (`type=enumeration, fieldType=checkbox`).
 *
 * Values are semicolon-delimited lists of sub-values ('a;b;c'). Each sub-value
 * matches the value of an option in the property definition's `options` array,
 * or of an external option (if `externalOptions=true`).
 *
 * Whitespace is trimmed from values after splitting, and empty values are filtered out.
 *
 * WARNING: it is possible for values to be invalid (not match any existing option),
 * either due to changes made to the options in the property definition, or due to
 * invalid values getting set via sources such as API/import. The BE does not
 * enforce that property values match existing options.
 *
 * See https://git.hubteam.com/HubSpot/customer-data-property-utils/blob/master/static/js/parseMultiEnumValue.js
 * See https://git.hubteam.com/HubSpot/Properties/blob/master/PropertyFormatting/src/main/java/com/hubspot/properties/formatting/formatters/EnumerationFormatter.java#L59
 * See https://git.hubteam.com/HubSpot/InboundDb/blob/master/InboundDbBase/src/main/java/com/hubspot/inbounddb/base/MultiValuePropertyHelper.java#L30
 */

export function parseMultiEnumValue(value) {
  if (typeof value === 'string') {
    return value.split(';').map(function (val) {
      return val.trim();
    }).filter(function (val) {
      return val !== '';
    });
  }

  return value != null ? [value] : [];
}