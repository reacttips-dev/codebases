import * as React from "react";
import { CaretDown, CaretRight } from "../../..";
import * as styles from "../style.css";
const LinkTitle = ({ hasChildren, onClick, icon, isOpen, isMobile, isParentL1, isSelected, title, }) => {
    const getCaretIconClassNames = () => {
        const classNames = isSelected ? [styles.caretIcon, styles.caretIconSelected] : [styles.caretIcon];
        return classNames.join(" ");
    };
    const getL2PlusTextClassNames = () => {
        const classNames = !!isMobile || hasChildren || !!icon
            ? !!icon
                ? [styles.l2TextRightOfIconPadding]
                : [styles.l2TextPadding]
            : [styles.l2TextExtraPadding];
        return classNames.join(" ");
    };
    const getL2PlusIconClassNames = () => {
        const classNames = !!isMobile || hasChildren ? [styles.l2IconPadding] : [styles.l2IconExtraPadding];
        return classNames.join(" ");
    };
    const caretComponent = (React.createElement("span", { onClick: onClick }, isOpen ? (React.createElement(CaretDown, { viewBox: "0 -2 32 32", className: getCaretIconClassNames() })) : (React.createElement(CaretRight, { viewBox: "0 -2 32 32", className: getCaretIconClassNames() }))));
    return (React.createElement(React.Fragment, null,
        hasChildren && !isMobile && caretComponent,
        !!icon && (React.createElement("span", { className: `${styles.l2Icon}
                    ${isParentL1 && getL2PlusIconClassNames()}` }, icon)),
        React.createElement("span", { className: `${styles.l2PlusText}
                ${isParentL1 && getL2PlusTextClassNames()}` }, title)));
};
export default LinkTitle;
//# sourceMappingURL=LinkTitle.js.map