import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { FiltersMenuStyle } from "components/React/FiltersBar/FiltersMenu";

export const StyledSubNavBase = styled.div<{
    hasBoth: boolean;
    withTopBorder?: boolean;
    withBottomBorder?: boolean;
}>`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    border-bottom: 1px solid ${colorsPalettes.navigation["BORDER_DARK_1"]};
    border-top: 1px solid ${colorsPalettes.navigation["BORDER_DARK_1"]};
    display: flex;
    height: 60px;
    justify-content: ${({ hasBoth }) => (hasBoth ? "space-between" : "flex-end")};

    ${FiltersMenuStyle} {
        display: none;
    }
`;
