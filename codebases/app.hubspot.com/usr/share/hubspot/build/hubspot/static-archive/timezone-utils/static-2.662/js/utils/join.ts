import I18n from 'I18n';
export default (function (names) {
  return names.join(I18n.text('timezone_utils.join'));
});