import { ChevronLeft } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { RightArrow } from "../../../GlobalHeader/Navigation/Menu";
import * as styles from "../../style.css";
import messages from "../../translations/messages";
import MenuHeader from "../MenuHeader";
import MenuSectionItem, { MenuItem } from "../MenuItem";
export const MenuSection = ({ className, isMainCategory, menuData, isActive, onBackClick, hierarchy, menuTitle, sectionHref }) => {
    const [isChildActive, setChildActiveState] = React.useState(false);
    const handleChildSelected = () => {
        setChildActiveState(true);
    };
    const handleChildClosed = () => {
        setChildActiveState(false);
    };
    const classNames = [
        "menu-section",
        isActive && styles.active,
        isChildActive && styles.childActive,
        isMainCategory && styles.root
    ].filter((className) => className).join(" ");
    const automationTag = "menu-subcategory-l" + hierarchy.length;
    return React.createElement("ul", { className: classNames, "data-automation": automationTag },
        React.createElement(MenuItem, { className: `${styles.backLink} menu-back`, dataAutomation: "menu-back" },
            React.createElement("a", { onClick: onBackClick, href: "javascript: void(0);" },
                React.createElement(ChevronLeft, { color: "blue", viewBox: "1 -3 32 32", className: styles.backIcon }),
                React.createElement(FormattedMessage, Object.assign({}, messages.back)))),
        React.createElement(MenuItem, { className: "menu-header", dataAutomation: "menu-header" },
            React.createElement(MenuHeader, { menuData: menuData, title: menuTitle ? menuTitle : null, hierarchy: hierarchy, href: sectionHref })),
        menuData && Array.isArray(menuData.categories) && menuData.categories.map((childCategory, ind) => React.createElement(MenuSectionItem, { category: childCategory, notifySelection: handleChildSelected, notifyClosed: handleChildClosed, index: ind, key: `menu-section-item-${ind}`, hierarchy: hierarchy })),
        !!menuData && !!menuData.exploreMoreEvent && (React.createElement(MenuItem, { className: styles.exploreMore, dataAutomation: "menu-explore-more" },
            React.createElement(MenuHeader, { menuData: menuData, title: React.createElement(React.Fragment, null,
                    React.createElement(FormattedMessage, Object.assign({}, messages.exploreMore)),
                    React.createElement(RightArrow, null)), hierarchy: hierarchy, href: sectionHref }))));
};
export default MenuSection;
//# sourceMappingURL=index.js.map