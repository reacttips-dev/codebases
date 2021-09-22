import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Textfield } from "@similarweb/ui-components/dist/textfield";

export const InputContainer = styled.div<{ isFocused: boolean; hasError: boolean }>`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .SWReactIcons {
        svg {
            path {
                ${({ hasError }) =>
                    hasError &&
                    `
                        fill: ${colorsPalettes.red["s100"]};
                    `};

                ${({ isFocused, hasError }) =>
                    isFocused &&
                    !hasError &&
                    `
                        fill: ${colorsPalettes.blue[400]};
                    `};
                fill-opacity: 1;
            }
        }
    }
    margin-bottom: 40px;
    ${({ hasError }) =>
        hasError &&
        `margin-bottom: 4px;
    `};
`;

export const TrackerNameTextfield = styled(Textfield)<{ isFocused: boolean; hasError: boolean }>`
    width: 100%;
    border-bottom: solid 2px ${colorsPalettes.midnight[50]};
    margin-bottom: 4px;

    ${({ hasError }) =>
        hasError &&
        `
            border-bottom: solid 2px ${colorsPalettes.red["s100"]};
        `};

    ${({ isFocused, hasError }) =>
        isFocused &&
        !hasError &&
        `
            border-bottom: solid 2px ${colorsPalettes.blue[500]};
        `};

    .input-container {
        padding-left: 0;
        padding-right: 0;
    }

    input {
        font-size: 24px;
        font-weight: 400;
    }
`;

export const ErrorMessageContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
    align-items: center;

    .SWReactIcons path {
        fill: ${colorsPalettes.red["s100"]};
    }
`;

export const ErrorMessage = styled.span`
    color: ${colorsPalettes.red["s100"]};
    margin-left: 3px;
`;
