import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Box } from "@similarweb/ui-components/dist/box";
import { FlexWithSpace } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import React from "react";
import styled, { css } from "styled-components";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";

export const ButtonContainer = styled.div`
    height: 52px;
    width: 100%;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    text-align: end;
`;

export const SeeMoreContainer = styled.div`
    margin: 7px 8px 8px 0;
`;

export const ProgressCellContainer = styled.div`
    width: 46px;
    padding-top: 14px;
`;

export const SearchOverviewTopKeywordHeader = styled.div`
    display: grid;
    grid-template-columns: 54% 30% 17%;
    padding-right: 8px;
`;

export const SearchOverviewHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const VolumeContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const TrafficContainer = styled.div`
    display: flex;
    width: 132px;
`;

export const TrafficShareContainer = styled(FlexWithSpace)`
    height: 36px;
    width: 108px;
    font-size: 14px;
`;

export const GroupTrafficShareContainer = styled.div`
    width: 143px;
    margin-top: 13px;
`;

export const TrafficShareHeaderContainer = styled(FlexWithSpace)`
    width: 116px;
`;

export const SearchOverviewTopKeywordTrafficShareHeaderContainerSingle = styled.div`
    display: flex;
    justify-content: flex-end;
    height: 30px;
`;

export const SearchOverviewTopKeywordTrafficShareHeaderContainerCompare = styled(FlexWithSpace)`
    height: 30px;
    width: 135px;
`;

export const SearchOverviewCompareContentWrapper = styled.div`
    :before {
        content: "";
        position: absolute;
        top: 64px;
        left: 0;
        display: block;
        width: 100%;
        height: 1px;
        background-color: ${colorsPalettes.carbon[100]};
    }
`;

export const SearchOverviewCompareDomainContainer = styled.div`
    display: flex;
    height: 36px;
    width: 200px;
`;

export const SearchOverviewCompareColumnContainer = styled.div<{
    height?: string;
    width?: string;
    paddingTop?: string;
    paddingLeft?: string;
    alignItems?: string;
}>`
    display: flex;
    ${({ width = "135px" }) => `width:${width}`};
    ${({ height = "36px" }) => `height:${height}`};
    ${({ paddingLeft = "0px" }) => `padding-left:${paddingLeft}`};
    ${({ paddingTop = "0px" }) => `padding-top:${paddingTop}`};
    ${({ alignItems = "center" }) => `align-items:${alignItems}`};
`;

export const ColumnHeaderText = styled.div`
    width: 88%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const SearchOverviewTopKeywordTrendHeaderContainer = styled.div`
    display: flex;
    height: 30px;
`;

export const SearchOverviewTopKeywordTrendHeaderCompareContainer = styled(
    SearchOverviewTopKeywordTrendHeaderContainer,
)`
    width: 142px;
`;

export const DomainContainer = styled.div`
    height: 30px;
    display: flex;
    width: 236px;
    padding-left: 10px;
`;

export const DomainCompareContainer = styled(DomainContainer)`
    width: 150px;
`;

export const MetricContainer = styled(Box)<{ width?: string; height?: string }>`
    position: relative;
    ${({ width = "33.3%" }) => `width:${width}`};
    ${({ height = "auto" }) => `height:${height}`};
    background-color: white;
    overflow: hidden;
`;

export const AddToDashboardWrapper = styled.div`
    position: absolute;
    top: 3px;
    right: 2px;
    @media (max-width: 1365px) {
        top: 11px;
        right: 9px;
    }
`;

export const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px 16px 0 16px;
`;

export const TitleContainerCompare = styled.div`
    padding: 16px 24px 0 24px;
`;

export const TableContainer = styled.div<{ withPaddedRows?: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    ${({ withPaddedRows }) =>
        withPaddedRows &&
        css`
            padding: 0 24px 0 24px;
        `}
`;

export const TableRowContainer = styled(FlexWithSpace)`
    padding: 0 8px;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    height: 40px;
`;

export const SearchOverviewTopKeywordTableRowContainer = styled.div`
    padding: 0 8px;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    height: 40px;
    display: grid;
    grid-template-columns: 52% 32% 17%;
`;

export const SearchOverviewTopKeywordTableRowContainerCompare = styled(TableRowContainer)`
    display: grid;
    grid-template-columns: 35% 35% 30%;
`;

export const SearchOverviewTableRowContainerCompare = styled.div`
    display: flex;
    justify-content: space-between;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    height: 40px;
`;

export const CompareTextCellContainer = styled.div`
    width: 180px;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[300] })};
    font-style: italic;
    display: flex;
    align-items: center;
    padding-left: 16px;
`;

export const TopKeywordCoreWebsiteCellContainer = styled.div`
    display: flex;
    height: 40px;
    width: 70%;
`;

export const MaxWidthCoreWebsiteCellContainer = styled.div`
    display: flex;
    flex: 1;
    overflow: hidden;
`;

export const CompareCoreWebsiteCellContainer = styled.div`
    width: 180px;
    display: flex;
    padding-left: 16px;
`;

export const RightSideOfTitle = styled.div`
    display: flex;
    align-items: center;
`;

export const GroupWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const MetricTitleWithDropdownWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: auto;
    margin-bottom: auto;
    padding-bottom: 8px;
`;

export const TitleWithDropdownWrapper = styled.div`
    padding-right: 4px;
`;

export const DropdownWrapper = styled.div`
    margin-top: 2px;
`;

export const StyledItemIcon = styled(ItemIcon)`
    width: 24px;
    height: 24px;
    border-color: #d6dbe1;
    .ItemIcon-img {
        width: 18px;
        height: 18px;
    }
`;
export const StyledItemIconContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 6px;
`;

export const Bullet = styled.div<{ color: string }>`
    background-color: ${({ color }) => color};
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
`;
