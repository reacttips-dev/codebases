import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Warning} from "@bbyca/bbyca-components";

import {classname as cx} from "utils/classname";
import messages from "./translations/messages";
import * as styles from "./style.css";

export interface LowInventoryProps {
    numRemaining: number;
}

export const MIN_QUANTITY_THRESHOLD = 5;

const LowInventory = ({ numRemaining }: LowInventoryProps): JSX.Element | null => {
    if (numRemaining > MIN_QUANTITY_THRESHOLD || numRemaining < 1) {
        return null;
    }

    const classes = [styles.lowInventoryMsg];
    let msgProps: FormattedMessage.Props = {
        ...messages.lowInventory,
        values: { numRemaining }
    };
    if (numRemaining === 1) {
        classes.push(styles.oneLeft);
        msgProps = messages.oneLeft;
    }

    return (
        <>
            <span className={styles.verticalLine}>|</span>
            <span className={cx(classes)}>
                {numRemaining === 1 && <Warning />}
                <FormattedMessage {...msgProps} />
            </span>
        </>
    );
};

export default LowInventory;
