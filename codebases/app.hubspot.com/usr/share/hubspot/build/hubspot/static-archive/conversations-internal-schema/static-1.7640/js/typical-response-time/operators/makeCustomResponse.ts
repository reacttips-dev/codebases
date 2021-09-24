import I18n from 'I18n';
// FIXME changes runtime
export function makeCustomResponse(_ref) {
  var customResponseQuantity = _ref.customResponseQuantity,
      customResponseUnit = _ref.customResponseUnit;
  return I18n.text("conversations-internal-schema.typicalResponseTime.customResponses." + customResponseUnit, {
    count: customResponseQuantity
  });
}