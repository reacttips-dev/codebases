import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";

export const StyledPill = styled.span`
    letter-spacing: 0.6px;
    border-radius: 10px;
    height: 10px;
    font-family: Roboto;
    font-size: 9px;
    font-weight: 500;
    background-color: ${colorsPalettes.carbon["200"]};
    color: ${colorsPalettes.carbon["0"]};
    text-transform: uppercase;
    padding: 4px 5px 3px 5px;
    line-height: 1;
`;
StyledPill.displayName = "StyledPill";
