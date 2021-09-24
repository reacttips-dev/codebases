'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { LINK_TOKEN, DATA_ATTRIBUTE, LOCALE_DATA_ATTRIBUTE, LINK_TYPE_ATTRIBUTE } from './UnsubscribeConstants';
export default (function (data) {
  var _props;

  var linkType = data.linkType,
      url = data.url,
      locale = data.locale;

  var link = /*#__PURE__*/_jsx("a", {
    href: url || LINK_TOKEN,
    children: I18n.text('signatureEditorModal.unsubscribeLink.link', {
      locale: locale
    })
  });

  var text = /*#__PURE__*/_jsx(FormattedReactMessage, {
    message: "signatureEditorModal.unsubscribeLink." + linkType,
    options: {
      link: link,
      locale: locale
    }
  });

  var props = (_props = {}, _defineProperty(_props, DATA_ATTRIBUTE, 'true'), _defineProperty(_props, LINK_TYPE_ATTRIBUTE, linkType), _defineProperty(_props, LOCALE_DATA_ATTRIBUTE, locale), _props);
  return /*#__PURE__*/_jsxs("div", Object.assign({}, props, {
    children: ["--", /*#__PURE__*/_jsx("br", {}), text]
  }));
});