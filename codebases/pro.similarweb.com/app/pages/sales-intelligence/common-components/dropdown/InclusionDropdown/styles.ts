import styled, { css } from "styled-components";
import { DropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledInclusionDDButton = styled.div<{ buttonWidth: number }>`
    width: ${({ buttonWidth }) => buttonWidth}px;

    .DropdownButton {
        background-color: ${colorsPalettes.carbon["0"]};
        border: 1px solid ${colorsPalettes.midnight["50"]};
        box-sizing: border-box;
        height: 40px;
        ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
    }

    .DropdownButton--triangle {
        color: ${colorsPalettes.carbon["400"]};
    }

    .DropdownButton--disabled {
        background-color: ${colorsPalettes.bluegrey["200"]};
        color: ${colorsPalettes.midnight["100"]};
        cursor: not-allowed;
        pointer-events: all;

        &:hover {
            box-shadow: none;
            border-color: ${colorsPalettes.midnight["50"]};
        }
    }
`;

export const StyledInclusionDDItem = styled(DropdownItem)`
    ${({ selected }) =>
        selected &&
        css`
            color: ${colorsPalettes.carbon["500"]};
        `};
    font-size: 14px;
    font-weight: 400;
`;
