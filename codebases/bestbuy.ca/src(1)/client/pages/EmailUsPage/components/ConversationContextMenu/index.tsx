import * as React from "react";
import Dropdown from "components/Dropdown";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import messages from "./translations/messages";
import { ConversationType } from "@bbyca/ecomm-communications-components";

import * as styles from "./style.css";

export interface Props {
    optionSelected: ConversationType;
    onOptionChange: (c: number) => void;
}

export const ConversationContextMenu = (props: InjectedIntlProps & Props) => {
    const generateDropdownOptions = () => {
        return [
            {
                value: ConversationType.initial,
                label: props.intl.formatMessage(messages.select),
            },
            {
                value: ConversationType.orderStatus,
                label: props.intl.formatMessage(messages.orderStatus),
            },
            {
                value: ConversationType.priceMatch,
                label: props.intl.formatMessage(messages.lowPriceGuarantee),
            },
            {
                value: ConversationType.return,
                label: props.intl.formatMessage(messages.returns),
            },
            {
                value: ConversationType.marketPlace,
                label: props.intl.formatMessage(messages.marketPlace),
            },
        ];
    };

    return (
        <div className={styles.conversationContextMenu}>
            <label className={styles.dropdwonMenu}><FormattedMessage {...messages.selectionPrompt} /></label>
            <Dropdown
                dropdownTitle="subject"
                options={generateDropdownOptions()}
                optionSelected={props.optionSelected}
                onOptionChange={props.onOptionChange}
            />
        </div>
    );
};

export default injectIntl(ConversationContextMenu);
