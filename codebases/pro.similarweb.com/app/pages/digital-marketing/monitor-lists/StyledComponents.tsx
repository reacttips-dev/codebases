import { colorsPalettes, rgba } from "@similarweb/styles";
import { FlexWithSpace } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import React from "react";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box/src/Box";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import { DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";

export const ProgressCellContainer = styled.div`
    width: 46px;
`;

export const KeywordGroupColumnsHeader = styled.div`
    display: grid;
    grid-template-columns: 44% 32% 24%;
`;

export const ChangeContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

export const ChangeTextContainer = styled.span`
    font-size: 14px;
`;

export const TrafficContainer = styled.div`
    display: flex;
    width: 110px;
    padding-left: 30px;
`;

export const TrafficShareContainer = styled(FlexWithSpace)`
    height: 40px;
    width: 80%;
    font-size: 14px;
    align-items: center;
`;

export const ChangeHeaderContainer = styled.div`
    display: flex;
    justify-content: center;
    height: 30px;
    padding-right: 16px;
`;

export const TrafficShareHeaderContainer = styled.div`
    display: flex;
    height: 30px;
`;

export const SearchTermHeaderContainer = styled.div`
    height: 30px;
    display: flex;
    padding-left: 16px;
`;

export const KeywordGroupTableRowContainer = styled.div`
    padding: 0 16px;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    height: 40px;
    display: grid;
    grid-template-columns: 42% 36% 22%;
`;

export const KeywordGroupCoreWebsiteCellContainer = styled.div`
    display: flex;
    height: 40px;
`;

export const MenuItemsWrapper = styled(FlexColumn)`
    height: 100%;
`;

export const MenuItem = styled(FlexRow)<{ hasAllMenuItems?: boolean }>`
    height: ${({ hasAllMenuItems }) => (hasAllMenuItems ? "33%" : "50%")};
    padding-left: 16px;
    &:hover {
        background-color: ${colorsPalettes.carbon[50]};
        cursor: pointer;
    }
`;

export const MenuItemText = styled.div`
    font-size: 14px;
    margin-left: 8px;
    color: ${colorsPalettes.carbon[500]};
`;

export const NoGroupsContainer = styled.div`
    width: 100%;
    max-width: 952px;
    min-width: 788px;
    height: 277px;
    border: 1px solid ${colorsPalettes.carbon[100]};
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const NoGroupsImage = styled.div`
    width: 80px;
    height: 72px;
`;

export const NoGroupsTitle = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
    margin: 16px 0 4px 0;
`;

export const NoGroupsDescription = styled.div`
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    width: 262px;
    color: ${colorsPalettes.carbon[500]};
`;

export const StartPageWrapper = styled(FlexColumn)`
    padding: 88px 96px 0;
`;

export const StartPageContentWrapper = styled(FlexColumn)`
    max-width: 952px;
    min-width: 788px;
    width: 100%;
`;

export const StartPageTitleSection = styled(FlexRow)`
    margin-bottom: 16px;
    position: relative;
`;

export const StartPageTitle = styled.span`
    font-size: 20px;
    font-weight: 500;
    flex: 1 0 auto;
`;

export const ListWrapper = styled(Box)`
    min-width: 382px;
    max-width: 48%;
    flex: 1;
    margin-bottom: 20px;
    position: relative;
    :nth-child(odd) {
        margin-right: 24px;
    }
`;

export const ListHeaderWrapper = styled(FlexRow)`
    height: 72px;
    box-sizing: border-box;
    padding: 16px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

export const ListContentWrapper = styled.div`
    height: 154px;
    .MiniFlexTable {
        padding-bottom: 0;
    }
    && {
        .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-headerCell,
        .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-cell {
            display: flex;
            align-items: center;
            padding: 0 0 0 12px;
            box-sizing: border-box;
        }
    }
    .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-cell {
        height: 40px;
        font-size: 14px;
        line-height: 16px;
        border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    }
    .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-cell.outgoingTraffic-cell {
        justify-content: flex-end;
        padding-right: 12px;
    }
    .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-cell:last-child {
        border-bottom: initial;
    }
    .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-headerCell {
        height: 32px;
        font-size: 12px;
        color: ${colorsPalettes.carbon[300]};
        font-weight: 500;
        border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    }
    .changePercentage,
    ${DefaultCellHeaderRightAlign} {
        width: 100%;
        padding-right: 12px;
    }
`;

export const ListFooterWrapper = styled(FlexRow)`
    height: 48px;
    box-sizing: border-box;
    padding: 8px 16px;
    border-top: 1px solid ${colorsPalettes.carbon[50]};
`;
