import { escape } from '../../../js/utils/escape';
import quickActionUrl from '../../../js/deferred/search/quickActionUrl';
import { text } from 'unified-navigation-ui/utils/NavI18n';

var createLink = function createLink() {
  var buttonText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var quickActionParams = arguments.length > 1 ? arguments[1] : undefined;
  return "<div class=\"navSearch-quickAction-wrapper\">\n  <a \n    href=\"" + quickActionUrl(quickActionParams) + "\" \n    data-quick-action-type=\"create_" + (quickActionParams.type || '') + "\" \n    class=\"navSearch-selectable-button\">\n      <span>" + escape(buttonText) + "</span>\n  </a>\n</div>";
};

export var quickCreateTemplate = function quickCreateTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      query = _ref.query;

  var quickActionContact = {
    query: query,
    type: 'contact'
  };
  var quickActionCompany = {
    query: query,
    type: 'company'
  };
  var contactText = query ? text('nav.search.createContactWithQuery', {
    searchTerm: query,
    defaultValue: "Create new contact for \"" + query + "\""
  }) : text('nav.search.createContact', {
    searchTerm: query,
    defaultValue: 'Create new contact'
  });
  var companyText = query ? text('nav.search.createCompanyWithQuery', {
    searchTerm: query,
    defaultValue: "Create new company for \"" + query + "\""
  }) : text('nav.search.createCompany', {
    searchTerm: query,
    defaultValue: 'Create new company'
  });
  return "<div class=\"navSearch-quickActions\">\n    " + createLink(contactText, quickActionContact) + "\n    " + createLink(companyText, quickActionCompany) + "\n  </div>";
};