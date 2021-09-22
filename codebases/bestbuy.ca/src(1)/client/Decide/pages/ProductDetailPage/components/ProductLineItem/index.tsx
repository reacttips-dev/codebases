import * as React from "react";
import { Col } from "@bbyca/bbyca-components";
import { ProductLineItem as BaseLineItem } from "@bbyca/ecomm-checkout-components/dist/react/LineItem/ProductLineItem";
import { FormattedMessage } from "react-intl";

import { DetailedProduct } from "models/DetailedProduct";

import messages from "../ProductHeader/translations/messages";
import * as styles from "./styles.css";

type ProductKeys = "productImage" | "name" | "sku";
export type ProductLineItemProps = Pick<DetailedProduct, ProductKeys>;

export const ProductLineItem: React.FC<ProductLineItemProps> = ({
    productImage, name, sku
}) => <div className={styles.productLineItem}>
        <BaseLineItem
            isLoading={false}
            productImageUrl={productImage}
        >
            <Col className={styles.productDetails}>
                <p>
                    {name}
                </p>
                <p className={styles.productSku}>
                    <strong><FormattedMessage {...messages.webCode} /></strong> {sku}
                </p>
            </Col>
        </BaseLineItem>
    </div>;

export default ProductLineItem;
