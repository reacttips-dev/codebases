import styled, { css } from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { DropdownItem } from "@similarweb/ui-components/dist/dropdown";

export const DD_WIDTH = 254;

export const StyledDDItem = styled(DropdownItem)`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14, $weight: 400 })};
    background-color: ${colorsPalettes.carbon["0"]};

    &:hover {
        background-color: ${rgba(colorsPalettes.carbon["500"], 0.05)};
    }

    ${({ selected }) =>
        selected &&
        css`
            color: ${colorsPalettes.carbon["500"]};
            background-color: ${colorsPalettes.bluegrey["100"]};
        `};
`;

export const StyledDDContainer = styled.div``;
