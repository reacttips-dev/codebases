import * as React from "react";
import {FormattedMessage} from "react-intl";

import {ProductPrice} from "components/ProductCost/ProductPrice";
import {classname} from "utils/classname";
import {classIf} from "utils/classname";

import messages from "../translations/messages";
import * as styles from "./style.css";
import {hasCents} from "../utils";

export interface CellPhonePriceDownProps {
    priceDownMessage?: React.ReactElement;
    taxMessage?: React.ReactElement;
    price: number;
}

const truncPrice = Math.trunc;

export const CellPhonePriceDown: React.FC<CellPhonePriceDownProps> = ({price, priceDownMessage, taxMessage}) => {
    // check if price is an int in a float format (ex. 40.00)
    const hasDecimal = hasCents(price);
    const priceClassNames = classname(styles.price, classIf(styles.decimalPrice, hasDecimal));
    return (
        <div className={styles.priceDown} data-automation="cellphone-pricedown">
            {!hasDecimal ? (
                <p className={priceClassNames}>
                    <FormattedMessage {...messages.downPayment} values={{downPayment: truncPrice(price)}} />
                </p>
            ) : (
                <ProductPrice className={priceClassNames} superscriptCent={true} value={price} size="large" />
            )}
            {priceDownMessage}
            {taxMessage}
        </div>
    );
};

export default CellPhonePriceDown;
