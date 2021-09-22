import * as React from "react";
import { ItemLink } from "../ItemLink";
import * as styles from "../style.css";
import { Title } from "./Title";
const Header = ({ activeItem, backToText, isMobile, tree, onClickLink, l1DesktopClassName, l1MobileClassName, icon, }) => {
    const backToState = isMobile && activeItem !== tree.title;
    const geL1ClassNames = () => {
        const classNames = [styles.l1];
        const mobileClassName = !!l1MobileClassName ? l1MobileClassName : styles.l1Mobile;
        const desktopClassName = !!l1DesktopClassName ? l1DesktopClassName : styles.l1Desktop;
        isMobile ? classNames.push(mobileClassName) : classNames.push(desktopClassName);
        if (backToState && !!isMobile) {
            classNames.push(styles.l1MobileExtraPadding);
        }
        return classNames.join(" ");
    };
    const l1Title = (React.createElement(Title, { backToState: backToState, backToText: backToText, isMobile: isMobile, title: tree.title, backIconSubstitute: icon }));
    // do not render an icon subsititute in backToState - backToState = true is handled by <Title .../>
    return (React.createElement("div", { onClick: tree.onClick, "data-automation": tree.dataAutomation },
        React.createElement(ItemLink, { className: geL1ClassNames(), href: tree.externalLink, onClick: onClickLink },
            !!icon && !backToState && icon,
            l1Title)));
};
export default Header;
//# sourceMappingURL=Header.js.map