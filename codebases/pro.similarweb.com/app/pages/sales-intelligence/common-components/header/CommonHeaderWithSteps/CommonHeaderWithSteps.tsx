import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledHeaderWithSteps, StyledBackContainer } from "./styles";
import Steps from "../../steps/Steps/Steps";

type CommonHeaderWithStepsProps = {
    steps: string[];
    currentStep: number;
    onBackClick?(): void;
};

const CommonHeaderWithSteps = (props: CommonHeaderWithStepsProps) => {
    const translate = useTranslation();
    const { currentStep, steps, onBackClick } = props;

    function renderBackButton() {
        return (
            <StyledBackContainer>
                <IconButton type="flat" iconName="arrow-left" onClick={onBackClick}>
                    {translate("si.common.button.back")}
                </IconButton>
            </StyledBackContainer>
        );
    }

    return (
        <StyledHeaderWithSteps>
            {typeof onBackClick === "function" && renderBackButton()}
            <Steps currentStep={currentStep} steps={steps} />
        </StyledHeaderWithSteps>
    );
};

export default CommonHeaderWithSteps;
