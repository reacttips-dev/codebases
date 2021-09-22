import * as React from "react";
import { Back } from "../../../../SvgIcons";
import * as styles from "../../style.css";
const Title = ({ backToState, backToText, backIconSubstitute, isMobile, title }) => {
    const styleTitleMobileNav = backToState ? styles.titleBackMobileNavigation : styles.titleMobileNavigation;
    // replace if one is provided
    const backIcon = !!backIconSubstitute ? (React.createElement(React.Fragment, null, backIconSubstitute)) : (React.createElement("span", { className: styles.backIconWrapper },
        React.createElement(Back, { className: styles.backIcon, color: "white" })));
    const backToDisplayText = !!backToText ? backToText : "";
    return (React.createElement(React.Fragment, null,
        backToState && backIcon,
        React.createElement("span", { className: isMobile && !backIconSubstitute ? `${styleTitleMobileNav}` : "" }, backToState ? `${backToDisplayText} ${title}` : title)));
};
export default Title;
//# sourceMappingURL=Title.js.map