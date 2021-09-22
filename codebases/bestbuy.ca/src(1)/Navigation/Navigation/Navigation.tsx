import * as React from "react";
import { Header } from "./Header";
import { ItemLink } from "./ItemLink";
import { LinkTitle } from "./LinkTitle";
import * as styles from "./style.css";
class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.renderLink = (link, index, parentLink, isParentL1, borders) => {
            const hasChildren = !!(link.links && link.links.length !== 0);
            const linkTitle = (React.createElement(LinkTitle, { icon: link.icon, isMobile: this.props.isMobile, isOpen: link.isOpen, isParentL1: isParentL1, isSelected: this.isSelected(link), hasChildren: hasChildren, title: link.title, onClick: (e) => this.updateIsOpenState(e, link) }));
            // set the initial selection here to be used when the component fully mounted. Deeplink feature
            if (link.isSelected) {
                this.selection = link;
                link.isSelected = false;
            }
            const borderClassName = borders ? getBorderClassNames(!!this.props.isMobile, isParentL1) : "";
            return (React.createElement("div", { key: `${index}-${link.title}`, onClick: link.onClick, className: borderClassName, "data-automation": link.dataAutomation },
                React.createElement(ItemLink, { className: this.getL2PlusClassNames(link, index, isParentL1), href: link.externalLink, onClick: () => this.activateLink(link, parentLink) }, linkTitle),
                hasChildren && (link.isOpen || this.props.isMobile) && this.renderLinks(link, false, borders)));
        };
        this.isSelected = (link) => link.id + "-" + link.title === this.selection.id + "-" + this.selection.title;
        this.renderLinks = (parentLink, isParentL1, borders) => parentLink.links.map((link, index) => this.renderLink(link, index, parentLink, isParentL1, borders));
        this.activateLink = (link, parentLink) => {
            this.props.tree.links.forEach((l2Link) => {
                l2Link.isOpen = false;
                l2Link.links.forEach((l3Link) => (l3Link.isOpen = false));
            });
            if (parentLink) {
                parentLink.isOpen = true;
            }
            link.isOpen = true;
            this.selection = link;
            this.setState({ updateTree: true });
        };
        this.updateIsOpenState = (e, link) => {
            link.isOpen = !link.isOpen;
            this.setState({ updateTree: true });
            e.stopPropagation();
        };
        this.getL2PlusClassNames = (link, index, isParentL1) => {
            const classNames = this.isSelected(link) ? [styles.l2Plus, styles.l2Selected] : [styles.l2Plus];
            if (this.props.isMobile) {
                isParentL1
                    ? classNames.push(styles.l2PlusMobile)
                    : classNames.push(styles.l3, styles.l3TextPaddingMobile, styles.l2PlusMobile);
            }
            else {
                isParentL1
                    ? classNames.push(styles.l2)
                    : classNames.push(styles.l3, styles.l3IconPadding, styles.l3TextPadding);
            }
            return classNames.join(" ");
        };
        this.selection = this.props.tree;
    }
    render() {
        const { tree, isMobile, backToText, removeBorders, headerIcon, headerDesktopClassName, headerMobileClassName, } = this.props;
        return (React.createElement("div", { id: "nav-side", className: getTreeClassNames(!!isMobile, !!removeBorders, this.props.containerClassName) },
            React.createElement(Header, { activeItem: this.selection.title, tree: tree, backToText: backToText, isMobile: isMobile, onClickLink: () => this.activateLink(this.props.tree), l1DesktopClassName: headerDesktopClassName, l1MobileClassName: headerMobileClassName, icon: headerIcon }),
            this.renderLinks(tree, true, !removeBorders)));
    }
    componentDidMount() {
        if (this.selection) {
            this.activateLink(this.selection);
        }
    }
}
const getBorderClassNames = (isMobile, isParentL1) => {
    const classNames = [];
    if (isMobile) {
        classNames.push(styles.l2PlusBorderTopMobile);
    }
    else if (isParentL1) {
        classNames.push(styles.l2PlusBorderTop);
    }
    return classNames.join(" ");
};
const getTreeClassNames = (isMobile, removeBorders, containerClassName) => {
    const classNames = removeBorders ? [] : [styles.tree];
    classNames.push(isMobile ? styles.treeMobile : styles.treeDesktop);
    if (containerClassName) {
        classNames.push(containerClassName);
    }
    return classNames.join(" ");
};
export default Navigation;
//# sourceMappingURL=Navigation.js.map