import * as React from "react";
import Link from "../../../Link";
import * as styles from "./style.css";
const BrandGroup = ({ brands, client, groupTitle, handleBrandClick, className }) => {
    if (brands.length === 0) {
        return null;
    }
    return (React.createElement("div", { className: `${styles.brandGroupContainer} ${className}` },
        React.createElement("span", null, groupTitle),
        React.createElement("ul", { className: styles.brandsList, "data-automation": `${groupTitle && groupTitle.replace(/ /g, "-").toLowerCase()}-brands-list` }, brands.map((brand, index) => {
            const params = (brand.seoText || brand.ctaText || "").toLowerCase();
            return (React.createElement("li", { key: index },
                React.createElement(Link, { onClick: () => {
                        handleBrandClick(brand, groupTitle);
                    }, to: "brand", params: [params], external: client !== "ecomm-webapp", targetSelf: client !== "ecomm-webapp" }, brand.ctaText)));
        }))));
};
export default BrandGroup;
//# sourceMappingURL=index.js.map