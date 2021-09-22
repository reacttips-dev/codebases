import * as React from "react";
import {FormattedMessage} from "react-intl";

import {EligibilityResultContainer} from ".";
import messages from "./translations/messages";
import * as styles from "./styles.css";
import {EligibilityResultControllers} from "./EligibilityResultControllers";
import {EligibilityResultCommonControllersHandlersProps} from "./";

export const DenyResult: React.FC<EligibilityResultCommonControllersHandlersProps> = ({
    handleContinueClick,
    handleCancelClick,
}) => {
    const title = {...messages.denyTitle};
    const paragraph = {...messages.denyParagraph};
    const paragraphValues = {
        denyText: (
            <p className={styles.paragraphText}>
                <FormattedMessage {...messages.denyMoreInfo} />
            </p>
        ),
    };
    return (
        <EligibilityResultContainer
            hasNoBorderDescription={false}
            title={title}
            paragraph={paragraph}
            paragraphValues={paragraphValues}>
            <EligibilityResultControllers
                isUpgradeEligible={false}
                continueHandler={handleContinueClick}
                cancelHandler={handleCancelClick}
            />
        </EligibilityResultContainer>
    );
};
