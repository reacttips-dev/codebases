import * as React from "react";
import {FormattedMessage} from "react-intl";

import messages from "./translations/messages";
import {Controllers} from "../Controllers";

export interface EligibilityResultControllersProps {
    isUpgradeEligible: boolean;
    continueHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
    cancelHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const EligibilityResultControllers: React.FC<EligibilityResultControllersProps> = ({
    isUpgradeEligible,
    continueHandler,
    cancelHandler,
}) => {
    const continueLabel = isUpgradeEligible ? (
        <FormattedMessage {...messages.continueActivationButton} />
    ) : (
        <FormattedMessage {...messages.contactAdvisorButton} />
    );

    return (
        <Controllers
            dataAutomation={"eligibility-result-controllers"}
            continueButton={{
                label: continueLabel,
                handler: continueHandler,
                dataAutomation: "eligibility-result-continue-button",
            }}
            cancelButton={{
                label: <FormattedMessage {...messages.cancelLink} />,
                handler: cancelHandler,
                dataAutomation: "eligibility-result-cancel-button",
            }}
        />
    );
};
