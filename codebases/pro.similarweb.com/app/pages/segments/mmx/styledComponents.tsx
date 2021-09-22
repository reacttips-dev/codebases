import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import { Box } from "@similarweb/ui-components/dist/box";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { Title } from "@similarweb/ui-components/dist/title";
import { Tab } from "@similarweb/ui-components/dist/tabs";
import { setFont } from "@similarweb/styles/src/mixins";
import { ButtonLabel } from "@similarweb/ui-components/dist/button";

export const GroupMMXContainer = styled.div`
    padding: 40px;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    align-items: center;
`;

export const ExcelButtonContainer = styled.div`
    margin-left: 12px;
`;
ExcelButtonContainer.displayName = "ExcelButtonContainer";

export const BoxContainer = styled(Box)`
    width: 100%;
    max-width: 1368px;
    height: auto;
    border-radius: 6px;

    & + & {
        margin-top: 24px;
    }
`;
BoxContainer.displayName = "BoxContainer";

export const MMXCompareBoxContainer = styled(Box)`
    width: 100%;
    max-width: 1368px;
    height: auto;
    border-radius: 6px 6px 0 0;

    & + & {
        margin-top: 24px;
    }
`;
BoxContainer.displayName = "MMXCompareBoxContainer";

export const TitleContainer = styled(FlexRow)`
    box-sizing: border-box;
    padding: 24px 24px 12px 24px;
    justify-content: space-between;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
`;

export const StyledTitleContainer = styled(TitleContainer)`
    border-bottom: 0px;
`;

export const StyledTab = styled(Tab)`
    ${setFont({ $size: 13 })};
    height: 48px;
     &.selected {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.blue[400]};
        }
         &:hover {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.blue[400]};
        }
      }
    }
    &:hover {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon[500]};
        }
    }
 }
`;

export const StyledHeaderTitle = styled(Title)`
    font-size: 20px;
    padding: 0.2em 0;
    ${InfoIcon} {
        line-height: 1.55;
    }
`;
StyledHeaderTitle.displayName = "StyledHeaderTitle";

export const SectionContainer = styled(FlexColumn)<{ stretched: boolean }>`
    ${({ stretched = false }) => `
        padding: 12px ${stretched ? "0" : "24px"};
    
        & + & {
            padding-top: 0;
        }
    `}
`;

export const GraphSectionContainer = styled(FlexColumn)`
    margin-top: 20px;
    padding: 12px 24px;
`;

export const SectionLine = styled(FlexRow)`
    flex: auto;
    justify-content: space-between;
`;

export const MainValueContainer = styled.div`
    .mainValue {
        font-size: 20px;
        line-height: 24px;
        color: ${colorsPalettes.carbon["500"]};
    }

    .mainValueDesc {
        font-size: 14px;
        line-height: 18px;
        color: ${colorsPalettes.carbon["400"]};
    }
`;

export const SwitcherContainer = styled.div`
    .chartSwitcher {
        margin-right: 10px;
        &:last-child {
            margin-right: 0;
        }
    }
`;

export const NoDataGraphContainer: any = styled.div`
    display: flex;
    flex-direction: column;
    height: ${(props: any) => (props.height ? props.height + "px" : "auto")};
`;

export const ChartContainer = styled.div`
    width: 100%;
    min-height: 260px;
    padding: 10px 0px;
`;

export const MMXGroupChartContainer = styled.div`
    width: 100%;
    padding: 10px 0px;
    height: 420px;
`;

export const BarChartOverviewContainer = styled(ChartContainer)`
    // this was added for hiding the tooltip text when downloading the graph png.
    @media print {
        #custom-tooltip {
            display: none;
        }
    }
`;

export const SingleGraphContainer = styled.div`
    flex: auto;
    height: 280px;
    overflow: hidden;
`;
export const GroupGraphContainer = styled.div`
    flex: auto;
    height: 408px;
    overflow: hidden;
`;
export const SingleGraphLegendContainer = styled.div`
    min-width: 248px;
    flex: none;
`;

export const CompareGraphLegendContainer = styled.div`
    width: 248px;
    flex: none;
`;

export const SegmentLegendWrapper = styled.span`
    width: 100%;
`;

export const DropdownFilterContainer = styled.div`
    width: 245px;
    margin-bottom: 16px;
    .DropdownButton {
        background-color: transparent;
    }
    .DropdownButton-text {
        color: ${colorsPalettes.carbon["400"]};
    }
    .DropdownButton--opened {
        .DropdownButton-text {
            color: ${colorsPalettes.carbon["0"]};
        }
    }
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-self: flex-start;
`;

