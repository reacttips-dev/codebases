import * as React from "react";

import {Region} from "models";
import {ProductPricing, ProductPricingProps} from "components/ProductCost/ProductPricing";
import {classname} from "utils/classname";

import * as styles from "./styles.css";

interface LocalProductProps {
    purchasePrice: number;
    regularPrice: number;
    onSale: boolean;
    ehf?: number;
    saleEnd?: string;
}

export interface ProductCardPriceProps extends LocalProductProps {
    displayEhfRegions: Region[];
    regionCode: Region;
    className?: string;
}

export const ProductCardPrice: React.FC<ProductCardPriceProps> = ({
    purchasePrice,
    regularPrice,
    onSale,
    ehf,
    saleEnd,
    displayEhfRegions,
    regionCode,
    className = "",
}) => {
    return (
        <div className={classname(className)} data-automation="product-card-price">
            <ProductPricing
                className={styles.productPricing}
                displayEhfRegions={displayEhfRegions}
                appLocationRegionCode={regionCode}
                {...buildProductPricingProps({purchasePrice, regularPrice, onSale, ehf, saleEnd})}
            />
        </div>
    );
};

const buildProductPricingProps = ({
    purchasePrice,
    regularPrice,
    onSale,
    ehf,
    saleEnd,
}: LocalProductProps): ProductPricingProps => {
    const withoutEhf = purchasePrice;
    const ehfAmount = ehf || 0;

    const productPricingProps: ProductPricingProps = {
        displaySaleEndDate: onSale,
        displaySavingPosition: "top",
        ehf: ehfAmount,
        priceSize: "medium",
        priceWithEhf: Number(withoutEhf) + Number(ehfAmount),
        priceWithoutEhf: withoutEhf,
        saleEndDate: saleEnd,
        saving: Number(regularPrice) - Number(purchasePrice),
        superscriptCent: false,
    };

    return productPricingProps;
};
