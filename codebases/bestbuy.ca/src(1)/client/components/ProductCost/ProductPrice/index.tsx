import * as React from "react";
import {FormattedMessage} from "react-intl";
import {getAvailabilitySchema, getPriceValidUntil, getUrl} from "utils/productDetail";
import Price from "../../../components/Price";
import * as styles from "./style.css";
import messages from "./translations/messages";

export type PriceSize = "small" | "medium" | "large";

export interface PriceProps {
    className?: string;
    value: number;
    superscriptCent?: boolean;
    size: PriceSize;
    isSalePrice?: boolean;
    saleEndDate?: string;
    availabilityStatus?: string;
    rightEndPriceExtra?: string;
    disableSeoAttributes?: boolean;
}

export const ProductPrice = (props: PriceProps) => {
    if (props.value === null || props.value === undefined) {
        return null;
    }

    const getPriceDecimalValue = () => {
        const formattedValue = Math.round((parseFloat("" + props.value) % 1) * 100);

        return (
            <span className={styles.rightEndPrice}>
                {formattedValue < 10 ? "0" + formattedValue : formattedValue}
                {props.rightEndPriceExtra || ""}
            </span>
        );
    };

    let formattedPrice;
    if (props.superscriptCent) {
        const values = {
            priceDecimalValue: getPriceDecimalValue(),
            priceIntegerValue: parseInt("" + props.value, 10),
        };
        formattedPrice = <FormattedMessage {...messages.formattedPriceWithSuperscriptCent} values={values} />;
    } else {
        formattedPrice = <Price value={props.value} />;
    }

    const priceStyle = `${styles.price} ${styles[props.size]} ${props.isSalePrice ? styles.salePrice : ""}`;

    const screenReaderStyle = `${styles.screenReaderOnly} ${styles.large}`;

    const productPriceItemProps = {
        container: props.disableSeoAttributes
            ? {}
            : {itemProp: "offers", itemScope: true, itemType: "http://schema.org/Offer"},
        metaPriceCurrency: <meta itemProp="priceCurrency" content="CAD" />,
        metaPrice: <meta itemProp="price" content={props.value.toString()} />,
        metaVailidDate: <meta itemProp="priceValidUntil" content={getPriceValidUntil(props.saleEndDate)} />,
        metaUrl: <meta itemProp="url" content={getUrl()} />,
    };

    return (
        <span {...productPriceItemProps.container} className={props.className || ""} data-automation="product-price">
            {!props.disableSeoAttributes && productPriceItemProps.metaPriceCurrency}
            {!props.disableSeoAttributes && productPriceItemProps.metaPrice}
            {!props.disableSeoAttributes && productPriceItemProps.metaVailidDate}
            {!props.disableSeoAttributes && productPriceItemProps.metaUrl}
            {!props.disableSeoAttributes && !!props.availabilityStatus && (
                <link itemProp="availability" href={getAvailabilitySchema(props.availabilityStatus)} />
            )}
            <span className={screenReaderStyle}>{"$" + props.value}</span>
            <div className={priceStyle} aria-hidden="true">
                {formattedPrice}
            </div>
        </span>
    );
};

export default ProductPrice;
