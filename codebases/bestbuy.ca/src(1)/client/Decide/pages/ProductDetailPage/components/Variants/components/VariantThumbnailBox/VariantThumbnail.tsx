import * as React from "react";
import ProductImage from "components/ProductImage";
import Link from "components/Link";
import {ProductVariant} from "models/DetailedProduct";
import {classname, classIf} from "utils/classname";

import * as styles from "./style.css";

export interface VariantThumbnailProps {
    onVariantSelected: (variant: ProductVariant) => void;
    onMouseEnter: (variant: ProductVariant) => void;
    onMouseLeave: () => void;
    pageSku: string;
    variant: ProductVariant;
}

export const VariantThumbnail: React.FC<VariantThumbnailProps> = ({
    onVariantSelected,
    onMouseEnter,
    onMouseLeave,
    pageSku,
    variant,
}: VariantThumbnailProps) => {
    const text = variant.unit && variant.value ? `${variant.value} ${variant.unit}` : variant.value || "";

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

    const thumbnailTitle = variant.label && variant.value ? `${variant.label} ${variant.value}` : variant.name;
    const thumbnailBox = (
        <div
            key={variant.sku}
            className={classname([styles.thumbnailInnerWrapper, classIf(styles.selected, variant.sku === pageSku)])}
            onMouseEnter={onMouseEnterHandler}
            onMouseLeave={onMouseLeaveHandler}>
            <ProductImage
                className={styles.variantOptionImageThumbnail}
                data-automation="variant-thumbnail"
                src={variant.variantImageUrl ? variant.variantImageUrl : ""}
                alt={thumbnailTitle}
                title={thumbnailTitle}
                disableLazyLoad={true}
            />
            <p className={styles.variantOptionTextThumbnail}>{text}</p>
        </div>
    );

    return (
        <div className={styles.variantOptionBox}>
            {pageSku && pageSku !== variant.sku ? (
                <Link
                    to="product"
                    params={[variant.seoName, variant.sku]}
                    onClick={onClickHandler}
                    className={styles.variantOptionLink}
                    extraAttrs={{"data-automation": "variant-thumbnail-link"}}>
                    {thumbnailBox}
                </Link>
            ) : (
                thumbnailBox
            )}
        </div>
    );
};

export default VariantThumbnail;
