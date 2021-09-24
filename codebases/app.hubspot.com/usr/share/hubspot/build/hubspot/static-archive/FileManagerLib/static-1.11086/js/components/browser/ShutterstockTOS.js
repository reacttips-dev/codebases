'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UILink from 'UIComponents/link/UILink';
import UISection from 'UIComponents/section/UISection';
import Small from 'UIComponents/elements/Small';
import ShutterstockMaintenanceAlert from 'FileManagerCore/components/ShutterstockMaintenanceAlert';

function i18nKey(suffix) {
  return "FileManagerLib.panels.tabs.shutterstock." + suffix;
}

export default function ShutterstockTosLinks(props) {
  var use = props.use;
  return /*#__PURE__*/_jsx(UISection, {
    children: /*#__PURE__*/_jsxs(Small, {
      children: [/*#__PURE__*/_jsx(ShutterstockMaintenanceAlert, {
        useShortVersion: true,
        className: "m-bottom-2"
      }), /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: i18nKey('headerTerms'),
        options: {
          websiteTermsLink: /*#__PURE__*/_jsx(UILink, {
            use: use,
            href: "https://www.shutterstock.com/terms",
            external: true,
            children: I18n.text(i18nKey('websiteTermsAndPolicy'))
          }),
          licensingTermsLink: /*#__PURE__*/_jsx(UILink, {
            use: use,
            href: "https://www.shutterstock.com/license",
            external: true,
            children: I18n.text(i18nKey('licensingTerms'))
          })
        }
      })]
    })
  });
}
ShutterstockTosLinks.propTypes = {
  use: UILink.propTypes.use
};
ShutterstockTosLinks.defaultProps = {
  use: 'light'
};