import noop from "lodash/noop";
import * as PropTypes from "prop-types";
import React, { Component } from "react";
import ABService from "services/ABService";
import styled from "styled-components";
import { contextTypes } from "./WithContext";
import { IWizardProps, IWizardState, Legend, StepWrapper, Wrapper } from "./Wizard";

const OnboardingStepWrapper = styled(StepWrapper)`
    margin-top: 18px;
`;

export class OnboardingWizard extends Component<IWizardProps, IWizardState> {
    public state = {
        currentStep:
            this.props.welcomeComponent && !ABService.getFlag("vwoSkipFirstArena")
                ? -1
                : this.props.currentStep,
    };

    private static defaultProps = {
        currentStep: 0,
        onClickBack: (nextStep: number, validMove: boolean) => null,
        onNextStep: noop,
        getBackButtonText: () => "workspaces.marketing.wizard.goback",
    };

    public goToStep = (nextStep) => {
        const moveSuccess = nextStep >= 0 && nextStep <= this.props.steps.length;
        if (moveSuccess) {
            this.setState(() => ({
                currentStep: nextStep,
            }));
        }

        this.props.onNextStep(nextStep, moveSuccess);

        return moveSuccess;
    };

    public onClickBack = () => {
        const prevStep = this.state.currentStep - 1;
        const moveSuccess = this.goToStep(prevStep);
        this.props.onClickBack(prevStep, moveSuccess);
    };

    public render() {
        const { currentStep } = this.state;
        const shouldRenderWelcomeComponent = currentStep === -1;

        return (
            <Wrapper>
                <Legend
                    isHidden={false}
                    onClickBack={this.onClickBack}
                    currentStep={currentStep}
                    backButtonText={this.props.getBackButtonText(currentStep)}
                    steps={this.props.steps}
                    showBackButton={this.props.showBackButton(currentStep)}
                    showStepsLegends={this.props.showStepsLegends}
                    infoBoxOnRightInLegend={this.props.infoBoxOnRightInLegend}
                />
                <OnboardingStepWrapper>
                    {shouldRenderWelcomeComponent && this.props.welcomeComponent}
                    {!shouldRenderWelcomeComponent &&
                        this.props.steps[currentStep] &&
                        this.props.steps[currentStep].StepComponent({ step: currentStep })}
                </OnboardingStepWrapper>
            </Wrapper>
        );
    }

    static contextTypes = contextTypes;
    static childContextTypes = {
        goToStep: PropTypes.func.isRequired,
        onClickBack: PropTypes.func.isRequired,
    };

    getChildContext() {
        return {
            goToStep: this.goToStep,
            onClickBack: this.onClickBack,
        };
    }
}

export interface IMovePage {
    (page: number): void;
}

export interface IOnboardingWizardContext {
    ({ children }, context): any;

    contextTypes?: {
        goToStep: PropTypes.Validator<IMovePage>;
        onClickBack: PropTypes.Validator<IMovePage>;
    };
}

export const OnboardingWizardContext: IOnboardingWizardContext = ({ children }, context) => {
    return children(context);
};

OnboardingWizardContext.contextTypes = {
    goToStep: PropTypes.func.isRequired,
    onClickBack: PropTypes.func.isRequired,
};
