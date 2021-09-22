import * as React from "react";
import {GlobalInfoMessage, Input, required, Link} from "@bbyca/bbyca-components";
import {getHelpTopicsId} from "@bbyca/apex-components/dist/utils/helpTopics";

import messages from "./translations/messages";
import {injectIntl, InjectedIntlProps, FormattedMessage} from "react-intl";
import {State} from "store";

import ContactInformation from "../ContactInformation";
import routeManager from "utils/routeManager";
import {convertLocaleToLang} from "models";
import CtaButtons from "../CtaButtons";
import {connect} from "react-redux";
import {getCmsEnvironment} from "utils/environment";

export interface StateProps {
    environment: string | undefined;
}

export const PriceMatchForm = (props: InjectedIntlProps & StateProps) => {
    const lowPriceGuaranteeProps = {
        href: getLowPriceGuaranteeHref(props.intl.locale as Locale, props.environment),
        targetSelf: false,
    };
    const lowPriceGuaranteeLink = (
        <Link {...lowPriceGuaranteeProps}>{props.intl.formatMessage(messages.lowPriceGuarantee)}</Link>
    );
    return (
        <>
            <GlobalInfoMessage>
                <FormattedMessage {...messages.selfHelpInfo} values={{lowPriceGuarantee: lowPriceGuaranteeLink}} />
            </GlobalInfoMessage>
            <Input
                name="productName"
                validators={[required]}
                label={props.intl.formatMessage(messages.productName)}
                errorMsg={props.intl.formatMessage(messages.productNameError)}
                maxLength={100}
            />
            <Input
                name="bbyProductPage"
                validators={[required]}
                label={props.intl.formatMessage(messages.bbyProductPage)}
                errorMsg={props.intl.formatMessage(messages.bbyProductPageError)}
                maxLength={100}
            />
            <Input
                name="retailerName"
                validators={[required]}
                label={props.intl.formatMessage(messages.retailerName)}
                errorMsg={props.intl.formatMessage(messages.retailerNameError)}
                maxLength={100}
            />
            <Input
                name="retailerProductPage"
                validators={[required]}
                label={props.intl.formatMessage(messages.retailerProductPage)}
                errorMsg={props.intl.formatMessage(messages.retailerProductPageError)}
                maxLength={100}
            />
            <Input
                name="lowerPrice"
                validators={[required]}
                label={props.intl.formatMessage(messages.lowerPrice)}
                errorMsg={props.intl.formatMessage(messages.lowerPriceError)}
                maxLength={100}
            />
            <hr />
            <ContactInformation />
            <CtaButtons />
        </>
    );
};

const getLowPriceGuaranteeHref = (locale: Locale, env?: string) => {
    const cmsEnv = env ? getCmsEnvironment(env) : "development";
    const lowestPriceGuaranteeID = getHelpTopicsId(cmsEnv).lowestPriceGuarantee;
    return routeManager.getPathByKey(convertLocaleToLang(locale), "help", ...lowestPriceGuaranteeID);
};

const mapStateToProps = (state: State): StateProps => ({
    environment: state.config.environment,
});

export default connect<StateProps>(mapStateToProps)(injectIntl(PriceMatchForm));
