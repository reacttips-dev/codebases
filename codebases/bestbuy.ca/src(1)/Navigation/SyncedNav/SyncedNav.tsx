import * as React from "react";
import { ItemLink } from "./ItemLink";
import * as styles from "./style.css";
import { ChevronLeft } from "../../SvgIcons";
import { applyToTree, testDescendants } from "./utils/dataFormatting";
import { DisplayDefault as ExpandableContainer } from "../../Expandable";
var LocalExpandedState;
(function (LocalExpandedState) {
    LocalExpandedState["expanded"] = "expanded";
    LocalExpandedState["collapsed"] = "collapsed";
})(LocalExpandedState || (LocalExpandedState = {}));
var childLinksKey;
(function (childLinksKey) {
    childLinksKey["key"] = "links";
})(childLinksKey || (childLinksKey = {}));
export const NavItem = ({ link, index }) => {
    const hasChildren = !!(link.links && link.links.length !== 0);
    const { isSelected, inSelectedChain } = link;
    const [localExpand, setLocalExpand] = React.useState();
    const isExpanded = localExpand
        ? localExpand === LocalExpandedState.expanded
            ? true
            : false
        : isSelected || inSelectedChain;
    const linkClassNames = [inSelectedChain && styles.inSelectedChain, isSelected && styles.selected]
        .filter((item) => item)
        .join(" ");
    const onExpandToggle = () => {
        setLocalExpand(isExpanded ? LocalExpandedState.collapsed : LocalExpandedState.expanded);
    };
    return (React.createElement("li", { className: linkClassNames, key: `${index}-${link.title}`, "data-automation": link.dataAutomation },
        React.createElement(ItemLink, { className: styles.linkItem, icon: link.icon, onClick: link.onClick, isSelected: isSelected, isExpanded: isExpanded, onExpandToggle: onExpandToggle, hasChildren: hasChildren, isExternal: !!link.externalLink, href: link.externalLink || link.path || link.resourcePath }, link.title),
        hasChildren && (React.createElement(ExpandableContainer, { open: isExpanded },
            React.createElement("ul", null, renderLinks(link))))));
};
const renderLinks = (parentLink) => {
    return parentLink.links.map((link, index) => {
        return React.createElement(NavItem, { key: link.title + index, link: link, index: index });
    });
};
const SyncedNav = (props) => {
    const { tree, backToText } = props;
    const navData = applyToTree({
        childrenKey: childLinksKey.key,
        value: (item) => ({
            inSelectedChain: testDescendants(item, (child) => !!child.isSelected, childLinksKey.key),
        }),
    })(tree);
    return (React.createElement("div", { className: styles.navigation },
        React.createElement("ul", null,
            React.createElement("li", null,
                React.createElement(ItemLink, { onClick: navData.onClick, className: styles.backLink, href: navData.path || navData.externalLink },
                    React.createElement("div", { className: styles.chevron },
                        React.createElement(ChevronLeft, null)),
                    backToText,
                    " ",
                    navData.title)),
            renderLinks(navData))));
};
export default SyncedNav;
//# sourceMappingURL=SyncedNav.js.map