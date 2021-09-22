import * as React from "react";

import VariantSwatch from "components/VariantSwatch";
import {ProductVariant} from "models/DetailedProduct";

import {VariantTextPillBox} from "./components/VariantTextPillBox";
import {VariantThumbnailBox} from "./components/VariantThumbnailBox";
import * as styles from "./style.css";

export interface VariantsProps {
    baseSwatchUrl?: string;
    pageSku: string;
    productVariants: ProductVariant[][];
    loadingVariants: boolean;
    variantThumbnailEnabled?: boolean;
    isMarketplace?: boolean;
    locale: Locale;
}

export const Variants: React.FC<VariantsProps> = ({
    baseSwatchUrl,
    pageSku,
    productVariants,
    loadingVariants,
    variantThumbnailEnabled,
    isMarketplace,
    locale,
}: VariantsProps) => {
    const renderDimensions = () =>
        productVariants &&
        productVariants.length > 0 &&
        productVariants.map((productVariant: ProductVariant[], index) => {
            const variantDisplayType =
                (productVariant && productVariant.length > 0 && productVariant[0].variantDisplayType) || "";
            const variantDisplayTypeKey = `${index}-${variantDisplayType}`;

            switch (variantDisplayType) {
                case "swatch":
                    if (variantThumbnailEnabled && productVariant[0].variantType) {
                        return (
                            <VariantThumbnailBox
                                key={variantDisplayTypeKey}
                                loadingVariants={loadingVariants}
                                productVariants={productVariant}
                                pageSku={pageSku}
                            />
                        );
                    } else {
                        return (
                            <VariantSwatch
                                key={variantDisplayTypeKey}
                                baseSwatchUrl={baseSwatchUrl}
                                pageSku={pageSku}
                                productVariants={productVariant}
                                loadingVariants={loadingVariants}
                                isMarketplace={isMarketplace}
                            />
                        );
                    }
                case "text":
                    return (
                        <VariantTextPillBox
                            key={variantDisplayTypeKey}
                            loadingVariants={loadingVariants}
                            productVariants={productVariant}
                            pageSku={pageSku}
                            showPrice={false}
                            locale={locale}
                        />
                    );
                case "textWithPrice":
                    return (
                        <VariantTextPillBox
                            key={variantDisplayTypeKey}
                            loadingVariants={loadingVariants}
                            productVariants={productVariant}
                            pageSku={pageSku}
                            showPrice={true}
                        />
                    );
                default:
                    return null;
            }
        });

    return <div className={styles.variantContainer}>{renderDimensions()}</div>;
};

export default Variants;
