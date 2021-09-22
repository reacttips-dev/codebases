import * as React from "react";
import {FormattedMessage, InjectedIntl, injectIntl} from "react-intl";
import messages from "./translations/messages";

export interface Props {
    intl?: InjectedIntl;
    value: number;
}

export const Price = (props: Props) => {
    const {value, intl} = props;
    const formattedPrice = intl?.formatNumber?.(value, {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? value;
    return <FormattedMessage {...messages.price} values={{price: formattedPrice}} />;
};

export default injectIntl(Price);
