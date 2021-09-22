import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {animateScroll} from "react-scroll";

import {EligibilityResultTypes, MobileActivationStep} from "models";

import messages from "./translations/messages";
import {NoBalanceResult, BalanceResult, NotEligibleResult, DenyResult} from "./";

interface ContinueClickPayload {
    isUpgradeEligible: boolean;
    mobileNumber: string;
    balance: number;
}

export interface UpgradeEligibilityProps {
    isUpgradeEligible?: boolean;
    mobileNumber: string;
    balance: number | null;
    handleContinueClick: (event: React.MouseEvent<HTMLButtonElement>, payload?: ContinueClickPayload) => void;
    handleCancelClick: (event: React.MouseEvent<HTMLButtonElement>, activationStep: MobileActivationStep) => void;
}

export const EligibilityResult: React.FC<UpgradeEligibilityProps & InjectedIntlProps> = ({
    isUpgradeEligible,
    mobileNumber,
    balance,
    handleContinueClick,
    handleCancelClick,
    intl,
}) => {
    React.useEffect(() => {
        animateScroll.scrollToTop({
            delay: 100,
            duration: 1000,
            smooth: true,
        });
    }, []);

    const onCancelClick = React.useCallback(
        (e) => {
            handleCancelClick(e, MobileActivationStep.EligibilityResult);
        },
        [handleCancelClick],
    );

    let eligibilityResult = <DenyResult handleContinueClick={handleContinueClick} handleCancelClick={onCancelClick} />;
    let eligibilityResultType = EligibilityResultTypes.InStoreEligible;
    if (isUpgradeEligible && !balance) {
        eligibilityResult = (
            <NoBalanceResult
                mobileNumber={mobileNumber}
                handleContinueClick={handleContinueClick}
                handleCancelClick={onCancelClick}
            />
        );
        eligibilityResultType = EligibilityResultTypes.NoBalance;
    } else if (isUpgradeEligible && balance && balance > 0) {
        eligibilityResult = (
            <BalanceResult
                mobileNumber={mobileNumber}
                balance={balance}
                handleContinueClick={handleContinueClick}
                handleCancelClick={onCancelClick}
            />
        );
        eligibilityResultType = EligibilityResultTypes.Balance;
    } else if (isUpgradeEligible === false) {
        eligibilityResult = <NotEligibleResult storesLinkUrl={intl.formatMessage(messages.storesLink)} />;
        eligibilityResultType = EligibilityResultTypes.NotEligible;
    }
    adobeLaunch.pushEventToDataLayer({
        event: "mobile-activation-eligibility-results",
        payload: {
            eligibilityResultType,
        },
    });
    return eligibilityResult;
};

export default injectIntl(EligibilityResult);
