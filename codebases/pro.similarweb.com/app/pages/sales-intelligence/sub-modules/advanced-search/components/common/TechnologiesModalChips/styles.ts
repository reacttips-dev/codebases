import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledChipSeparator = styled.span`
    ${mixins.setFont({ $color: colorsPalettes.carbon["200"], $size: 14 })};
    margin-left: 12px;
    margin-right: 12px;
    text-transform: uppercase;
`;
