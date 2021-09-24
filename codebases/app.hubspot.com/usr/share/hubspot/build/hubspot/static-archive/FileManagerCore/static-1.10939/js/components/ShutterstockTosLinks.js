'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import UIList from 'UIComponents/list/UIList';

function i18nKey(suffix) {
  return "FileManagerCore.shutterstock." + suffix;
}

function getClassName(compact) {
  return compact ? 'm-right-1' : 'm-right-4';
}

export default function ShutterstockTosLinks(props) {
  var use = props.use,
      compact = props.compact;
  var className = getClassName(compact);
  return /*#__PURE__*/_jsxs(UIList, {
    className: "shutterstock-tos-links",
    inline: true,
    children: [/*#__PURE__*/_jsx(UILink, {
      className: className,
      use: use,
      external: true,
      href: "https://www.shutterstock.com/terms",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: i18nKey('websiteTerms')
      })
    }), /*#__PURE__*/_jsx(UILink, {
      className: className,
      use: use,
      external: true,
      href: "https://www.shutterstock.com/privacy",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: i18nKey('privacyPolicy')
      })
    }), /*#__PURE__*/_jsx(UILink, {
      use: use,
      external: true,
      href: "https://www.shutterstock.com/license",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: i18nKey('licensingTerms')
      })
    })]
  });
}
ShutterstockTosLinks.propTypes = {
  use: UILink.propTypes.use,
  compact: PropTypes.bool
};
ShutterstockTosLinks.defaultProps = {
  use: 'dark',
  compact: false
};