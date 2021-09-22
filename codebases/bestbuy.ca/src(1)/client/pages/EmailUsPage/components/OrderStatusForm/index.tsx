import * as React from "react";
import { Input, TextArea, required } from "@bbyca/bbyca-components";
import { injectIntl, InjectedIntlProps } from "react-intl";

import messages from "./translations/messages";
import ContactInformation from "../ContactInformation";
import CtaButtons from "../CtaButtons";

export const OrderStatusForm = (props: InjectedIntlProps) => {
    return (
        <>
            <Input
                name="orderNumber"
                label={props.intl.formatMessage(messages.orderNumber)}
                validators={[required]}
                errorMsg={props.intl.formatMessage(messages.orderNumberError)}
                maxLength={15}
            />
            <TextArea
                name="body"
                label={props.intl.formatMessage(messages.bodyField)}
                validators={[required]}
                maxLength={1000}
                errorMsg={props.intl.formatMessage(messages.bodyFieldError)}
            />
            <hr />
            <ContactInformation />
            <CtaButtons />
        </>
    );
};

export default injectIntl(OrderStatusForm);
