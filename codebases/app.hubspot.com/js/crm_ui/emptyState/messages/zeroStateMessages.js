'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _zeroStates;

import PortalIdParser from 'PortalIdParser';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { MARKETING_EVENT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import isPortalSpecificObjectType from 'customer-data-objects/crmObject/isPortalSpecificObjectType';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import MarketingEventConnectButton from '../ctaComponents/MarketingEventConnectButton';
import { BOARD } from '../../../rewrite/views/constants/PageType';
var langPrefix = 'zeroStates';
var defaultIllustrationWidth = 120;
var zeroStates = (_zeroStates = {}, _defineProperty(_zeroStates, COMPANY, {
  illustration: 'crm',
  subText: langPrefix + ".companies.subText",
  titleText: langPrefix + ".companies.titleText"
}), _defineProperty(_zeroStates, CONTACT, {
  illustration: 'crm',
  subText: langPrefix + ".contacts.subText",
  titleText: langPrefix + ".contacts.titleText"
}), _defineProperty(_zeroStates, DEAL, {
  illustration: 'target',
  linkHref: 'https://blog.hubspot.com/customers/how-to-design-your-sales-process-in-hubspot-crm',
  linkText: langPrefix + ".deals.linkText_jsx",
  subText: langPrefix + ".deals.subText",
  titleText: langPrefix + ".deals.titleText"
}), _defineProperty(_zeroStates, TICKET, {
  illustration: 'tickets',
  illustrationWidth: defaultIllustrationWidth,
  isKnowledgeBaseButton: true,
  subText: langPrefix + ".tickets.subText",
  titleText: langPrefix + ".tickets.titleText",
  linkHref: 'https://knowledge.hubspot.com/articles/kcs_article/tickets/create-tickets',
  linkText: langPrefix + ".tickets.linkText"
}), _defineProperty(_zeroStates, MARKETING_EVENT_TYPE_ID, {
  illustration: 'marketing-events',
  illustrationWidth: 200,
  titleText: langPrefix + ".marketingEvents.titleText",
  renderSubText: function renderSubText() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$isFullPage = _ref.isFullPage,
        isFullPage = _ref$isFullPage === void 0 ? false : _ref$isFullPage;

    var msgProps = isFullPage ? {
      message: langPrefix + ".marketingEvents.fullPageSubText"
    } : {
      message: langPrefix + ".marketingEvents.subText",
      options: {
        href: "/integrations-settings/" + PortalIdParser.get() + "/installed"
      }
    };
    return /*#__PURE__*/_jsx(FormattedHTMLMessage, Object.assign({}, msgProps));
  },
  CustomCTAComponent: MarketingEventConnectButton
}), _defineProperty(_zeroStates, "CUSTOM_OBJECT", {
  illustration: 'custom-objects',
  titleText: langPrefix + ".customObject.titleText",
  subText: langPrefix + ".customObject.subText",
  linkText: langPrefix + ".customObject.linkText_jsx",
  linkHref: 'https://developers.hubspot.com/docs/api/crm/crm-custom-objects'
}), _defineProperty(_zeroStates, "CUSTOM_OBJECT_BOARD", {
  illustration: 'custom-objects',
  titleText: langPrefix + ".customObjectBoard.titleText",
  subText: langPrefix + ".customObjectBoard.subText",
  linkText: langPrefix + ".customObjectBoard.linkText_jsx",
  linkHref: 'https://developers.hubspot.com/docs/api/crm/crm-custom-objects'
}), _defineProperty(_zeroStates, "generic", {
  illustration: 'crm',
  subText: langPrefix + ".generic.subText",
  titleText: langPrefix + ".generic.titleText"
}), _zeroStates);
export var getZeroStateMessage = function getZeroStateMessage(objectType, pageType) {
  if (objectType in zeroStates) {
    return zeroStates[objectType];
  }

  var isPortalSpecificObject = isPortalSpecificObjectType(objectType);

  if (isPortalSpecificObject && pageType === BOARD) {
    return zeroStates.CUSTOM_OBJECT_BOARD;
  }

  if (isPortalSpecificObject) {
    return zeroStates.CUSTOM_OBJECT;
  }

  return null;
};