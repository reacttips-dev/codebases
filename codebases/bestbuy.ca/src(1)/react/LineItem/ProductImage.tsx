import { ProductPlaceholder } from "@bbyca/bbyca-components";
import * as React from "react";
const ProductImage = ({ className, src }) => {
    if (src && !src.includes("images/common/pictures/noimage")) {
        return React.createElement("img", { className: className, src: src });
    }
    return (React.createElement(ProductPlaceholder, { className: className }));
};
export default ProductImage;
//# sourceMappingURL=ProductImage.js.map