export default function (_ref) {
  var engagementType = _ref.properties.engagementType;
  return engagementType ? engagementType[0] + engagementType.substring(1).toLowerCase() : '';
}