import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { ButtonLabel } from "@similarweb/ui-components/dist/button";
import { Title } from "@similarweb/ui-components/dist/title";
import * as React from "react";
import styled from "styled-components";
import { InfoIcon } from "../../../../components/BoxTitle/src/BoxTitle";
import { ChartLoaderContainer } from "../../../../components/Loaders/src/ExpandedTableRowLoader/StyledComponents";
import { FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import { SegmentTypeBadge } from "pages/segments/StyledComponents";

export const SitesChartLoaderContainer: any = styled(ChartLoaderContainer)`
    width: 100%;
    box-sizing: border-box;
`;
SitesChartLoaderContainer.displayName = "SitesChartLoaderContainer";

export const StyledHeaderTitle: any = styled(Title).attrs({
    "data-automation-box-title": true,
})`
    font-size: 20px;
    ${InfoIcon} {
        line-height: 1;
    }
`;
StyledHeaderTitle.displayName = "StyledHeaderTitle";

export const TitleContainer: any = styled(FlexRow)`
    box-sizing: border-box;
    padding: 24px 24px 0 24px;
    justify-content: space-between;
`;
TitleContainer.displayName = "TitleContainer";

export const ContentContainer: any = styled.div`
    box-sizing: border-box;
    display: flex;
    padding-top: 25px;
    flex-wrap: wrap;
`;
ContentContainer.displayName = "ContentContainer";

export const ChartContainer: any = styled.div`
    box-sizing: border-box;
    padding-top: 20px;
    width: 100%;
    height: 330px;
`;
ChartContainer.displayName = "ChartContainer";

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
`;
StyledLegendContainer.displayName = "StyledLegendContainer";

export const TabsContainer: any = styled.div`
    flex-grow: 1;
    flex-basis: 100%;
    .SegmentsVsGroup {
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

export const BoxContainer: any = styled(Box)`
    width: 100%;
    max-width: 1368px;
    height: auto;
    border-radius: 6px 6px 0px 0px;
`;
BoxContainer.displayName = "BoxContainer";

export const ExcelButtonContainer = styled.div`
    margin-left: 12px;
`;
ExcelButtonContainer.displayName = "ExcelButtonContainer";

export const Bullet: any = styled.div`
    background-color: ${({ color }) => color};
    width: 9px;
    height: 9px;
    border-radius: 50%;
    margin-right: 8px;
    flex-shrink: 0;
`;
Bullet.displayName = "Bullet";

export const LegendContainer: any = styled.div<any>`
    max-width: 140px;
    margin-top: 10px;
    ${({ isDisabled }) =>
        isDisabled
            ? `
    opacity: 0.5;
    & > * {
      pointer-events: none;
    }
  `
            : ""}
`;
LegendContainer.displayName = "LegendContainer";

export const SegmentNameLabel: any = styled.div`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-left: 26px;
    color: ${colorsPalettes.carbon["400"]};
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

export const IndustryAverageCheckboxContainer = styled.div`
    margin: 0 16px;
    label {
        white-space: nowrap;
    }
`;
IndustryAverageCheckboxContainer.displayName = "IndustryAverageCheckboxContainer";

export const RightUtilsContainer = styled(FlexRow)`
    align-items: center;
    margin-left: auto;
`;
RightUtilsContainer.displayName = "RightUtilsContainer";

export const TooltipSegmentTypeBadge = styled(SegmentTypeBadge)`
    padding: 4px 4px 2px;
`;
