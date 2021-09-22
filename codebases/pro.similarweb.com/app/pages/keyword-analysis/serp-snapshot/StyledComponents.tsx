import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { RightAlignedCell } from "components/React/Table/cells/RankCell";
import { SWReactIcons } from "@similarweb/icons";
import { BooleanSearchWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";
import { AddToDashboardWrapper } from "components/React/AddToDashboard/AddToDashboardButton";
import { Pill } from "components/Pill/Pill";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { UrlCell } from "components/React/Table/cells";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const SERPSnapshotPageTableWrapper = styled.div`
    .serp-snapshot-table-cell {
        height: 52px;
        display: flex;
        align-items: center;
    }
    .serp-snapshot-table-cell.right-alignment {
        justify-content: flex-end;
    }
`;

export const SERPNoDataContainer = styled(FlexColumn)`
    margin-top: 100px;
`;

// enriched row component styles

export const TopSectionContainer = styled.div`
    display: flex;
    height: 52px;
    padding: 0 24px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
`;

export const HeaderTitle = styled.div`
    ${setFont({ $size: 14, $weight: 500, $color: colorsPalettes.carbon[500] })};
`;

export const CloseIconButton = styled(IconButton)`
    margin-left: 8px;
`;

export const DataGridContainer = styled.div`
    display: grid;
    grid-template-columns: 10% 10% 20% 60%;
    grid-template-rows: repeat(auto-fill, 40px);
`;

export const DataGridItem = styled(FlexRow)`
    display: flex;
    align-items: center;
    height: 40px;
    padding: 4px 24px;
    box-sizing: border-box;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

export const DataGridHeaderItem = styled(DataGridItem)``;

export const DataGridRightAlignedItem = styled(DataGridItem)`
    justify-content: flex-end;
`;

export const DataGridRightAlignedHeaderItem = styled(DataGridRightAlignedItem)``;

export const PageContainer = styled.div`
    height: auto;
    width: 300px;
    border: none;
`;

export const PositionChangeContainer = styled(RightAlignedCell)`
    display: flex;
    text-align: center;
    justify-content: flex-end;
`;
export const NewPosition = styled.span`
    color: ${colorsPalettes.green["s100"]};
`;

export const SERPSnapshotEnrichedRowComponentContainer = styled.div`
    & .css-sticky-header {
        z-index: 1051;
    }
`;
SERPSnapshotEnrichedRowComponentContainer.displayName = "SERPSnapshotEnrichedRowComponentContainer";

// table cell styles

export const FeatureRowDomainCellText = styled.span`
    font-style: italic;
    ${setFont({ $color: colorsPalettes.carbon[300], $size: 14 })};
    :hover {
        ${setFont({ $color: colorsPalettes.blue[400] })};
    }
`;

export const FeatureRowResultCellContainer = styled(FlexRow)`
    width: 100%;
    > :first-child {
        width: calc(100% - 135px);
    }
`;

export const FeatureRowResultCellLeftSideContainer = styled(FlexRow)``;

export const FeatureRowResultCellIcon = styled(SWReactIcons)`
    margin-right: 8px;
    //width: 14px;
    //height: 14px;
    svg {
        path {
            fill: ${colorsPalettes.carbon[400]};
        }
    }
`;

export const FeatureRowResultCellText = styled(FlexRow)`
    ${setFont({ $color: colorsPalettes.carbon[500], $size: 14 })};
`;

export const StyledEnrichButtonText = styled.div`
    ${setFont({
        $size: 10,
        $weight: 700,
        $color: colorsPalettes.carbon[0],
    })};
`;

export const StyledEnrichButton = styled(IconButton)`
    background: ${colorsPalettes.blue[400]};
    padding: 4px 8px 4px 4px;
    border-radius: 4px;
    border: 1px solid ${colorsPalettes.blue[400]};
    > .SWReactIcons > svg > path {
        fill: ${colorsPalettes.carbon[0]};
    }
`;

export const UrlTitle = styled.span`
    color: ${colorsPalettes.blue[400]};
`;

export const SERPSnapshotResultCellWrapper = styled(FlexColumn)`
    width: 100%;
`;

export const StyledUrlCell = styled.div`
    width: 100%;
    .url-cell-content {
        white-space: nowrap;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 300px;
    }
`;
// table top styles

export const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

export const SearchContainer = styled.div`
    padding: 10px 15px;
    justify-content: space-between;
    display: flex;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    ${BooleanSearchWrapper} {
        flex-grow: 1;
    }
    ${AddToDashboardWrapper} {
        display: flex;
        align-items: center;
    }
`;

export const DownloadExcelContainer = styled.a`
    margin: 0 24px 0 16px;
`;

// banner styles

export const BannerContainer = styled(FlexRow)`
    background-color: ${colorsPalettes.yellow[100]};
    height: 44px;
    border-radius: 4px;
    align-items: center;
    padding: 0 12px;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    margin-bottom: 24px;
`;

export const StyledPill = styled(Pill)`
    margin-right: 16px;
`;

// table top

export const SerpName = styled.div`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon["500"], $weight: 400 })};
`;
export const SerpCount = styled.div`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon["400"], $weight: 400 })};
`;
export const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 24px 0 0 24px;
    margin-bottom: 24px;
`;

export const SearchSerpContainer = styled.div`
    padding: 16px 24px 16px 24px;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
`;

export const Box = styled.div<{ isSelected?: boolean }>`
    display: flex;
    min-width: 202px;
    max-width: 202px;
    height: 56px;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    border: ${({ isSelected }) =>
        isSelected
            ? `1px solid ${colorsPalettes.sky[400]}`
            : `1px solid ${colorsPalettes.carbon[50]}`};
    box-sizing: border-box;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        box-shadow: 0px 3px 5px ${rgba(colorsPalettes.midnight[600], 0.12)};
    }
`;
export const BoxNotClickable = styled(Box)`
    border: 1px solid ${colorsPalettes.carbon[50]};
    cursor: default;
    &:hover {
        box-shadow: none;
    }
`;

export const SWReactTableOptimizedStyled = styled.div`
    width: 100%;
    border: 1px solid ${colorsPalettes.sky[400]};
    border-radius: 6px;
    & .flex-table {
        height: 240px;
    }
`;

export const SerpWidgetTableTitleContainer = styled.div`
    padding: 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
`;
export const SERPWidgetCloseIconButton = styled(IconButton)`
    position: absolute;
    right: 12px;
    top: 14px;
`;
export const SerpWidgetTableTitleText = styled.div`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon["400"], $weight: 500 })};
`;

export const SerpWidgetTitleText = styled(SerpWidgetTableTitleText)`
    margin-bottom: 16px;
`;
export const WidgetTableWrapper = styled.div`
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    padding-bottom: 16px;
`;

export const NoDataTitle = styled.div`
    ${setFont({ $size: 16, $weight: 500, $color: colorsPalettes.carbon[500] })};
    line-height: 20px;
`;
export const NoDataSubTitle = styled.div`
    ${setFont({ $size: 12, $weight: 400, $color: colorsPalettes.carbon[500] })};
    line-height: 20px;
`;

export const PixelPlaceholderLoaderStyled = styled(PixelPlaceholderLoader)`
    padding-right: 16px;
`;

export const Grid = styled.div`
    display: grid;
    grid-column-gap: 12px;
    grid-row-gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-auto-flow: dense;
`;

export const ArrowIcon = styled.div`
    position: absolute;
    left: 104px;
`;
