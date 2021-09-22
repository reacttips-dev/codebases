import * as React from "react";
import {LoadingSkeleton} from "@bbyca/bbyca-components";
import {RequiredProduct} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";

import * as styles from "../../styles.css";

const RequiredProductsLoader: React.FC<{
    requiredProducts: RequiredProduct[];
}> = ({requiredProducts}) => {
    if (requiredProducts && requiredProducts.length) {
        return (
            <div className={styles.productLineItemLoader}>
                {requiredProducts.map((requiredProduct) => (
                    <div key={`loader-${requiredProduct.sku}`} className={styles["loader-required-product-line-item"]}>
                        <LoadingSkeleton.ProductTile width={350} />
                        <LoadingSkeleton.Line maxWidth={200} />
                        <LoadingSkeleton.Line maxWidth={200} />
                    </div>
                ))}
            </div>
        );
    }
    return (
        <>
            <LoadingSkeleton.ProductTile maxWidth={350} />
            <LoadingSkeleton.Line maxWidth={200} />
            <LoadingSkeleton.Line maxWidth={200} />
        </>
    );
};

RequiredProductsLoader.displayName = "RequiredProductsLoader";

export default RequiredProductsLoader;
