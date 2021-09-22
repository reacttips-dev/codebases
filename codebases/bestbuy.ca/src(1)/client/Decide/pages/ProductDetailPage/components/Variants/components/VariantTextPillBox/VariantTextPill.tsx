import * as React from "react";

import Link from "components/Link";
import {ProductVariant} from "models/DetailedProduct";

import {OptionBoxText} from "Decide/components/OptionBox";
import {Price} from "components/Price";
import {classIf} from "utils/classname";
import * as styles from "./style.css";

export interface VariantTextPillProps {
    onVariantSelected: (varaint: ProductVariant) => void;
    onMouseEnter: (variant: ProductVariant) => void;
    onMouseLeave: () => void;
    pageSku: string;
    variant: ProductVariant;
    showPrice: boolean;
}

export const VariantTextPill: React.FC<VariantTextPillProps> = ({
    onVariantSelected,
    onMouseEnter,
    onMouseLeave,
    pageSku,
    variant,
    showPrice
}: VariantTextPillProps) => {
    const text = variant.unit && variant.value ? `${variant.value} ${variant.unit}` : variant.value || "";
    const showVariantTextPillWithPrice = variant.salePrice && showPrice;

    const onMouseEnterHandler = () => {
        if (onMouseEnter && typeof onMouseEnter === "function") {
            onMouseEnter(variant);
        }
    };

    const onMouseLeaveHandler = () => {
        if (onMouseLeave && typeof onMouseLeave === "function") {
            onMouseLeave();
        }
    };

    const onClickHandler = React.useCallback(() => {
        if (pageSku === variant.sku) {
            return;
        }

        if (onVariantSelected && typeof onVariantSelected === "function") {
            onVariantSelected(variant);
        }
    }, [pageSku, variant, onVariantSelected]);

    const optionBox = (
        <OptionBoxText
            key={variant.sku}
            text={text}
            isSelected={variant.sku === pageSku}
            price={showVariantTextPillWithPrice && <Price value={variant.salePrice} />}
            className={classIf(styles.variantOptionTextWithPrice, !!showVariantTextPillWithPrice, styles.variantOptionText)}
            dataAutomation={showVariantTextPillWithPrice ? `variant-text-with-price-${variant.variantType}-${variant.sku}` : `variant-text-${variant.variantType}-${variant.sku}`}
        />
    );

    return pageSku && pageSku !== variant.sku ? (
        <div
            key={variant.sku}
            className={styles.variantOptionBox}
            onMouseEnter={onMouseEnterHandler}
            onMouseLeave={onMouseLeaveHandler}>
            <Link to="product" params={[variant.seoName, variant.sku]} key={variant.sku} onClick={onClickHandler}>
                {optionBox}
            </Link>
        </div>
    ) : (
        optionBox
    );
};

export default VariantTextPill;
