import * as React from "react";
import {FormattedMessage} from "react-intl";

import {classname as cx} from "utils/classname";

import * as styles from "./style.css";
import messages from "./translations/messages";

export interface ProductSavingProps {
    value: number;
    position?: "top" | "right";
}

export default (props: ProductSavingProps) => {
    return props.value > 0 && Math.round(props.value) > 0 ? (
        <span className={cx([styles.productSaving, styles[props.position || ""]])} data-automation="product-saving">
            <FormattedMessage {...messages.save} values={{value: Math.round(props.value)}} />
        </span>
    ) : null;
};
