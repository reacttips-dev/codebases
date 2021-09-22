import styled from "styled-components";
import { colorsPalettes, fonts, mixins } from "@similarweb/styles";
import { StyledCommonTransitionedElement } from "../../styles";

export const PANEL_HEAD_TRANSITION_PREFIX = "filters-panel-head";

export const StyledHeadTitle = styled.h3`
    ${mixins.setFont({
        $size: 14,
        $weight: 500,
        $family: fonts.$dmSansFontFamily,
        $color: colorsPalettes.carbon["500"],
    })};
    line-height: 20px;
    margin: 0;
    text-transform: capitalize;
    user-select: none;
`;

export const StyledHeadTitleContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;

    & > .SWReactIcons {
        margin-right: 12px;

        & svg path {
            fill: ${colorsPalettes.carbon["500"]};
        }
    }
`;

export const StyledPanelHead = styled(StyledCommonTransitionedElement)`
    align-items: center;
    background-color: ${colorsPalettes.carbon["25"]};
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    display: flex;
    flex-shrink: 0;
    height: 50px;
    justify-content: space-between;
    padding: 0 16px;
`;
