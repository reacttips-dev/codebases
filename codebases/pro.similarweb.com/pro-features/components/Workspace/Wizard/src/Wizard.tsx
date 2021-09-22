import { IconButton } from "@similarweb/ui-components/dist/button";
import noop from "lodash/noop";
import * as PropTypes from "prop-types";
import React, { Component, ComponentType, FunctionComponent } from "react";
import styled, { css, keyframes } from "styled-components";
import { contextTypes, WithContext } from "./WithContext";

export interface IStepProps {
    step: number;
}

export interface IStepLegendProps {
    isActive: boolean;
    isVisited: boolean;
    currentStep: number;
    step: number;
}

export interface IStep {
    LegendItem: ComponentType<IStepLegendProps>;

    StepComponent(step: IStepProps): React.ReactNode;
}

export interface IWizardProps {
    steps: IStep[];
    welcomeComponent?: any;
    currentStep?: number;
    getBackButtonText?: (currentStep: number) => string;
    hideLegend?: boolean;
    showStepsLegends?: boolean;
    infoBoxOnRightInLegend?: (currentStep: number, stepsLen: number) => VoidFunction;

    showBackButton?(currentStep: number): boolean;

    onClickBack?(currentStep: number, success: boolean);
    onNextStep?(nextStep: number, moveSuccess: boolean): void;
}

export interface IWizardState {
    currentStep: number;
}

const slideDown = keyframes`
    0% {
        transform: translateY(-80px);
    }
    100% {
        transform: translateY(0px);
    }
`;

export const LegendContainer = styled.div<{ isHidden: boolean }>`
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    animation: ${slideDown} ease-in-out 270ms;
    transition: opacity ease-in-out 120ms, transform ease-in-out 350ms;
    opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
    transform: ${({ isHidden }) => (isHidden ? `translateY(-80px)` : `translateY(0px)`)};
`;

const LegendItemWrapper = styled.div`
    height: 48px;
    display: flex;
    align-items: center;
`;

const ItemsWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: center;
`;

const Separator = styled.div`
    box-shadow: 0 1px 0 0 #bec4ca;
    width: 186px;
    height: 1px;
    margin-top: -22px;
`;

export const Wrapper = styled.div`
    width: 100%;
`;

interface IBackButtonContainerProps {
    visible: boolean;
    isPaddingLeft: boolean;
}

const BackButtonContainer = styled.div<IBackButtonContainerProps>`
    box-sizing: border-box;
    padding: ${(props) => (props.isPaddingLeft ? "0 0 0 32px" : "0 54px 0 0")};
    transition: all 0.2s ease-in;
    ${(props) =>
        !props.visible &&
        css`
            opacity: 0;
            transform: scale(0.7);
            pointer-events: none;
        `}
`;

export const StepWrapper = styled.div`
    margin: 32px 0 auto;
    display: flex;
    justify-content: center;
`;

export const BackButton: FunctionComponent<{
    visible: boolean;
    backButtonText: string;
    onClickBack: VoidFunction;
    isPaddingLeft: boolean;
    className?: string;
}> = ({ visible, backButtonText, onClickBack, className, isPaddingLeft }) => (
    <WithContext>
        {({ translate }) => (
            <BackButtonContainer
                visible={visible}
                className={className}
                isPaddingLeft={isPaddingLeft}
            >
                <IconButton type={"flat"} iconName={"arrow-left"} onClick={onClickBack}>
                    <span>{translate(backButtonText)}</span>
                </IconButton>
            </BackButtonContainer>
        )}
    </WithContext>
);

export const Legend = ({
    currentStep,
    steps,
    backButtonText,
    onClickBack,
    showBackButton,
    isHidden,
    showStepsLegends = true,
    infoBoxOnRightInLegend,
    isPaddingLeft = true,
}: {
    currentStep: any;
    steps: any[];
    backButtonText: string;
    onClickBack: () => void;
    showBackButton: boolean;
    isHidden: boolean;
    showStepsLegends?: boolean;
    infoBoxOnRightInLegend?: (currentStep, length) => {};
    isPaddingLeft?: boolean;
}) => {
    return (
        <LegendContainer isHidden={isHidden}>
            <BackButton
                onClickBack={onClickBack}
                backButtonText={backButtonText}
                visible={showBackButton}
                isPaddingLeft={isPaddingLeft}
            />
            {showStepsLegends && (
                <ItemsWrapper data-automation-wizard-steps>
                    {steps.map(({ LegendItem }, index) => (
                        <LegendItemWrapper key={index} data-automation-wizard-step={index}>
                            <LegendItem
                                step={index}
                                currentStep={currentStep}
                                isActive={currentStep === index}
                                isVisited={index < currentStep}
                            />
                            {index + 1 < steps.length && <Separator />}
                        </LegendItemWrapper>
                    ))}
                </ItemsWrapper>
            )}
            <BackButtonContainer visible={true} isPaddingLeft={false}>
                {infoBoxOnRightInLegend && infoBoxOnRightInLegend(currentStep, steps.length)}
            </BackButtonContainer>
        </LegendContainer>
    );
};

export class Wizard extends Component<IWizardProps, IWizardState> {
    public state = {
        currentStep: this.props.welcomeComponent ? -1 : this.props.currentStep,
    };

    public static defaultProps = {
        currentStep: 0,
        getBackButtonText: () => "workspaces.marketing.wizard.goback",
        showBackButton: (currentStep) => currentStep > 0,
        onClickBack: (nextStep: number, validMove: boolean) => null,
        hideLegend: false,
        onNextStep: noop,
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
        const shouldRenderWelcomeComponent =
            this.props.welcomeComponent && this.state.currentStep === -1;
        const hideLegend = this.props.hideLegend || shouldRenderWelcomeComponent;

        return (
            <Wrapper>
                <Legend
                    isHidden={hideLegend}
                    onClickBack={this.onClickBack}
                    currentStep={currentStep}
                    backButtonText={this.props.getBackButtonText(currentStep)}
                    steps={this.props.steps}
                    showBackButton={this.props.showBackButton(currentStep)}
                    showStepsLegends={this.props.showStepsLegends}
                    infoBoxOnRightInLegend={this.props.infoBoxOnRightInLegend}
                />
                <StepWrapper>
                    {shouldRenderWelcomeComponent && this.props.welcomeComponent}
                    {!shouldRenderWelcomeComponent &&
                        this.props.steps[currentStep] &&
                        this.props.steps[currentStep].StepComponent({ step: currentStep })}
                </StepWrapper>
            </Wrapper>
        );
    }

    public static contextTypes = contextTypes;
    public static childContextTypes = {
        goToStep: PropTypes.func.isRequired,
        onClickBack: PropTypes.func.isRequired,
    };

    public getChildContext() {
        return {
            goToStep: this.goToStep,
            onClickBack: this.onClickBack,
        };
    }
}

export type IMovePage = (page: number) => void;

export interface IWizardContext {
    ({ children }, context): any;

    contextTypes?: {
        goToStep: PropTypes.Validator<IMovePage>;
        onClickBack: PropTypes.Validator<IMovePage>;
    };
}

export const WizardContext: IWizardContext = ({ children }, context) => {
    return children(context);
};

WizardContext.contextTypes = {
    goToStep: PropTypes.func.isRequired,
    onClickBack: PropTypes.func,
};
