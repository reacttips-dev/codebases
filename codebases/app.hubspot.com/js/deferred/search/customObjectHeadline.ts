export default function (result) {
  var properties = result.properties;
  var primaryDisplayLabelPropertyName = properties.primaryDisplayLabelPropertyName;
  return properties[primaryDisplayLabelPropertyName];
}