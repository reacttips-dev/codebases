import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledTooltipText = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon["0"], $size: 13, $weight: 400 })};
`;

export const StyledTooltipTitle = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon["0"], $size: 13, $weight: 700 })};
`;
