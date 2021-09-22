import * as React from "react";
import { injectIntl } from "react-intl";
import { getLangRelativeUrl } from "../../../utils/routeManager";
import Link from "../Link";
import * as styles from "./style.css";
import messages from "./translations/messages";
export const SecondaryLinks = ({ client, intl, altLangUrl, helpTopicsId, ordersWebAppUrl }) => {
    const clientIsNotEcommWebapp = client !== "ecomm-webapp";
    const isFrench = intl.locale === "fr-CA";
    const bestbuyForBusinessSeoText = isFrench ? "best-buy-affaires" : "best-buy-business";
    const altLangRelativeUrl = altLangUrl ? getLangRelativeUrl(altLangUrl) : "";
    const localeUrl = (intl.locale && intl.locale.toLocaleLowerCase() === "fr-ca") ? "fr-ca" : "en-ca";
    return (React.createElement(React.Fragment, null,
        React.createElement(Link, { href: `${ordersWebAppUrl}/${localeUrl}`, className: styles.topLinkAnchor, targetSelf: true, external: true, extraAttributes: { "data-automation": "x-order-status" } }, intl.formatMessage(Object.assign({}, messages.orderStatus))),
        React.createElement(Link, { href: `https://${isFrench ? "blogue" : "blog"}.bestbuy.ca`, className: styles.topLinkAnchor, external: true, targetSelf: clientIsNotEcommWebapp, extraAttributes: { "data-automation": "x-blog" } }, intl.formatMessage(Object.assign({}, messages.blog))),
        React.createElement(Link, { to: "corporate", params: [bestbuyForBusinessSeoText, helpTopicsId.bestBuyForBusiness], className: styles.topLinkAnchor, external: clientIsNotEcommWebapp, targetSelf: clientIsNotEcommWebapp, extraAttributes: { "data-automation": "x-best-buy-business" } }, intl.formatMessage(Object.assign({}, messages.bestBuyForBusiness))),
        altLangUrl &&
            React.createElement("a", { href: altLangRelativeUrl, className: styles.topLinkAnchor, "data-automation": "x-language" }, intl.formatMessage(Object.assign({}, messages.language)))));
};
export default injectIntl(SecondaryLinks);
//# sourceMappingURL=index.js.map