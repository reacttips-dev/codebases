import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const INPUT_MIN = 0;
export const INPUT_MAX = 500;
export const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, width: 424 },
};

export const StyledButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    margin-top: 20px;

    & > *:not(:first-child) {
        margin-left: 4px;
    }
`;

export const StyledPercentageSign = styled.span`
    font-size: 16px;
    margin-left: 8px;
`;

export const StyledChangeInputContainer = styled.div`
    margin-left: 8px;

    & > input[type="number"] {
        background-color: ${colorsPalettes.carbon["0"]};
        border: 1px solid ${colorsPalettes.navigation["NAV_BACKGROUND"]};
        border-radius: 3px;
        box-shadow: none;
        box-sizing: border-box;
        font-size: 14px;
        height: 34px;
        margin: 0;
        outline: 0;
        padding: 8px;
        width: 48px;
        -moz-appearance: textfield;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        &:hover,
        &:focus,
        &:invalid:focus {
            box-shadow: none;
            color: ${colorsPalettes.carbon["500"]};
        }

        &:focus {
            border-color: ${colorsPalettes.navigation["NAV_BACKGROUND"]};
        }
    }
`;

export const StyledSelectionPrefix = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 16 })};
    margin: 0 8px 0 0;
`;

export const StyledSelectionRow = styled.div`
    align-items: center;
    display: flex;
    margin-bottom: 12px;
    padding-left: 24px;
    padding-right: 24px;
`;

export const StyledModalTitle = styled.h3`
    ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 16, $weight: 500 })};
    line-height: 20px;
    margin: 24px 24px 28px;
`;

export const StyledModalContent = styled.div``;
