import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const TAB_INNER_HEIGHT = 260;

export const StyledText = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.midnight["100"], $size: 16 })};
    line-height: 20px;
    margin-top: 7px;
    max-width: 180px;
    text-align: center;
`;

export const StyledEmptyTabContainer = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: ${TAB_INNER_HEIGHT}px;
    justify-content: center;

    & .SWReactIcons svg path {
        fill: ${colorsPalettes.midnight["100"]};
    }
`;
