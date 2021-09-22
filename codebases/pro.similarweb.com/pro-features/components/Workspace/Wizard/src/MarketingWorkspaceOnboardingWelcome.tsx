import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { FunctionComponent } from "react";
import styled, { css } from "styled-components";
import I18n from "../../../WithTranslation/src/I18n";
import { marketingOnboardingWelcomeArt } from "../../Art/src/WorkspaceArt";
import {
    artFadeIn,
    buttonFadeIn,
    containerFadeOut,
    headerFadeIn,
    textFadeIn,
} from "./MarketingWorkspaceWelcome";

const Container = styled.div<{ fadeOut: boolean }>`
    ${({ fadeOut }) =>
        fadeOut
            ? css`
                  animation: ${containerFadeOut} ease 600ms;
              `
            : null};
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 610px;
    height: 464px;
    border-radius: 6px;
    padding: 31px 59px 32px;
    box-shadow: 0px 3px 6px 0px rgba(14, 30, 62, 0.08);
    background-color: ${colorsPalettes.carbon["0"]};
    box-sizing: border-box;
    overflow: hidden;
`;
const Title = styled.div`
    width: 303px;
    height: 36px;
    ${setFont({ $size: 30, $weight: 500, $color: colorsPalettes.carbon[500] })};
    line-height: 1.2;
    text-align: center;
    margin-bottom: 4px;
    overflow: hidden;
    animation: ${headerFadeIn} ease-in-out 1210ms;
`;
const SubTitle = styled.div`
    width: 386px;
    height: 45px;
    ${setFont({ $size: 14, $weight: 400, $color: rgba(colorsPalettes.midnight[500], 0.54) })};
    line-height: 1.43;
    letter-spacing: 0.2px;
    text-align: center;
    margin-bottom: 16px;
    overflow: hidden;
    animation: ${textFadeIn} ease-in-out 1210ms;
`;
const SvgContainer = styled.div`
    height: 145px;
    width: 219px;
    margin-bottom: 17px;
    animation: ${artFadeIn} ease-in-out 1000ms;
`;
export const TextContainer = styled.div`
    width: 492px;
    height: 72px;
    ${setFont({ $size: 14, $weight: 400, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    line-height: 1.71;
    margin-bottom: 28px;
    overflow: hidden;
    ul {
        list-style-type: disc;
    }
    ul li span {
        position: relative;
        left: 10px;
    }
`;

const ButtonContainer = styled.div`
    width: 207px;
    height: 38px;
    border-radius: 18px;
    background-color: ${rgba(colorsPalettes.carbon[500], 0.05)};
    animation: ${buttonFadeIn} ease-in-out 1600ms;
`;

const SubText = () => (
    <ul>
        <li>
            <I18n>workspace.marketing.wizard.onboarding_welcome.subtext.line.1</I18n>
        </li>
        <li>
            <I18n>workspace.marketing.wizard.onboarding_welcome.subtext.line.2</I18n>
        </li>
        <li>
            <I18n>workspace.marketing.wizard.onboarding_welcome.subtext.line.3</I18n>
        </li>
    </ul>
);
SubText.displayName = "SubText";

interface IMarketingWorkspaceOnboardingWelcomeProps {
    onClick: (e?) => void;
    fadeOut?: boolean;
}

export const MarketingWorkspaceOnboardingWelcome: FunctionComponent<IMarketingWorkspaceOnboardingWelcomeProps> = ({
    onClick,
    fadeOut,
}) => {
    return (
        <Container fadeOut={fadeOut}>
            <Title>
                <I18n>workspace.marketing.wizard.onboarding_welcome.welcome</I18n>
            </Title>
            <SubTitle>
                <I18n>workspace.marketing.wizard.onboarding_welcome.text</I18n>
            </SubTitle>
            <SvgContainer>{marketingOnboardingWelcomeArt}</SvgContainer>
            <TextContainer>
                <SubText />
            </TextContainer>
            <ButtonContainer>
                <Button type="primary" width={"207px"} height={"38px"} onClick={onClick}>
                    <ButtonLabel>
                        <I18n>workspace.marketing.wizard.welcome.button</I18n>
                    </ButtonLabel>
                </Button>
            </ButtonContainer>
        </Container>
    );
};

MarketingWorkspaceOnboardingWelcome.displayName = "MarketingWorkspaceOnboardingWelcome";
