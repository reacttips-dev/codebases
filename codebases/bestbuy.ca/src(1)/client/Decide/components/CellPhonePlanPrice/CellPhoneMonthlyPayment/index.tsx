import * as React from "react";
import {FormattedMessage} from "react-intl";

import {ProductPrice} from "components/ProductCost/ProductPrice";
import {classname, classIf} from "utils/classname";

import * as styles from "./style.css";
import {hasCents} from "../utils";
import messages from "../translations/messages";

export interface CellPhoneMonthlyPaymentProps {
    monthly: number;
    disableSeoAttributes?: boolean;
}

export const CellPhoneMonthlyPayment: React.FC<CellPhoneMonthlyPaymentProps> = ({monthly, disableSeoAttributes}) => {
    // check if price is an int in a float format (ex. 40.00)
    const hasDecimal = hasCents(monthly);
    const pricePerMonthClassNames = React.useMemo(() => {
        return classname([styles.pricePerMonth, classIf(styles.hideDecimals, !hasDecimal)]);
    }, [monthly]);

    return (
        <div className={pricePerMonthClassNames} data-automation="cellphone-monthly">
            <ProductPrice
                className={styles.price}
                superscriptCent={!hasDecimal}
                value={hasDecimal ? Number(monthly).toFixed(2) : monthly}
                size="small"
                disableSeoAttributes={disableSeoAttributes}
            />
            <FormattedMessage {...messages.monthly} />
        </div>
    );
};

export default CellPhoneMonthlyPayment;
