import * as React from "react";
import {TextArea, Input, required} from "@bbyca/bbyca-components";
import {injectIntl, InjectedIntlProps} from "react-intl";

import messages from "./translations/messages";
import ContactInformation from "../ContactInformation";
import CtaButtons from "../CtaButtons";

export const GeneralQuestionForm = (props: InjectedIntlProps) => {
    return (
        <>
            <Input
                name="questionTopic"
                label={props.intl.formatMessage(messages.questionTopic)}
                validators={[required]}
                errorMsg={props.intl.formatMessage(messages.questionTopicError)}
                maxLength={100}
            />
            <TextArea
                name="generalQuestionBody"
                label={props.intl.formatMessage(messages.questionBody)}
                validators={[required]}
                maxLength={1000}
                errorMsg={props.intl.formatMessage(messages.questionBodyError)}
            />
            <hr />
            <ContactInformation />
            <CtaButtons />
        </>
    );
};

export default injectIntl(GeneralQuestionForm);
