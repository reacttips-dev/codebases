import { Textfield } from "@similarweb/ui-components/dist/textfield";
import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles/";
import { Banner } from "@similarweb/ui-components/dist/banner";

export const ModalContentContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const HeaderTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 7px;
`;

export const HeaderTextfield = styled(Textfield)<{ isFocused: boolean; hasError: boolean }>`
    width: 270px;
    border-bottom: solid 2px ${colorsPalettes.midnight[50]};
    margin-bottom: 4px;

    ${({ hasError }) =>
        hasError &&
        css`
            border-bottom: solid 2px ${colorsPalettes.red["s100"]};
        `};

    ${({ isFocused }) =>
        isFocused &&
        css`
            border-bottom: solid 2px ${colorsPalettes.blue[500]};
        `};

    .input-container {
        padding-left: 0;
    }

    input {
        font-size: 24px;
        font-weight: 300;
    }
`;

export const HeaderErrorMessageContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 13px;
    align-items: center;

    .SWReactIcons path {
        fill: ${colorsPalettes.red["s100"]};
    }
`;

export const HeaderErrorMessage = styled.span`
    color: ${colorsPalettes.red["s100"]};
    margin-left: 3px;
`;

export const BannerText = styled.span`
    font-size: 14px;
    color: ${colorsPalettes.carbon[500]};
    font-weight: bold;
    margin-left: 12px;
`;

export const ModalBanner = styled(Banner)`
    height: 38px;
    padding: 0;
    margin-bottom: 25px;
`;

export const ModalButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 20px;
`;
