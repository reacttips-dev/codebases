import { ScreenBreakpointEnum, SignInOutNav } from "@bbyca/account-components";
import CartIndicator from "@bbyca/ecomm-checkout-components/dist/react/CartIndicator/CartIndicator";
import * as React from "react";
import { HeaderContext } from "..";
import routeManager from "../../../utils/routeManager";
import StoresLink from "../StoresLink";
import * as styles from "./style.css";
const handleOnViewCart = ({ language, client, internalLinkHandler, }) => {
    const pathname = routeManager.getPathByKey(language, "basket");
    if (client === "ecomm-webapp" && internalLinkHandler) {
        internalLinkHandler(pathname, "basket");
    }
    else {
        window.location.assign(pathname);
    }
};
const isOnHomepage = (language) => {
    const pathName = (typeof window !== "undefined") ? window.location.pathname : "";
    try {
        const pathKey = routeManager.getKeyByPath(language, pathName);
        return pathKey === "homepage";
    }
    catch (error) {
        return false;
    }
};
export const MainLinks = ({ accountDashboardUrl, locale, customerIdentityExperienceServiceUrl, onSignOutSuccess, componentOverride, cartQuantity, language, internalLinkHandler, client, isUserSignedIn, screenSize, toggleFlyoutOverlay, }) => {
    const formattedAccountDashboardUrl = `${accountDashboardUrl}/${(locale).toLowerCase()}`;
    const redirectUrl = isOnHomepage(language) ? formattedAccountDashboardUrl : "";
    return (React.createElement(React.Fragment, null,
        React.createElement(StoresLink, { showLabel: screenSize.greaterThan.extraSmall }),
        React.createElement("div", { className: styles.signInOutNavContainer, "data-automation": "account-sign-in-flyout-menu" },
            React.createElement(SignInOutNav, { accountDashboardUrl: accountDashboardUrl, locale: locale, cieServiceUrl: customerIdentityExperienceServiceUrl, onSignOutSuccess: onSignOutSuccess, screenBreakpoint: ScreenBreakpointEnum[screenSize.mediaType], isSignedIn: isUserSignedIn, toggleFlyoutOverlay: toggleFlyoutOverlay, redirectUrl: redirectUrl })),
        React.createElement("div", { className: styles.cartIcon }, componentOverride ? componentOverride.cartIndicator :
            React.createElement(CartIndicator, { apiStatusCode: "200", totalQuantity: cartQuantity, onClose: () => {
                    window.location.href = routeManager.getPathByKey(language, "homepage");
                }, onViewCart: () => handleOnViewCart({ language, client, internalLinkHandler }), showLabel: screenSize.greaterThan.extraSmall }))));
};
export default (props) => (React.createElement(HeaderContext.Consumer, null, (context) => (React.createElement(MainLinks, Object.assign({}, props, { locale: context.locale, language: context.language, client: context.client, internalLinkHandler: context.internalLinkHandler })))));
//# sourceMappingURL=index.js.map