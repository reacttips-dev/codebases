import * as React from "react";
import {Divider} from "@material-ui/core";

import ProductLineItem, {ProductLineItemProps} from "../ProductLineItem";
import * as styles from "./style.css";

export interface ConstituentContainerProps extends ProductLineItemProps {
    index: number;
    totalConstituents: number;
    className?: string;
}

export const ConstituentContainer: React.FC<ConstituentContainerProps> = ({
    totalConstituents,
    index,
    children,
    productImage,
    name,
    sku,
    className = "",
}) => (
    <div
        className={`${styles.bundleProductDetails} ${className}`}
        key={index}
        data-automation={`pdp-constituent-container-${index}`}>
        <ProductLineItem productImage={productImage} name={name} sku={sku} />
        {children}
        {totalConstituents - 1 !== index && <Divider />}
    </div>
);

export default ConstituentContainer;
