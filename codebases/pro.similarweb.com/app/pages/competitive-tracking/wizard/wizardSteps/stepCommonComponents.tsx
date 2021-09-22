import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { NextButtonContainer, Subtitle, Title } from "./WizardStepStyles";
import styled from "styled-components";

export const WizardStepHeader = (props: {
    titleText: string;
    subtitleText?: string;
    maxWidth?: number;
}) => {
    const { titleText, subtitleText, maxWidth } = props;

    return (
        <FlexColumn alignItems={"center"} justifyContent={"center"}>
            <Title maxWidth={maxWidth}>{titleText}</Title>
            {subtitleText && <Subtitle maxWidth={maxWidth}>{subtitleText}</Subtitle>}
        </FlexColumn>
    );
};

export const WizardNextButton = (props: {
    onNextStepClick: () => void;
    isDisabled: boolean;
    text: string;
    icon?: string;
    isLoading?: boolean;
}) => {
    const { onNextStepClick, isDisabled, text, icon, isLoading = false } = props;
    const isIconButton = !!icon;

    const ButtonComponent = isIconButton ? (
        <IconButton
            iconName={icon}
            iconSize={"xs"}
            isDisabled={isDisabled}
            onClick={onNextStepClick}
            isLoading={isLoading}
        >
            {text}
        </IconButton>
    ) : (
        <Button onClick={onNextStepClick} isDisabled={isDisabled} isLoading={isLoading}>
            {text}
        </Button>
    );

    return <NextButtonContainer>{ButtonComponent}</NextButtonContainer>;
};

export const InfoIconContainer = styled.div`
    padding: 0px 0px 5px 5px;
`;
