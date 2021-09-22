import { noop } from "lodash";
import React from "react";

export interface ICompetitiveTrackingWizardContext {
    onNextStepClick: () => void;
    onPrevStepClick: () => void;
    onCancelClick: () => void;
}

export const CompetitiveTrackingWizardContext = React.createContext<
    ICompetitiveTrackingWizardContext
>({
    onNextStepClick: noop,
    onPrevStepClick: noop,
    onCancelClick: noop,
});
