import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import styled, { css, keyframes } from "styled-components";

import I18n from "../../../WithTranslation/src/I18n";
import { welcomeArt } from "../../Art/src/WorkspaceArt";
import { TextContainer } from "../src/MarketingWorkspaceOnboardingWelcome";

export const containerFadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
 `;

export const artFadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
 `;

export const buttonFadeIn = keyframes`
  0% {
    opacity: 0;
  }
  75% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
 `;

export const headerFadeIn = keyframes`
  0% {
    transform: translateY(-25px);
    opacity: 0;
  }
  50% {
    transform: translateY(-25px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1
  }
 `;

export const textFadeIn = keyframes`
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  65% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1
  }
 `;

export const Container = styled.div`
    width: 700px;
    border-radius: 6px;
    box-shadow: 0px 3px 6px 0px rgba(14, 30, 62, 0.08);
    background-color: ${colorsPalettes.carbon["0"]};
    padding: 38px 91px 32px;
    box-sizing: border-box;
`;
export const InnerContainer = styled.div<{ fadeOut: boolean }>`
    ${({ fadeOut }) =>
        fadeOut
            ? css`
                  animation: ${containerFadeOut} ease 600ms;
              `
            : null};
    display: flex;
    flex-direction: column;
    align-items: center;
`;
export const SvgContainer = styled.div`
    height: 192px;
    width: 501px;
    margin-bottom: 30px;
    animation: ${artFadeIn} ease-in-out 1000ms;
    text-align: center;
`;
export const Header = styled.div`
    ${setFont({ $size: 30, $weight: 700 })};
    max-width: 510px;
    text-align: center;
    line-height: 32px;
    word-break: break-all;
    animation: ${headerFadeIn} ease-in-out 1210ms;
`;
export const Text = styled.div`
    width: 464px;
    ${setFont({ $size: 16, $weight: 400 })};
    margin: 18px 136px 24px 136px;
    line-height: 24px;
    text-align: center;
    animation: ${textFadeIn} ease-in-out 1210ms;
`;
export const ButtonContainer = styled.div`
    margin-right: 247px;
    margin-left: 247px;
    animation: ${buttonFadeIn} ease-in-out 1600ms;
`;

const FiledContainer = styled.div`
    margin-bottom: 31px;
`;

const TextfiledStyled = styled(Textfield)`
    width: 510px;
`;

export interface IMarketingWorkspaceWelcomeProps {
    user: string;
    onClick: (e?) => void;
    fadeOut?: boolean;
    onChange: (e) => void;
    workspaceNameEnabled?: boolean;
}
const SubText = () => (
    <ul>
        <li>
            <I18n>workspace.marketing.wizard.onboarding_pro_welcome.subtext.line.1</I18n>
        </li>
        <li>
            <I18n>workspace.marketing.wizard.onboarding_pro_welcome.subtext.line.2</I18n>
        </li>
        <li>
            <I18n>workspace.marketing.wizard.onboarding_pro_welcome.subtext.line.3</I18n>
        </li>
    </ul>
);
SubText.displayName = "SubText";

export const MarketingWorkspaceWelcome: StatelessComponent<IMarketingWorkspaceWelcomeProps> = (
    { user, onClick, fadeOut, onChange, workspaceNameEnabled },
    { translate },
) => {
    return (
        <Container>
            <InnerContainer fadeOut={fadeOut}>
                <Header>
                    <I18n>workspace.marketing.wizard.onboarding_pro_welcome.welcome</I18n>
                </Header>
                <Text>
                    <I18n>workspace.marketing.wizard.onboarding_pro_welcome.text</I18n>
                </Text>
                <SvgContainer>{welcomeArt}</SvgContainer>
                <TextContainer>
                    <SubText />
                </TextContainer>
                {workspaceNameEnabled && (
                    <FiledContainer>
                        <TextfiledStyled
                            label={translate("workspace.marketing.wizard.welcome.filed.label")}
                            onChange={onChange}
                            placeholder={translate(
                                "workspace.marketing.wizard.welcome.filed.placeholder",
                            )}
                        />
                    </FiledContainer>
                )}
                <ButtonContainer>
                    <Button type="primary" width={"206px"} onClick={onClick}>
                        <ButtonLabel>
                            <I18n>workspace.marketing.wizard.onboarding_pro_welcome.button</I18n>
                        </ButtonLabel>
                    </Button>
                </ButtonContainer>
            </InnerContainer>
        </Container>
    );
};

MarketingWorkspaceWelcome.displayName = "MarketingWorkspaceWelcome";
MarketingWorkspaceWelcome.contextTypes = {
    translate: PropTypes.func,
};
MarketingWorkspaceWelcome.defaultProps = {
    workspaceNameEnabled: false,
};
