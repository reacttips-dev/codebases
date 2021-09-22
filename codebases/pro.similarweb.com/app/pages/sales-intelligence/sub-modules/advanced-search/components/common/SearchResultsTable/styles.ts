import styled, { css } from "styled-components";
import { colorsPalettes, fonts, mixins, rgba } from "@similarweb/styles";
import {
    FILTERS_PANEL_COLLAPSED_WIDTH,
    FILTERS_PANEL_LEFT_DISTANCE,
    FILTERS_PANEL_WIDTH,
} from "../../styles";

const CONTROLS_HEIGHT = 56;
const MULTI_SELECT_HEIGHT = 56;
const RESULTS_LEFT_DISTANCE = 16;
export const TABLE_LOADING_ROWS_NUMBER = 20;
export const TRANSITION_CLASSNAMES_PREFIX = "results-section";

const getWidthCalcRule = (width: number) => {
    return `calc(100% - ${width + RESULTS_LEFT_DISTANCE + FILTERS_PANEL_LEFT_DISTANCE}px)`;
};

const getTableHeightCalcRule = (isLoading: boolean) => {
    return `calc(100% - ${isLoading ? 0 : CONTROLS_HEIGHT + MULTI_SELECT_HEIGHT}px)`;
};

export const StyledTablePagination = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    display: flex;
    justify-content: flex-end;
    padding: 8px 0;
`;

export const StyledTableContainer = styled.div<{
    isLoading: boolean;
    isSelectionColumnVisible: boolean;
    selectionColumnWidth: number;
    domainColumnWidth: number;
}>`
    box-shadow: 0 3px 6px ${rgba(colorsPalettes.carbon["500"], 0.08)};
    height: ${({ isLoading }) => getTableHeightCalcRule(isLoading)};
    overflow-y: scroll;
    margin-right: 20px;

    .swReactTable-header-wrapper.css-sticky-header {
        top: 0;
    }

    .swTable-scroll.swTable-scroll--right {
        right: 0;
    }

    & > [class^="LoaderContainer"] {
        height: 100%;
    }

    & .swReactTableCell {
        &:hover {
            cursor: pointer;
        }

        &.selected {
            background-color: ${colorsPalettes.bluegrey["200"]};
        }
    }

    // Ugly handling of selection column visibility
    .swReactTable-pinned > {
        div:nth-child(1) {
            display: ${({ isSelectionColumnVisible }) =>
                isSelectionColumnVisible ? "block" : "none"};
        }
        div:nth-child(2) {
            flex-basis: ${({ isSelectionColumnVisible, domainColumnWidth, selectionColumnWidth }) =>
                isSelectionColumnVisible
                    ? domainColumnWidth
                    : domainColumnWidth + selectionColumnWidth}px !important;
        }
    }
    .swReactTable-wrapper {
        .swReactTable-pinned > {
            div:nth-child(1) {
                display: ${({ isSelectionColumnVisible }) =>
                    isSelectionColumnVisible ? "block" : "none"};
            }
            div:nth-child(2) {
                flex-basis: ${({
                    isSelectionColumnVisible,
                    domainColumnWidth,
                    selectionColumnWidth,
                }) =>
                    isSelectionColumnVisible
                        ? domainColumnWidth
                        : domainColumnWidth + selectionColumnWidth}px !important;
            }
        }
    }
`;

export const StyledResultsText = styled.span`
    font-size: 14px;
    font-weight: 400;
    text-transform: capitalize;
`;

export const StyledNumberOfResults = styled.h3`
    ${mixins.setFont({
        $size: 18,
        $weight: 500,
        $family: fonts.$dmSansFontFamily,
        $color: colorsPalettes.carbon["400"],
    })};
    line-height: 24px;
    margin: 0 0 0 20px;

    & > span {
        font-family: inherit;
    }
`;

export const StyledTableControlsContainer = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.bluegrey["100"]};
    border-top: 1px solid ${colorsPalettes.carbon["50"]};
    box-sizing: border-box;
    display: flex;
    height: ${CONTROLS_HEIGHT}px;
    justify-content: space-between;
`;

export const StyledTableTopSection = styled.div`
    box-shadow: 0 3px 6px ${rgba(colorsPalettes.carbon["500"], 0.08)};
    margin-right: 20px;
`;

export const StyledSearchResultsContainer = styled.div`
    height: 100%;
    max-height: 100%;
`;

export const StyledSearchResultsWrap = styled.div`
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    height: 100%;
    margin-left: ${RESULTS_LEFT_DISTANCE}px;
    width: ${getWidthCalcRule(FILTERS_PANEL_WIDTH)};
`;

export const StyledTransitionedSearchResultsWrap = styled(StyledSearchResultsWrap)<{
    classNamesPrefix: string;
}>`
    will-change: width;

    ${({ classNamesPrefix }) => css`
        &.${classNamesPrefix}-enter, &.${classNamesPrefix}-exit-done {
            width: ${getWidthCalcRule(FILTERS_PANEL_WIDTH)};
        }

        &.${classNamesPrefix}-enter-active {
            transition: width 300ms ease 200ms;
            width: ${getWidthCalcRule(FILTERS_PANEL_COLLAPSED_WIDTH)};
        }

        &.${classNamesPrefix}-exit, &.${classNamesPrefix}-enter-done {
            width: ${getWidthCalcRule(FILTERS_PANEL_COLLAPSED_WIDTH)};
        }

        &.${classNamesPrefix}-exit-active {
            transition: width 300ms ease;
            width: ${getWidthCalcRule(FILTERS_PANEL_WIDTH)};
        }
    `};
`;
