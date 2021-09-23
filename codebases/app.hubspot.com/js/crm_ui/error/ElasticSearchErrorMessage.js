'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import isString from 'transmute/isString';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import customErrorTypes from '../constants/customErrorTypes';
var CREATING_FILTER_KB_URL = 'https://knowledge.hubspot.com/articles/kcs_article/contacts/create-saved-filters';

var getI18nErrorKey = function getI18nErrorKey(errorType, message) {
  var response = {
    i18nErrorKey: undefined
  };

  if (!message) {
    response.i18nErrorKey = 'elasticSearch.defaultBadInput_jsx';
    response.header = 'elasticSearch.defaultTitle';
    response.showIllustration = false;
  }

  switch (errorType) {
    case 'INVALID_NUMBER':
    case 'INVALID_LONG':
      response.i18nErrorKey = 'elasticSearch.badNumber';
      break;

    case 'INVALID_DATE':
      response.i18nErrorKey = 'elasticSearch.badDate';
      break;

    case 'QUERY_EXCEEDS_WORD_LIMIT':
      response.i18nErrorKey = 'elasticSearch.wordLimit';
      break;

    case 'QUERY_EXCEEDS_CHARACTER_LIMIT':
      response.i18nErrorKey = 'elasticSearch.characterLimit';
      break;

    default:
      break;
  }

  return response;
};

var getAdditionalI18nProps = function getAdditionalI18nProps(errorType, value, i18nErrorKey) {
  var response = {};

  if (i18nErrorKey === 'elasticSearch.defaultBadInput_jsx') {
    response.options = {
      href: window.location.href
    };
    response.elements = {
      Link: UILink
    };
  }

  switch (errorType) {
    case 'INVALID_NUMBER':
    case 'INVALID_LONG':
    case 'INVALID_DATE':
      response.options = {
        value: value
      };
      break;

    default:
      break;
  }

  return response;
}; // Used for returning custom title in QueryErrorStateMessage.js


export var getErrorMessageType = function getErrorMessageType(error) {
  if (!error || error.status !== 400) {
    return undefined;
  }

  if (error.responseJSON && isString(error.responseJSON.message) && error.responseJSON.message.includes('Result window is too large')) {
    return customErrorTypes.TOO_MANY_RECORDS;
  }

  return customErrorTypes.CONTACT_SEARCH_FILTERS;
};

var ElasticSearchErrorMessage = function ElasticSearchErrorMessage(error) {
  if (!error || !error.responseJSON) {
    return {
      subtext: ''
    };
  }

  var _error$responseJSON = error.responseJSON,
      value = _error$responseJSON.value,
      errorType = _error$responseJSON.error,
      message = _error$responseJSON.message;

  if (isString(message) && message.includes('Invalid query of length')) {
    return {
      subtext: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "elasticSearch.characterLimit"
      })
    };
  }

  if (isString(message) && message.includes('Result window is too large')) {
    return {
      subtext: /*#__PURE__*/_jsx(FormattedJSXMessage, {
        elements: {
          UILink: UILink
        },
        message: "elasticSearch.resultLimit_jsx",
        options: {
          href: CREATING_FILTER_KB_URL,
          external: true
        }
      })
    };
  }

  var _getI18nErrorKey = getI18nErrorKey(errorType, message),
      i18nErrorKey = _getI18nErrorKey.i18nErrorKey,
      showIllustration = _getI18nErrorKey.showIllustration,
      header = _getI18nErrorKey.header;

  var additionalProps = getAdditionalI18nProps(errorType, value, i18nErrorKey);
  var response = {
    subtext: message,
    showIllustration: showIllustration,
    header: header
  };

  if (i18nErrorKey) {
    // If props include elements key, this needs to return a JSX component
    // Otherwise it can be plaintext
    var MessageComponent = additionalProps.elements ? FormattedJSXMessage : FormattedMessage;
    response.subtext = /*#__PURE__*/_jsx(MessageComponent, Object.assign({
      message: i18nErrorKey
    }, additionalProps));
  }

  return response;
};

export default ElasticSearchErrorMessage;