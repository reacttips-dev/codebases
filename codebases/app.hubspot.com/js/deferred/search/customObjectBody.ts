export default function (result) {
  var properties = result.properties;
  var matchedPropertyNames = properties.matchedPropertyNames,
      primaryDisplayLabelPropertyName = properties.primaryDisplayLabelPropertyName;
  var displayProperties = matchedPropertyNames && matchedPropertyNames.filter(function (property) {
    return property !== primaryDisplayLabelPropertyName;
  });
  return displayProperties.length > 0 ? "" + displayProperties[0].charAt(0).toUpperCase() + displayProperties[0].slice(1) + ": " + properties[displayProperties[0]] : null;
}