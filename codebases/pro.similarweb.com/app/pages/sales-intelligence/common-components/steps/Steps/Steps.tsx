import React from "react";
import { DefaultLegendItem } from "components/Workspace/Wizard/src/DefaultLegendItem";
import { StyledStepsSeparator, StyledStepItem, StyledStepsContainer } from "./styles";

type StepsProps = {
    currentStep: number;
    steps: string[];
};

const Steps = (props: StepsProps) => {
    const { steps, currentStep } = props;

    return (
        <StyledStepsContainer data-automation="steps-container">
            {steps.map((stepLabel, index) => (
                <StyledStepItem key={`step-item-${index}`} data-automation={`step-item-${index}`}>
                    <DefaultLegendItem
                        step={index}
                        label={stepLabel}
                        currentStep={currentStep}
                        isVisited={index < currentStep}
                        isActive={currentStep === index}
                    />
                    {index + 1 < steps.length && <StyledStepsSeparator />}
                </StyledStepItem>
            ))}
        </StyledStepsContainer>
    );
};

export default Steps;
