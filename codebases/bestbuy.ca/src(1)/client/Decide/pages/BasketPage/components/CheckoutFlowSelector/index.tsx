import * as React from "react";
import {injectIntl, InjectedIntlProps, FormattedMessage} from "react-intl";
import {RadioButton, RadioGroup} from "@bbyca/bbyca-components";

import {classname as cx} from "utils/classname";

import messages from "./translations/messages";
import * as styles from "./styles.css";
import {CheckoutFlow} from "Decide/reducers";

export enum QPU_IN_CART_STATE {
    ALL = "ALL QPU",
    SOME = "SOME QPU",
    NONE = "NO QPU",
}

export interface CheckoutFlowSelectorProps {
    onChange: (selection: CheckoutFlow) => void;
    pickUpAtStoreDisabled: boolean;
    selected?: CheckoutFlow;
    className?: string;
    qpuInCartState: QPU_IN_CART_STATE;
    numberOfItemsInCart: number;
}

const CheckoutFlowSelector = ({
    intl,
    selected,
    onChange,
    pickUpAtStoreDisabled,
    className,
    qpuInCartState = QPU_IN_CART_STATE.ALL,
    numberOfItemsInCart,
}: CheckoutFlowSelectorProps & InjectedIntlProps): React.ReactElement => {

    const qpuMessageMap = {
        // no special message when everything is available for QPU. Happy Path.
        [QPU_IN_CART_STATE.ALL]: null,
        [QPU_IN_CART_STATE.SOME]: (
            (selected === CheckoutFlow.getItShipped) ? null : <FormattedMessage
                {...messages.someProductsNotAvailableForQPU}
                values={{lineItemsCount: numberOfItemsInCart}}
            />
        ),
        [QPU_IN_CART_STATE.NONE]: (
            <FormattedMessage {...messages.noProductsAvailableForQPU} values={{lineItemsCount: numberOfItemsInCart}} />
        ),
    };

    const qpuMessage = qpuMessageMap[qpuInCartState];

    return (
        <div className={cx([styles.checkoutFlowSelector, className])}>
            <h2>
                <FormattedMessage {...messages.header} />
            </h2>
            <RadioGroup
                className={styles.form}
                name="radioGroup"
                value={selected}
                onChange={(_, value: any) => onChange(value)}>
                <RadioButton
                    label={intl.formatMessage({...messages.getItShipped})}
                    selectedValue={CheckoutFlow.getItShipped}
                />
                <RadioButton
                    label={intl.formatMessage({...messages.pickUpAtStore})}
                    selectedValue={CheckoutFlow.pickUpAtAStore}
                    disabled={pickUpAtStoreDisabled}
                    className={cx([{[styles.disabled]: pickUpAtStoreDisabled}])}
                />
            </RadioGroup>
            {qpuMessage && <p className={styles.qpuInCartStateMessage}>{qpuMessage}</p>}
        </div>
    );
};

export default injectIntl(CheckoutFlowSelector);
