import styled, { css } from "styled-components";
import {
    SimpleDropdownItem,
    TextWrapper,
    NoBorderButton,
} from "@similarweb/ui-components/dist/dropdown";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledSelectorButton = styled(NoBorderButton)`
    ${({ disabled }) =>
        disabled &&
        css`
            pointer-events: all;
        `};
`;

export const StyledSelectorItem = styled(SimpleDropdownItem)`
    background-color: ${colorsPalettes.carbon["0"]};
    height: 44px;
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14, $weight: 400 })};

    &:hover {
        background-color: ${colorsPalettes.bluegrey["100"]};
    }

    &.DropdownItem--selected {
        background-color: ${colorsPalettes.bluegrey["100"]};
        ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14, $weight: 400 })};
    }

    & .DropdownItem--selected-check {
        display: none;
    }
`;

export const StyledOpportunityModeSelector = styled.div<{ disabled: boolean }>`
    position: relative;

    ${TextWrapper} {
        ${({ disabled }) =>
            !disabled &&
            css`
                color: ${colorsPalettes.carbon["500"]};
            `};
        font-size: 16px;
    }

    & .DropdownContent-container {
        background-color: ${colorsPalettes.carbon["0"]};
        padding: 8px 0;
    }
`;

export const StyledOpportunityModeSelectorContainer = styled.div`
    margin-left: 30px;
`;
