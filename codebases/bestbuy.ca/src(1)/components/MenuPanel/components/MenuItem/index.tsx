import * as React from "react";
import { getLinkHref, MenuContext } from "../../";
import { convertLocaleToLang, EventTypes } from "../../../../models";
import { HeaderContext } from "../../../GlobalHeader";
import Link from "../../../GlobalHeader/Link";
import { RightArrow } from "../../../GlobalHeader/Navigation/Menu";
import * as styles from "../../style.css";
import MenuSection from "../MenuSection";
export const MenuItem = ({ className = "", dataAutomation = "", isActive, children }) => (React.createElement("li", { className: `${styles.menuItem} ${isActive ? styles.active : ""} ${className}`, "data-automation": dataAutomation }, children));
export const LinkItem = ({ dataAutomation = "", event, onClick, href, children }) => {
    const { seoText = "", eventId = "" } = event;
    return href ? (React.createElement(Link, { className: styles.menuLink, extraAttributes: { "data-automation": dataAutomation }, onClick: onClick, href: href, params: [seoText, eventId], external: event.eventType === EventTypes.externalUrl }, children)) : (React.createElement("a", { className: styles.menuLink, href: "javascript: void(0);", onClick: onClick, "data-automation": dataAutomation }, children));
};
export const MenuSectionItem = (props) => {
    const { category, index, notifySelection, notifyClosed, isVisible, onNavigate, trackMenuSelection, locale, hierarchy } = props;
    const { event } = category;
    if (!event) {
        return null;
    }
    const [isActive, setActive] = React.useState(false);
    const { ctaText } = event;
    const hasChildCategories = Array.isArray(category.categories) && category.categories.length > 0;
    const automationTag = (hasChildCategories ? "menu-item-" : "menu-link-") + (ctaText ? ctaText.toLowerCase().split(" ").join("-") : "");
    const href = category.event.url || getLinkHref(category.event, convertLocaleToLang(locale));
    let menuSectionItemHierarchy = [];
    const setCurrentSelected = () => {
        setActive(true);
        if (notifySelection) {
            notifySelection();
        }
    };
    const handleOnClose = () => {
        setActive(false);
        if (notifyClosed) {
            notifyClosed();
        }
    };
    React.useEffect(() => {
        if (!isVisible) {
            handleOnClose();
        }
    }, [isVisible]);
    if (Array.isArray(hierarchy)) {
        menuSectionItemHierarchy = hierarchy.concat(ctaText);
    }
    const handleOnClick = (e) => {
        if (hasChildCategories) {
            e.preventDefault();
            setCurrentSelected();
        }
        else {
            onNavigate();
            trackMenuSelection(menuSectionItemHierarchy);
        }
    };
    return React.createElement(MenuItem, { className: "menu-link", isActive: isActive, key: `list-item-${index}`, dataAutomation: automationTag },
        React.createElement(LinkItem, { "data-automation": "x-menu-item", onClick: handleOnClick, href: href, event: event },
            React.createElement("span", { className: styles.menuItemText }, ctaText),
            hasChildCategories && React.createElement(RightArrow, null)),
        hasChildCategories &&
            React.createElement(MenuSection, { menuTitle: ctaText, sectionHref: href, isActive: isActive && isVisible, menuData: category, onBackClick: handleOnClose, hierarchy: menuSectionItemHierarchy, locale: locale }));
};
const MenuSectionItemWrapper = (props) => {
    const context = React.useContext(MenuContext);
    const headerContextProps = React.useContext(HeaderContext);
    return React.createElement(MenuSectionItem, Object.assign({}, props, context, headerContextProps));
};
export default MenuSectionItemWrapper;
//# sourceMappingURL=index.js.map