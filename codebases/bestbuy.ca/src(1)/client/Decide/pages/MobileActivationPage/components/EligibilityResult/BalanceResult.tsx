import * as React from "react";
import {FormattedMessage} from "react-intl";

import {EligibilityResultContainer} from ".";
import messages from "./translations/messages";
import * as styles from "./styles.css";
import {formatPhoneNumber} from "../../utils/helper";
import {EligibilityResultControllers} from "./EligibilityResultControllers";
import {EligibilityResultCommonControllersHandlersProps} from "./";

interface BalanceResultProps extends EligibilityResultCommonControllersHandlersProps {
    mobileNumber: string;
    balance: number;
}

export const BalanceResult: React.FC<BalanceResultProps> = ({
    mobileNumber,
    balance,
    handleContinueClick,
    handleCancelClick,
}) => {
    const title = {...messages.balanceTitle};
    const paragraph = {...messages.balanceParagraph};
    const paragraphValues = {
        mobileNumber: formatPhoneNumber(mobileNumber),
        moreInfoText: (
            <div className={styles.paragraphText}>
                <p className={styles.paragraphInlineText}>
                    <FormattedMessage {...messages.balanceMoreInfo1_1} />
                </p>
                <p className={styles.paragraphInlineBoldText}>
                    <FormattedMessage {...messages.balanceMoreInfo1_2} values={{balance}} />
                </p>
                <p className={styles.paragraphInlineText}>
                    <FormattedMessage {...messages.balanceMoreInfo1_3} />
                </p>
                <p className={styles.paragraphText}>
                    <FormattedMessage {...messages.balanceMoreInfo2} />
                </p>
            </div>
        ),
    };

    return (
        <EligibilityResultContainer
            hasNoBorderDescription={true}
            title={title}
            paragraph={paragraph}
            paragraphValues={paragraphValues}>
            <EligibilityResultControllers
                isUpgradeEligible={true}
                continueHandler={handleContinueClick}
                cancelHandler={handleCancelClick}
            />
        </EligibilityResultContainer>
    );
};
