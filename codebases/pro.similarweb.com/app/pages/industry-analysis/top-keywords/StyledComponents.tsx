import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Text } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { Box } from "@similarweb/ui-components/dist/box";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import { TabList } from "@similarweb/ui-components/dist/tabs";
import { NavLabelOrange } from "@similarweb/ui-components/dist/side-nav/src/components/NavLabel";

export const CardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export const TableContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 24px 0 24px;
`;

export const PieChartContainer = styled.div`
    height: calc(100% - 54px);
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding: 0 24px 0 24px;
    overflow: hidden;
`;

export const LegendsContainer = styled.div`
    overflow: hidden;
`;

export const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px 16px 12px 16px;
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

export const TopKeywordCoreWebsiteCellContainer = styled.div`
    display: flex;
    height: 40px;
    width: 70%;
`;

const FlexWithSpace = styled.div<{
    width?: string;
    height?: string;
    paddingBottom?: string;
    paddingTop?: string;
}>`
    display: flex;
    justify-content: space-between;
    ${({ width }) => width && `width: ${width}`};
    ${({ height }) => height && `height:${height}`};
    ${({ paddingBottom }) => paddingBottom && `padding-bottom:${paddingBottom}`};
    ${({ paddingTop }) => paddingTop && `padding-top:${paddingTop}`};
`;

export const TableHeaderText = styled(Text)`
    margin: 0;
    align-self: flex-end;
    padding-bottom: 4px;
`;

export const TableRowContainer = styled(FlexWithSpace)`
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    height: 40px;
`;

export const CoreWebsiteCellContainer = styled.div`
    width: 200px;
    overflow: hidden;
    display: flex;
`;

export const MetricContainer = styled(Box)<{ width?: string; height?: string }>`
    position: relative;
    ${({ width = "33.3%" }) => `width:${width}`};
    ${({ height = "auto" }) => `height:${height}`};
    background-color: white;
    overflow: hidden;
    margin-bottom: 48px;
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

export const TableWrap = styled.div`
    ${TabList} {
        height: auto;
        background-color: ${colorsPalettes.carbon["0"]};
        box-shadow: 0px 3px 6px 0px rgba(14, 30, 62, 0.08);
        border-radius: 6px;
    }
`;

export const TableTopSearchRowContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
`;

export const LastItemsWrapper = styled.div`
    display: flex;
    flex-wrap: nowrap;
    > * {
        display: flex;
        justify-content: center;
        margin: 5px 4px;
        height: 32px;
    }
`;

export const FiltersContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding: 5px 15px;
    border-bottom: 1px solid ${colorsPalettes.midnight["50"]};
    > *:not(${LastItemsWrapper}) {
        display: flex;
        justify-content: center;
        margin: 5px 4px;
        height: 32px;
    }
`;

export const NavLabelOrangeStyled = styled(NavLabelOrange)`
    margin-left: 12px;
`;

export const DownloadExcelContainer = styled.a`
    margin-right: 8px;
`;
