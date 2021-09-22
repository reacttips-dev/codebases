import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled, { css, keyframes } from "styled-components";
import { CountryContainer } from "../../../../../pages/keyword research tool/wizard/src/StyledComponent";

const collapse = keyframes`
  0% {
    min-height: 534px
  }
  100% {
    min-height: 350px
  }
 `;

const titleFadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
 `;

export const subtitleFadeIn = keyframes`
  0% {
    opacity: 0;
  }
  35% {
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
  100% {
    opacity: 1;
  }
 `;

export const Container = styled.div`
    width: 610px;
    padding: 40px 32px 32px 40px;
    box-sizing: border-box;
    color: ${colorsPalettes.midnight[500]};
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: ${collapse} ease-in-out 500ms;
`;

export const Title = styled.div`
    font-size: 30px;
    font-weight: 500;
    animation: ${titleFadeIn} ease-in-out 350ms;
`;

export const Subtitle = styled.div`
    font-size: 14px;
    color: ${colorsPalettes.carbon[300]};
    margin-top: 15px;
    max-width: 534px;
    animation: ${subtitleFadeIn} ease-in-out 1000ms;
`;

export const MainWebsite = styled.div`
    text-align: left;
    height: 24px;
    font-size: 12px;
    color: rgba(42, 62, 82, 0.6);
    margin-top: 16px;
`;

export const FakeInputContainer = styled.div`
    .ListItemWebsite {
        height: 34px;
        margin-bottom: 2px;
    }
`;

export const SubDomainsText = styled(Subtitle)`
    text-align: right;
    font-size: 12px;
    margin-top: 6px;
    margin-bottom: 19px;
`;
SubDomainsText.displayName = "SubDomainsText";

export const Label = styled(SubDomainsText)`
    margin-bottom: 2px;
    text-align: left;
`;
Label.displayName = "Label";

export const ButtonContainer = styled.div`
    margin-top: 36px;
    text-align: right;
    text-transform: capitalize;
    animation: ${buttonFadeIn} ease-in-out 350ms;
    align-self: flex-end;
`;
ButtonContainer.displayName = "ButtonContainer";

export const ButtonsContainer = styled.div<{ showBackButton: boolean }>`
    display: flex;
    width: 100%;
    padding-top: 32px;
    justify-content: space-between;
    animation: ${buttonFadeIn} ease-in-out 350ms;
    ${({ showBackButton }) =>
        !showBackButton &&
        css`
            justify-content: flex-end;
        `}
`;
ButtonsContainer.displayName = "ButtonsContainer";

export const CountryContainerStyled = styled(CountryContainer)`
    margin-top: 0;
`;
CountryContainerStyled.displayName = "CountryContainerStyled";
