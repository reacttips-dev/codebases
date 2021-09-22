import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const StyledButton = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.blue["400"], $size: 14 })};
    cursor: pointer;
    text-transform: capitalize;
`;

export const StyledText = styled.div`
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0px;
    text-align: center;
    color: ${colorsPalettes.carbon["500"]};
`;

export const StyledToggleButtonContainer = styled.div`
    align-items: center;
    display: flex;
    white-space: nowrap;
    justify-content: center;
    padding: 25px 0 21px 0;
`;
