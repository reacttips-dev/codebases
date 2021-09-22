import * as moment from "moment";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import * as styles from "./style.css";
import messages from "./translations/messages";

export interface ProductSaleEndDateProps {
    value: string;
    disableSeoAttributes?: boolean;
}

const ProductSaleEndDate = (props: ProductSaleEndDateProps) => {
    const timeItemProps = props.disableSeoAttributes ? {} : {itemProp: "priceValidUntil"};
    return (
        <>
            {props.value && (
                <div className={styles.productSaleEnds}>
                    <FormattedMessage {...messages.saleEnds} />:{" "}
                    <time {...timeItemProps} dateTime={props.value}>
                        {moment(props.value)
                            .utcOffset("-08:00")
                            .format("LL")}
                    </time>
                </div>
            )}
        </>
    );
};

export default ProductSaleEndDate;
