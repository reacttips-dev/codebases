import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledEditButtonContainer = styled.div`
    margin-left: 16px;

    & .SWReactIcons svg path {
        fill: ${colorsPalettes.carbon["200"]};
        fill-opacity: 1;
    }

    & button:hover .SWReactIcons svg path {
        fill: ${colorsPalettes.carbon["200"]};
    }
`;

export const StyledCountriesSeparator = styled.span`
    text-transform: uppercase;
`;

export const StyledCountryWithSeparator = styled.span`
    ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12 })};
`;

export const StyledCountryName = styled.span`
    ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12, $weight: 700 })};
`;

export const StyledValueContainer = styled.div`
    align-items: center;
    display: flex;
    flex-wrap: wrap;
`;

export const StyledInnerContainer = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.bluegrey["100"]};
    border-radius: 6px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 2px 8px 2px 12px;
`;
