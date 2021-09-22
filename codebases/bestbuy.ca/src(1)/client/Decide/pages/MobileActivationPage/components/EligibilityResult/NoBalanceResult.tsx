import * as React from "react";

import {EligibilityResultContainer} from ".";
import messages from "./translations/messages";
import {formatPhoneNumber} from "../../utils/helper";
import {EligibilityResultControllers} from "./EligibilityResultControllers";
import {EligibilityResultCommonControllersHandlersProps} from "./";

interface NoBalanceResultProps extends EligibilityResultCommonControllersHandlersProps {
    mobileNumber: string;
}

export const NoBalanceResult: React.FC<NoBalanceResultProps> = ({
    mobileNumber,
    handleContinueClick,
    handleCancelClick,
}) => {
    const title = {...messages.noBalanceTitle};
    const paragraph = {...messages.noBalanceParagraph};
    const paragraphValues = {
        mobileNumber: formatPhoneNumber(mobileNumber),
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
