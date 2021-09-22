import * as React from "react";

import Image from "components/Image";
import {ImageProps as ProductImageProps} from "components/Image";
import TruncateText from "components/TruncateText";
import {DetailedProduct as Product} from "models";

import * as styles from "./style.css";

export interface SimpleProductDetailsBriefProps {
    product: Product;
    shouldHidePrice?: boolean;
    truncateMaxLine?: number;
    hasPadding?: boolean;
}

export const SimpleProductDetailsBrief: React.SFC<SimpleProductDetailsBriefProps> = (props) => {
    const MAX_LINES = props.truncateMaxLine || 3;
    const {product} = props;

    const productImageProps: ProductImageProps = {
        alt: product.name,
        width: "100%",
        src: product.productImage,
        className: styles.customImageContainer,
    };

    return (
        <div
            className={`${styles.simpleProductDetailsBrief} ${props.hasPadding && styles.hasPadding}`}
            data-automation="simple-product-details-brief">
            <Image {...productImageProps} />
            <div className={styles.detailsContainer}>
                <div className={styles.productName} data-automation="brief-product-name">
                    <TruncateText maxLines={MAX_LINES}>{product.name}</TruncateText>
                </div>
                {props.children}
            </div>
        </div>
    );
};

export default SimpleProductDetailsBrief;
