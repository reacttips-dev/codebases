import { colorsPalettes, mixins } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { TabPanel } from "@similarweb/ui-components/dist/tabs";
import { StyledBox } from "Arena/StyledComponents";
import { PillStyled } from "components/Pill/Pill";
import styled, { css } from "styled-components";
import { BenchmarkToArenaLegend } from "../../../../../.pro-features/components/Workspace/BenchmarkToArena/src/BenchmarkToArenaLegend";
import { SWReactTableWrapperBox } from "../../../../components/React/Table/SWReactTableWrapper";

export const MarketingWorkspacePageTitle = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $size: 24, $weight: 500 })};
    line-height: 24px;
    overflow: hidden;
`;

export const MarketingWorkspacePageTitleContainer = styled.div`
    ${MarketingWorkspacePageTitle} {
        margin-right: 12px;
    }
    margin: 0;
    display: flex;
    align-items: center;
    //flex: 0 0 auto;
`;

export const MarketingWorkspaceOverviewTitle = styled.span`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 1.5em;
`;
export const MarketingWorkspaceOverviewPageContainer = styled.div`
    ${SWReactTableWrapperBox} {
        border-radius: 0;
        box-shadow: none;
    }
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    .dashboard-loader-container {
        width: 100%;
        left: 0;
    }
`;

export const ScrollContainer = styled.div.attrs(() => ({
    className: "sw-layout-scrollable-element use-sticky-css-rendering",
}))`
    flex-grow: 1;
    overflow-x: auto;
`;

export const MarketingWorkspaceOverviewPageContentContainer = styled(ScrollContainer)<{
    isPdf: boolean;
}>`
    padding: 24px 24px;
    background-color: ${colorsPalettes.bluegrey["100"]};
    ${TabPanel} {
        max-width: ${({ isPdf }) => (isPdf ? 1275 : 1149)}px;
        margin: 0 auto;
    }
`;
export const MarketingWorkspacePageHeaderContainer = styled.div.attrs<{ isScroll?: boolean }>({
    className: "marketing-workspace-page-header-container",
})<{ isScroll?: boolean }>`
    height: 65px;
    background-color: ${colorsPalettes.carbon["0"]};
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    box-sizing: border-box;
    padding-left: 24px;
    flex: 0 0 auto;
    justify-content: space-between;
    position: relative;
    z-index: 2;
    box-shadow: ${({ isScroll }) =>
        isScroll ? `0px 4px 6px 0px rgba(202, 202, 202, 0.5)` : `none`};
`;
export const MarketingWorkspaceOverviewPageHeaderTopSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const MarketingWorkspaceOverviewPageHeaderPart = styled.div`
    width: 300px;
    flex: 0 0 50%;
    overflow: hidden;
`;

export const MarketingWorkspaceGroupPageContainer = styled(MarketingWorkspaceOverviewPageContainer)`
    display: block;
    height: 100%;
    padding: 0;
    background-color: ${colorsPalettes.carbon[0]};
    .swTable-scroll--left {
        left: 0px;
    }
    .swTable-scroll--right {
        right: 0px;
    }
`;
export const MarketingWorkspaceGroupFiltersRow = styled.div`
    display: flex;
    align-items: center;
    padding: 0 16px;
    &:first-of-type {
        margin-bottom: 8px;
    }
`;
export const MarketingWorkspaceFilterWrapper = styled.div`
    height: 40px;
    border: 1px solid ${colorsPalettes.carbon["50"]};
    .CountryFilter-dropdownButton,
    .DropdownButton-text,
    .WebSourceFilter-dropdownButton {
        ${mixins.setFont({ $size: 14, weight: 400, $color: colorsPalettes.midnight["500"] })};
        justify-content: stretch;
    }
    margin-right: 8px;
`;
export const MarketingWorkspaceSubdomainsFilterWrapper = styled(MarketingWorkspaceFilterWrapper)`
    align-items: center;
    display: flex;
    padding: 0 10px 0 12px;
    width: 180px;
    color: ${colorsPalettes.midnight["500"]};
    ${mixins.setFont({ $size: 14, weight: 400, $color: colorsPalettes.midnight["500"] })};
`;
export const MarketingOverviewWorkspaceGroupFiltersRow = styled(MarketingWorkspaceGroupFiltersRow)`
    display: flex;
    align-items: center;
    padding: 10px 0px 0px;
    margin-right: -8px;
    &:first-of-type {
        margin-bottom: 8px;
    }
`;
export const BoxMetricWrapper = styled.div`
    margin: 16px 20px;
    border: 1px solid #e5e7ea;
    border-radius: 6px;
`;
export const BoxAlertContainer = styled.div`
    margin-left: 20px;
    margin-right: 20px;
`;
export const BoxTableTitle = styled.div`
    font-size: 16px;
    line-height: 24px;
    margin: 16px;
    color: #2a3e52;
`;
export const WrapperContainer = styled.div`
    padding: 80px 24px 0;
`;
export const TabTitleNew = styled.span`
    display: flex;
    align-items: center;
    ${PillStyled} {
        margin-left: 10px;
        background-color: ${colorsPalettes.orange["400"]};
    }
`;
export const MarketingWorkspaceOverviewKWTableLegend = styled(BenchmarkToArenaLegend)`
    display: inline-flex;
    border: none;
    padding: 0;
    margin: 5px 0 0 0;
`;
const gutter = 18;
export const MarketingWorkspaceOverviewTablesContainer = styled.div`
    display: flex;
    flex-flow: column wrap;
    width: 100%;
    max-height: 1200px;
    & > ${StyledBox} {
        margin: 0 ${gutter}px ${gutter}px 0;
        width: calc(50% - ${gutter / 2}px);
    }
    .swReactTable-column:last-child {
        border: none;
    }
`;
export const MarketingWorkspaceOverviewTablesSubTitle = styled.h2`
    ${setFont({ $size: 16, $weight: 400 })};
    color: ${colorsPalettes.midnight["600"]};
`;

export const BenchmarkToArenaLegendStyled = styled(BenchmarkToArenaLegend)<any>`
    ${({ margin }) =>
        margin &&
        css`
            margin: 9px 24px;
        `};
    display: ${({ inline }) => (inline ? "inline-flex" : "flex")};
`;

export const SubscribeToArena = styled.div<{ step: string }>`
    background-color: ${colorsPalettes.carbon["25"]};
    padding: 9px 12px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${setFont({ $size: 14, $weight: 400 })};
    color: ${colorsPalettes.carbon["500"]};
    width: 520px;
`;

export const SubscribeToArenaSummary = styled(SubscribeToArena)`
    margin-top: 16px;
`;

export const SubscribeToArenaEdit = styled(SubscribeToArena)`
    margin-bottom: 15px;
`;
