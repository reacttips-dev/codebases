import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledSimilarSitesPanelTitle = styled.h2`
    ${mixins.setFont({ $size: 20, $color: colorsPalettes.carbon["0"], $weight: 400 })};
    font-size: 20px;
    letter-spacing: 0.3px;
    line-height: 32px;
    margin: 0;
`;

export const StyledSimilarSitesPanelHeader = styled.div`
    background-color: ${colorsPalettes.carbon["400"]};
    padding: 24px;
`;
