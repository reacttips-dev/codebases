import * as React from "react";
import { Link } from "../../../Link";
const ItemLink = ({ children, className, onClick, href }) => {
    return (React.createElement(Link, { className: className, 
        // set fallback to undefined to mitigate refresh when external link is an empty string
        href: href || undefined, onClick: onClick, targetSelf: href ? false : true, rel: href ? "external" : "" },
        " ",
        children,
        " "));
};
export default ItemLink;
//# sourceMappingURL=ItemLink.js.map