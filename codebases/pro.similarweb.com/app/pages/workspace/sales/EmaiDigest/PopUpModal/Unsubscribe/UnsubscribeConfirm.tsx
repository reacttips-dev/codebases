/** @similarweb IMPORT */
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import I18n from "components/React/Filters/I18n";

/** NPM IMPORT */
import React, { FC } from "react";

import { ButtonBox, CustomTitle, MainBox, Subtitle } from "./StyledUnsubscribe";

interface IUnsubscribeConfirmProps {
    onClickUnsubscribeCancel: VoidFunction;
    onClickUnsubscribe: VoidFunction;
}

export const UnsubscribeConfirm: FC<IUnsubscribeConfirmProps> = ({
    onClickUnsubscribeCancel,
    onClickUnsubscribe,
}) => (
    <MainBox>
        <CustomTitle>
            <I18n>workspace.sales.email.digest.unsubscribe.modal.title</I18n>
        </CustomTitle>
        <Subtitle>
            <I18n>workspace.sales.email.digest.unsubscribe.modal.subtitle</I18n>
        </Subtitle>
        <ButtonBox>
            <Button type="flat" onClick={onClickUnsubscribeCancel}>
                <ButtonLabel>
                    <I18n>workspace.sales.email.digest.unsubscribe.modal.btn.cancel</I18n>
                </ButtonLabel>
            </Button>
            <Button type="primary" buttonHtmlType={"button"} onClick={onClickUnsubscribe}>
                <ButtonLabel>
                    <I18n>workspace.sales.email.digest.unsubscribe.modal.btn.unsubscribe</I18n>
                </ButtonLabel>
            </Button>
        </ButtonBox>
    </MainBox>
);
