import * as React from "react";
import {GeekSquadOrange} from "@bbyca/bbyca-components";
import {InjectedIntlProps, injectIntl} from "react-intl";

import TermsAndConditions, {Props as TermsAndConditionsProps} from "../../../../components/TermsAndConditions";
import messages from "./translations/messages";
import * as styles from "./styles.css";

export const GSP_TC_ID = "GSPTermsAndConditions";

export const GSPTermsAndConditions: React.FC<TermsAndConditionsProps & InjectedIntlProps> = ({
    isTermsAccepted,
    onTermsChecked,
    links,
    shouldHighlightTerms,
    className,
    intl,
}) => {
    const optionalProps = {
        ...(className && className.length && {className}),
    };
    return (
        <div data-automation="basket-terms-conditions" {...optionalProps} id={GSP_TC_ID}>
            <div className={styles.topWrapper}>
                <GeekSquadOrange className={styles.geekSquadIcon} />
                <span className={styles.geekSquadHeader}>{intl.formatMessage(messages.geekSquadHeader)}</span>
            </div>
            <TermsAndConditions
                className={styles.geekSquadTC}
                isTermsAccepted={isTermsAccepted}
                shouldHighlightTerms={shouldHighlightTerms}
                onTermsChecked={onTermsChecked}
                links={links}
                errorMsg={intl.formatMessage(messages.errorMsg)}
            />
        </div>
    );
};

GSPTermsAndConditions.displayName = "GSPTermsAndConditions";

export default injectIntl(GSPTermsAndConditions);
