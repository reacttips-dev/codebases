import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const StyledSearchResultOnlyDesktopWarning = styled.div`
    align-items: center;
    background-color: ${rgba(colorsPalettes.carbon["500"], 0.06)};
    border-radius: 4px;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 8px;
    padding: 8px;
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14, $weight: 500 })};

    .SWReactIcons {
        margin-right: 4px;

        svg path {
            fill: ${colorsPalettes.carbon["500"]};
        }
    }
`;
