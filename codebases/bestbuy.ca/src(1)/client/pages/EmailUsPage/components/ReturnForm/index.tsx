import * as React from "react";
import { TextArea, required, GlobalInfoMessage, Link } from "@bbyca/bbyca-components";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";

import messages from "./translations/messages";
import routeManager from "utils/routeManager";
import { convertLocaleToLang } from "models";
import ContactInformation from "../ContactInformation";
import CtaButtons from "../CtaButtons";

export const ReturnForm = (props: InjectedIntlProps) => {
    const helpPageProps = {
        href: getHelpPageHref(props.intl.locale as Locale),
        targetSelf: false,
      };
    const helpPageLink = (<Link {...helpPageProps}>{props.intl.formatMessage(messages.helpPage)}</Link>);
    return (
        <>
            <GlobalInfoMessage>
                <FormattedMessage {...messages.selfHelpInfo} values={{helpPage: helpPageLink}}/>
            </GlobalInfoMessage>
            <TextArea
                name="returnBody"
                validators={[required]}
                label={props.intl.formatMessage(messages.explanationField)}
                errorMsg={props.intl.formatMessage(messages.explanationFieldError)}
                maxLength={1000}
            />
            <hr />
            <ContactInformation />
            <CtaButtons />
        </>
    );
};

function getHelpPageHref(locale: Locale) {
    return routeManager.getPathByKey(
        convertLocaleToLang(locale),
        "help");
}

export default injectIntl(ReturnForm);
