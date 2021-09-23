import { close_icon } from '../../templates/icons/close_icon';
import radio_button from '../../templates/icons/search/radio_button';
import checkbox from '../../templates/icons/search/checkbox';
import { text } from 'unified-navigation-ui/utils/NavI18n';
export var feedbackModalTemplate = function feedbackModalTemplate() {
  return "\n    <div class=\"navSearch-modal\">\n      <header class=\"navSearch-modal-header\">\n        <h4>" + text('nav.search.feedback.howUseful', {
    defaultValue: 'How useful are these results?'
  }) + "</h4>\n        <span class=\"modal-close-button\">" + close_icon + "</span>\n      </header>\n      <div class=\"navSearch-modal-content\">\n        <div class=\"navSearch-radio-button\">\n          <input class=\"sr-only\" type=\"radio\" id=\"helpful\" name=\"search-result-feedback\" value=\"helpful\">\n          <span class=\"radio-fill\">" + radio_button + "</span>\n          <label for=\"helpful\">" + text('nav.search.feedback.helpful', {
    defaultValue: 'They are helpful'
  }) + "</label><br>\n        </div>\n        <div class=\"navSearch-radio-button\">\n          <input class=\"sr-only\" type=\"radio\" id=\"not-useful\" name=\"search-result-feedback\" value=\"not-useful\">\n          <span class=\"radio-fill\">" + radio_button + "</span>\n          <label for=\"not-useful\">" + text('nav.search.feedback.notUseful', {
    defaultValue: 'They are not useful'
  }) + "</label><br>\n        </div>\n        <div class=\"navSearch-radio-button\">\n          <input class=\"sr-only\" type=\"radio\" id=\"bad-ranking\" name=\"search-result-feedback\" value=\"bad-ranking\">\n          <span class=\"radio-fill\">" + radio_button + "</span>\n          <label for=\"bad-ranking\">" + text('nav.search.feedback.resultRankingsNotGreat', {
    defaultValue: 'Result rankings are not great'
  }) + "</label><br>\n        </div>\n        <div class=\"navSearch-radio-button\">\n          <input class=\"sr-only\" type=\"radio\" id=\"something-wrong\" name=\"search-result-feedback\" value=\"something-wrong\">\n          <span class=\"radio-fill\">" + radio_button + "</span>\n          <label for=\"something-wrong\">" + text('nav.search.feedback.somethingWrong', {
    defaultValue: 'Something is wrong'
  }) + "</label><br />\n        </div>\n        <div class=\"navSearch-radio-button-error\"></div>\n        <div class=\"navSearch-modal-text\">\n          <label for=\"comments\">" + text('nav.search.feedback.whatWasExpectedResult', {
    defaultValue: 'What was your expected result?'
  }) + "</label><br />\n          <input type=\"text\" id=\"comments\" name=\"comments\" placeholder=\"" + text('nav.search.feedback.optional', {
    defaultValue: 'Optional'
  }) + "\" />\n        </div>\n        <div class=\"navSearch-feedback-checkboxes\">\n          <div class=\"navSearch-feedback-checkbox ok-to-contact selected\">\n            <input class=\"sr-only\" type=\"checkbox\" id=\"ok-to-contact\" name=\"search-result-feedback\" value=\"ok-to-contact\">\n            <span class=\"checkbox-indicator\">" + checkbox + "</span>\n            <label for=\"ok-to-contact\">" + text('nav.search.feedback.okayToContact', {
    defaultValue: "It's okay to contact me about my feedback"
  }) + "</label><br />\n          </div>\n          <div class=\"navSearch-feedback-checkbox include-screenshot selected\">\n            <input class=\"sr-only\" type=\"checkbox\" id=\"include-screenshot\" name=\"search-result-feedback\" value=\"include-screenshot\">\n            <span class=\"checkbox-indicator\">" + checkbox + "</span>\n            <label for=\"include-screenshot\">" + text('nav.search.feedback.includeScreenshot', {
    defaultValue: 'Include screenshot of my results with feedback'
  }) + "</label><br />\n          </div>\n        </div>\n        <button class=\"navSearch-modal-send\">" + text('nav.search.feedback.send', {
    defaultValue: 'Send'
  }) + "</button>\n        <button class=\"navSearch-modal-cancel\">" + text('nav.search.feedback.cancel', {
    defaultValue: 'Cancel'
  }) + "</button>\n      </div>\n    </div>";
};