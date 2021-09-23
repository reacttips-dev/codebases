'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import PortalIdParser from 'PortalIdParser';
import ReturnLinkHelper from '../utils/ReturnLinkHelper';
import productFromUrl from '../utils/productFromUrl';
import UIIcon from 'UIComponents/icon/UIIcon';

var BackLink = function BackLink(_ref) {
  var className = _ref.className,
      onClick = _ref.onClick,
      isDevPortal = _ref.isDevPortal;
  var portalId = PortalIdParser.get();
  var eschref = ReturnLinkHelper.get();

  var getFallbackLink = function getFallbackLink() {
    return isDevPortal ? "/developer/" + portalId : "/dashboard/" + portalId;
  };

  var href = eschref || getFallbackLink();
  var escProduct = useMemo(function () {
    return eschref ? productFromUrl(eschref) : '';
  }, [eschref]);
  var backLangKey = 'settings-ui-nav.dashboard';

  if (escProduct) {
    backLangKey = escProduct.langKey;
  } else if (eschref) {
    backLangKey = 'settings-ui-nav.back';
  } else if (href === "/developer/" + portalId) {
    backLangKey = 'settings-ui-nav.home';
  }

  var handleClick = useCallback(function () {
    ReturnLinkHelper.clear();
    onClick(href);
  }, [onClick, href]);
  return /*#__PURE__*/_jsxs(UILink, {
    className: className + " back-link",
    onClick: handleClick,
    href: "" + window.location.origin + href,
    children: [/*#__PURE__*/_jsx(UIIcon, {
      name: "left"
    }), /*#__PURE__*/_jsx(FormattedMessage, {
      message: backLangKey
    })]
  });
};

BackLink.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  isDevPortal: PropTypes.bool
};
export default BackLink;