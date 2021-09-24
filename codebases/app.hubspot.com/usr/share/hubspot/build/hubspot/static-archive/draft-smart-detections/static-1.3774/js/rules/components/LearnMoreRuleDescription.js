'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import { List } from 'immutable';
import UIAccordionItem from 'UIComponents/accordion/UIAccordionItem';
import UIList from 'UIComponents/list/UIList';
import UILink from 'UIComponents/link/UILink';
import Small from 'UIComponents/elements/Small';

var toI18nText = function toI18nText(name, opts) {
  return I18n.text("draftSmartDetections.suggestions.rules.learnMoreRuleDescription." + name, opts);
};

var createLink = function createLink(name, link) {
  return {
    link: link,
    copy: toI18nText(name)
  };
};

var getLinks = function getLinks() {
  return List([createLink('writeEmailsPeopleWant', 'https://blog.hubspot.com/sales/sales-email-template'), createLink('prospectingSalesEmail', 'https://blog.hubspot.com/sales/sales-email-templates-guaranteed-to-get-a-response'), createLink('howToWriteSalesEmail', 'https://www.hubspot.com/sales/sales-email'), createLink('idealLength', 'https://blog.hubspot.com/sales/ideal-length-sales-email'), createLink('maxResults', 'https://blog.hubspot.com/sales/sales-email-templates-examples'), createLink('crmReadyEmails', 'https://www.hubspot.com/sales/crm-ready-sales-email-templates')]);
};

export default (function () {
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx("p", {
      className: "m-bottom-1",
      children: toI18nText('effectiveEmails')
    }), /*#__PURE__*/_jsx(UIAccordionItem, {
      title: I18n.text('draftSmartDetections.suggestions.viewLinks'),
      contentClassName: "m-top-0",
      children: /*#__PURE__*/_jsx(UIList, {
        styled: true,
        childClassName: "m-bottom-3 m-x-0",
        className: "m-all-0 p-all-0",
        children: getLinks().map(function (_ref, index) {
          var link = _ref.link,
              copy = _ref.copy;
          return /*#__PURE__*/_jsx(Small, {
            children: /*#__PURE__*/_jsx(UILink, {
              href: link,
              target: "_blank",
              children: copy
            })
          }, "question-count-link-" + index);
        }).toArray()
      })
    })]
  });
});