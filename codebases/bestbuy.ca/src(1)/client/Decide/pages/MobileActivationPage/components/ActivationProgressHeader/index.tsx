import * as React from "react";
import {StepIndicator, Step} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";

import * as styles from "./styles.css";
import messages from "./translations/messages";

interface ActivationProgressHeaderProps {
    currentStep: number;
    hideStepIndicator?: boolean;
}

export const ActivationProgressHeader: React.FC<ActivationProgressHeaderProps> = ({
    currentStep,
    hideStepIndicator = false,
}) => (
    <div className={styles.activationProgressHeaderContainer} data-automation="activation-progress-header">
        <div className={styles.activationProgressHeader}>
            <h2 className={styles.pageTitle}>
                <FormattedMessage {...messages.progressHeading} />
            </h2>
            {!hideStepIndicator && (
                <StepIndicator className={styles.stylesOverride}>
                    <Step isCurrentStep={currentStep === 1}>
                        <FormattedMessage {...messages.stepOne} />
                    </Step>
                    <Step isCurrentStep={currentStep === 2}>
                        <FormattedMessage {...messages.stepTwo} />
                    </Step>
                </StepIndicator>
            )}
        </div>
    </div>
);

export default ActivationProgressHeader;
