import { AccountMenu } from "@bbyca/account-components";
import { AtoZ, ChevronRight, FeaturedDeals, GeekSquad, Monitor } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { convertLocaleToLang } from "../../../../models";
import { getHelpTopicsId } from "../../../../utils/helpTopics";
import routeManager, { getLangRelativeUrl, } from "../../../../utils/routeManager";
import Link from "../../Link";
import { eventToSessionStorage } from "../../setAnalyticVariable";
import { MenuItem } from "../../../MenuPanel/components/MenuItem";
import * as styles from "./style.css";
import messages from "./translations/messages";
export const RightArrow = () => React.createElement(ChevronRight, { className: styles.rightIcon });
const isOnHomepage = (language) => {
    const pathName = typeof window !== "undefined" ? window.location.pathname : "";
    try {
        const pathKey = routeManager.getKeyByPath(language, pathName);
        return pathKey === "homepage";
    }
    catch (error) {
        return false;
    }
};
export const Menu = (props) => {
    const clientIsNotEcommWebapp = props.client !== "ecomm-webapp";
    const altLangRelativeUrl = props.altLangUrl
        ? getLangRelativeUrl(props.altLangUrl)
        : "";
    const formattedAccountDashboardUrl = `${props.accountDashboardUrl}/${props.locale.toLowerCase()}`;
    const language = convertLocaleToLang(props.locale);
    const redirectUrl = isOnHomepage(language)
        ? formattedAccountDashboardUrl
        : "";
    const ordersWebAppUrl = props.ordersWebAppUrl;
    const localePath = props.intl.locale
        ? props.intl.locale.toLowerCase()
        : "en-ca";
    return (React.createElement("div", { className: styles.menu, "data-automation": "x-header-navigation-menu" },
        React.createElement(AccountMenu, { cieServiceUrl: props.cieServiceUrl, locale: props.locale, firstName: props.customerFirstName, onClickWhenSignedIn: props.onAccountClick, isSignedIn: props.isUserSignedIn, redirectUrl: redirectUrl }),
        React.createElement("ul", null,
            React.createElement(MenuItem, { isActive: true },
                React.createElement(Link, { external: clientIsNotEcommWebapp, onClick: (e) => {
                        e.preventDefault();
                        props.onCategoryClick();
                    }, params: ["departments", "departments"], targetSelf: clientIsNotEcommWebapp, to: "category" },
                    React.createElement(Monitor, { className: styles.leftIcon }),
                    React.createElement("span", { "data-automation": "x-shop" }, props.intl.formatMessage({ id: messages.shop.id })),
                    React.createElement(RightArrow, null))),
            React.createElement(MenuItem, null,
                React.createElement("a", { onClick: (e) => {
                        e.preventDefault();
                        props.onBrandClick();
                    } },
                    React.createElement(AtoZ, { className: styles.leftIcon }),
                    React.createElement("span", { "data-automation": "x-brands" }, props.intl.formatMessage({
                        id: messages.brands.id,
                    })),
                    React.createElement(RightArrow, null))),
            React.createElement(MenuItem, null,
                React.createElement("a", { onClick: (e) => {
                        e.preventDefault();
                        props.onDealClick();
                    } },
                    React.createElement(FeaturedDeals, { className: styles.leftIcon }),
                    React.createElement("span", { "data-automation": "x-deals" }, props.intl.formatMessage({
                        id: messages.deals.id,
                    })),
                    React.createElement(RightArrow, null))),
            React.createElement(MenuItem, null,
                React.createElement("a", { onClick: (e) => {
                        e.preventDefault();
                        props.onServicesClick();
                    } },
                    React.createElement(GeekSquad, { className: styles.leftIcon }),
                    React.createElement("span", { "data-automation": "x-services" }, props.intl.formatMessage({
                        id: messages.services.id,
                    })),
                    React.createElement(RightArrow, null))),
            React.createElement("div", { className: styles.xsmallOnly },
                React.createElement(MenuItem, null,
                    React.createElement(Link, { href: `${ordersWebAppUrl}/${localePath}`, external: true, targetSelf: true, onClick: (e) => {
                            eventToSessionStorage("Order Status");
                        }, className: styles.noIcon },
                        React.createElement("span", { "data-automation": "x-order-status" }, props.intl.formatMessage({
                            id: messages.orderStatus.id,
                        })))),
                React.createElement(MenuItem, null,
                    React.createElement(Link, { external: true, href: props.intl.formatMessage(Object.assign({}, messages.blogHref)), key: "blog", className: styles.noIcon },
                        React.createElement("span", { "data-automation": "x-blog" }, props.intl.formatMessage({
                            id: messages.blogText.id,
                        })))),
                React.createElement(MenuItem, null,
                    React.createElement(Link, { to: "bbyForBusiness", params: [
                            getHelpTopicsId(props.env).bestBuyForBusiness,
                        ], external: clientIsNotEcommWebapp, onClick: (e) => {
                            props.onServicesClick();
                        }, targetSelf: clientIsNotEcommWebapp, className: styles.noIcon },
                        React.createElement("span", { "data-automation": "x-bby-business" }, props.intl.formatMessage({
                            id: messages.bbyForBusiness.id,
                        }))))),
            props.altLangUrl && (React.createElement(MenuItem, null,
                React.createElement("a", { className: styles.noIcon, href: altLangRelativeUrl },
                    React.createElement("span", { "data-automation": "x-language" }, props.intl.formatMessage({
                        id: messages.language.id,
                    }))))))));
};
export default injectIntl(Menu);
//# sourceMappingURL=index.js.map