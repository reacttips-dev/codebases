import I18n from 'I18n';
// FIXME changes runtime
export function makeStandardResponse(_ref) {
  var standardResponse = _ref.standardResponse;
  return I18n.text("conversations-internal-schema.typicalResponseTime.standardResponses." + standardResponse);
}