export const SegmentsBarChartStyles = createGlobalStyle`
    .chart-plot-point-value-container,
    .chart-label-value-container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .chart-plot-point-value {
        margin-right: 4px;
    }
    
    .chart-label-value {
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .PlainTooltip-container {
        .PlainTooltip-element {
            &.chart-tooltip {
                width: 180px;
                left: auto;
                right: -20px;

                &:before, &:after {
                    left: auto;
                    right: 20px;
                    margin-left: auto;
                    margin-right: -5px;
                }
            }
        }
    }
`;

export const ContentContainer: any = styled.div`
    box-sizing: border-box;
    display: flex;
    padding-top: 25px;
    flex-wrap: wrap;
`;
ContentContainer.displayName = "ContentContainer";

export const TopRow: any = styled(FlexRow)`
    align-items: center;
    & > ${SWReactIcons} {
        margin-right: 16px;
    }
    ${ButtonLabel} {
        text-transform: none;
        font-weight: 400;
    }
`;
TopRow.displayName = "TopRow";

export const DropdownContainer: any = styled.div`
    width: 230px;
    position: relative;
    .DropdownButton {
        background: ${colorsPalettes.carbon["0"]};
    }
    .DropdownButton--opened {
        background: ${colorsPalettes.blue["500"]};
        .DropdownButton-text {
            color: ${colorsPalettes.carbon["0"]};
        }
    }
    .DropdownButton-text {
        color: ${colorsPalettes.carbon["400"]};
    }
`;
DropdownContainer.displayName = "DropdownContainer";

export const LegendsContainer: any = styled.div`
    max-width: calc(100% - 360px);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    &:first-child {
        margin-left: 0px;
    }
`;
LegendsContainer.displayName = "LegendsContainer";

export const StyledLegendContainer: any = styled(LegendsContainer)`
    align-items: flex-start;
    margin-top: 10px;
`;
StyledLegendContainer.displayName = "StyledLegendContainer";

export const TabsContainer: any = styled.div`
    flex-grow: 1;
    flex-basis: 100%;
    .sitesVsCategory {
        text-transform: uppercase;
        padding-bottom: 9px;
        border-bottom: 1px solid ${colorsPalettes.carbon["100"]};
    }
`;
TabsContainer.displayName = "TabsContainer";

const padding = 24;
export const GraphContainer: any = styled.div`
    display: flex;
    flex-grow: 1;
    flex-basis: 100%;
    padding: 12px ${padding}px;
    flex-wrap: wrap;
    width: calc(100% - ${padding * 2}px);
`;
GraphContainer.displayName = "GraphContainer";

export const Bullet: any = styled.div`
    background-color: ${({ color }) => color};
    width: 9px;
    height: 9px;
    border-radius: 50%;
    margin-right: 8px;
    flex-shrink: 0;
`;
Bullet.displayName = "Bullet";

export const LegendContainer: any = styled.div`
    max-width: 140px;
`;
LegendContainer.displayName = "LegendContainer";

export const SegmentNameLabel: any = styled.div`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding-left: 26px;
`;
SegmentNameLabel.displayName = "SegmentNameLabel";

export const LabelOverflowHidden = styled.span`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 14px;
`;
LabelOverflowHidden.displayName = "LabelOverflowHidden";

export const LegendTitle: any = styled(FlexRow)`
    color: ${colorsPalettes.carbon[500]};
    font-size: 13px;
    align-items: baseline;
    margin-left: 10px;
`;
LegendTitle.displayName = "LegendTitle";

export const BenchmarkOvertimeContainer: any = styled.div`
    width: 100%;
    max-width: 1368px;
    margin-bottom: 20px;
`;
BenchmarkOvertimeContainer.displayName = "BenchmarkOvertimeContainer";

export const NoDataContainer: any = styled.div`
    margin: 24px auto;
`;
NoDataContainer.displayName = "NoDataContainer";

export const UtilitiesContainer = styled(FlexRow)`
    width: 100%;
    align-items: center;
`;
UtilitiesContainer.displayName = "UtilitiesContainer";

export const TableWrapper: any = styled(Box)<{ loading: boolean }>`
    pointer-events: ${({ loading }: any) => (loading ? "none" : "all")};
    width: 100%;
    max-width: 1368px;
    height: auto;
    border-radius: 0px 0px 6px 6px;
    display: block;
`;
TableWrapper.displayName = "TableWrapper";

export const SearchContainer = styled.div`
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    padding-bottom: 10px;
    padding-top: 10px;
    .SearchInput {
        height: 30px;
        background-color: ${colorsPalettes.carbon[0]};
        border: none;
        width: 100%;
        box-sizing: border-box;
        padding: 9px 2px 5px 50px;
        box-shadow: none;
        margin-bottom: 0px;
        :focus {
            box-shadow: none !important;
            border: none;
        }
    }
`;
SearchContainer.displayName = "SearchContainer";
