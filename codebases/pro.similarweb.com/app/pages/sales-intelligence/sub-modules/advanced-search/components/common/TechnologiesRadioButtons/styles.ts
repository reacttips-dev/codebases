import styled, { createGlobalStyle } from "styled-components";

export const GlobalExcludeTooltipStyles = createGlobalStyle`
    .PlainTooltip-element.exclude-radio-tooltip {
        z-index: 1121; // greater than ProModal z-index
    }
`;

export const StyledRadioSelection = styled.div`
    align-items: center;
    display: flex;
`;
