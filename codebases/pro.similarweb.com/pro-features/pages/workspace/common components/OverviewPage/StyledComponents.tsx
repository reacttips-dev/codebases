import { colorsPalettes, rgba } from "@similarweb/styles";
import * as React from "react";
import styled from "styled-components";

import { TrendContainer } from "../../../../../app/components/React/Table/cells/TrendCell";
import { DefaultCellHeaderRightAlign } from "../../../../../app/components/React/Table/headerCells";
import { LeadGeneratorChangePercentageRightAlign } from "../../../../../app/pages/lead-generator/lead-generator-exist/components/StyledComponents";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import { StyledBox } from "../../../../styled components/Workspace/src/StyledWorkspaceBox";
import { IconButton } from "@similarweb/ui-components/dist/button";

export const EmptyWorkspaceContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const EmptyContentWrapper = styled.div`
    display: flex;
    margin-left: 40px;
    > svg {
        margin-top: 25px;
    }
`;

export const EmptyContentContainer = styled(FlexColumn)`
    max-width: 250px;
    margin-left: 50px;
`;

export const EmptyWorkspaceTitle = styled.span`
    font-size: 20px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
    margin: 16px 0 8px;
    margin-top: 28px;
    line-height: normal;
`;

export const EmptyWorkspaceSubtitle = styled.span`
    font-size: 14px;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    margin-bottom: 24px;
`;

export const OverviewTitle = styled.div`
    font-size: 24px;
    line-height: 24px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
    margin: 16px 0;
`;

export const OverviewSubtitle = styled.div<{ visible: boolean }>`
    font-size: 16px;
    color: ${colorsPalettes.carbon[500]};
    margin-bottom: 24px;
    opacity: ${(props) => (props.visible ? 1 : 0)};
    transition: all 0.1s;
`;

export const ListCardWrapper = styled(StyledBox)`
  display: flex;
  flex-direction: column;
  height: 298px;
  width: 368px;
  margin: 0 16px 16px 0;
  transition: background-color 200ms ease-in-out;
  cursor: pointer;
  :hover {
    box-shadow: 0 3px 6px ${rgba(colorsPalettes.midnight[600], 0.2)};
  }
}

`;

export const ListCardHeaderContainer = styled.div`
    margin: 16px 16px 8px;
`;

export const ListCardTableContainer = styled.div`
    height: 184px;
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
        height: 48px;
        font-size: 14px;
        line-height: 16px;
        border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    }
    .MiniFlexTable-container .MiniFlexTable-column .MiniFlexTable-headerCell {
        height: 32px;
        color: ${rgba(colorsPalettes.carbon[500], 0.6)};
        font-weight: 500;
        border-top: 1px solid ${colorsPalettes.carbon["50"]};
        border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    }
    ${TrendContainer} {
        width: 100%;
    }
    .changePercentage,
    ${LeadGeneratorChangePercentageRightAlign}, ${DefaultCellHeaderRightAlign} {
        width: 100%;
        padding-right: 12px;
    }
`;

export const ListCardButtonContainer = styled(FlexRow)`
    justify-content: flex-end;
    padding: 8px;
`;

export const SpaceBetween = styled(FlexRow)`
    justify-content: space-between;
    align-items: center;
`;

export const OverviewSectionTitle = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    margin-bottom: 8px;
`;

export const OverviewSectionDate = styled(OverviewSectionTitle)`
    font-weight: normal;
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    font-size: 14px;
`;

export const ListCardTitle = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
`;

export const ListHeaderWrapper = styled.div`
    display: flex;
    align-items: center;
`;

export const IconWrapper = styled(IconButton)`
    margin-top: -3px;
    margin-left: 4px;
    flex-shrink: 0;
`;

export const ListCardSubtitle = styled(FlexRow)`
    font-size: 12px;
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
`;

export const OverviewBoxesWrapper = styled.div`
    display: flex;
    margin: 24px 0 0;
    flex-wrap: wrap;
`;

export const OverviewNewListCard = styled(ListCardWrapper)`
    background-color: ${rgba(colorsPalettes.bluegrey[300], 0.25)};
    justify-content: center;
    align-items: center;
    transition: background 0.2s ease-in-out;
    box-shadow: none;
    &:hover {
        background-color: ${rgba(colorsPalettes.bluegrey[300], 0.4)};
        cursor: pointer;
        box-shadow: none;
    }
`;

export const OverviewPageWrapper = styled(FlexColumn)`
    flex-grow: 1;
    overflow: hidden;
    display: flex;
`;

export const OverviewPageContent = styled(FlexColumn)<{ showQuickLinks: boolean }>`
    padding: 24px;
    box-shadow: 0 -3px 6px ${rgba(colorsPalettes.carbon[500], 0.08)};
    z-index: 1;
    transform: ${(props) => (props.showQuickLinks ? "translateY(0)" : "translateY(-156px)")};
    top: 260px;
    background-color: #f5f9fd;
    transition: all 0.1s;
    flex-grow: 1;
`;

export const OverviewPageHeaderWrapper = styled(FlexColumn)`
    padding: 24px;
    background-color: ${colorsPalettes.carbon[0]};
    box-sizing: border-box;
`;

export const ListCardCountryIcon = styled.div`
    height: 12px;
    width: 12px;
    margin: 2px 4px 0 2px;
`;

export const ListCardBullet = styled.div.attrs({
    children: <span>•</span>,
} as any)`
    margin: 0 2px;
`;

export const CardListEmptyWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const CardListEmptyContainer = styled(FlexColumn)`
    align-items: center;
    width: 168px;
    img {
        width: 64px;
        height: 80px;
    }
    button {
        margin-top: 8px;
    }
`;

export const CardsListLoader = styled(FlexRow)`
    justify-content: center;
    flex-grow: 1;
    margin-top: 80px;
`;
