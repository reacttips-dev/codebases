import styled, { css } from "styled-components";
import { DropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledTrafficDropdownButton = styled.div`
    width: 188px;

    .DropdownButton {
        background-color: ${colorsPalettes.carbon["0"]};
        border: 1px solid #e9ebed;
        height: 40px;
        ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
    }

    .DropdownButton--triangle {
        color: ${colorsPalettes.carbon["200"]};
    }
`;

export const StyledTrafficTypeDropdownItem = styled(DropdownItem)`
    ${({ selected }) =>
        selected &&
        css`
            color: ${colorsPalettes.carbon["500"]};
        `};
    font-size: 14px;
    font-weight: 400;
`;
