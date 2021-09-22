import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Box } from "@similarweb/ui-components/dist/box";
import { TabList } from "@similarweb/ui-components/dist/tabs";
import { Tab } from "@similarweb/ui-components/dist/tabs/src/..";
import { ChartLoaderContainer } from "components/Loaders/src/ExpandedTableRowLoader/StyledComponents";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { Button } from "@similarweb/ui-components/dist/button";
import { Title } from "@similarweb/ui-components/dist/title";
import { LegendDivider } from "pages/website-analysis/audience-overlap/StyledComponents";

const maxMediaScreenSize = "1440px";

export const ButtonsContainer = styled.div`
    grid-column: 2;
    display: flex;
    justify-content: space-between;
    @media (max-width: ${maxMediaScreenSize}) {
        grid-column: 1;
    }
`;

export const CompareTabsStyle = styled(TabList)`
    margin-bottom: 16px;
`;

export const CompareTabStyle = styled(Tab)`
    ${setFont({ $size: 13 })};
    height: 48px;
    &.selected {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.blue[400]};
        }
    }
    &:hover {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon[500]};
        }
    }
`;

export const TabIconStyle = styled(SWReactIcons)`
    margin-right: 8px;
`;

export const SitesChartLoaderContainer: any = styled(ChartLoaderContainer)`
    width: 100%;
    box-sizing: border-box;
`;

export const StyledHeader: any = styled(FlexColumn)`
    height: 70px;
    padding-top: 24px;
    padding-left: 24px;
`;

export const FiltersRowContainer = styled(FlexRow)`
    justify-content: space-between;
    margin-bottom: 16px;
`;

export const FiltersRowStyle = styled.div`
    display: flex;
    align-items: center;
    > div {
        width: auto;
    }
`;

export const FiltersTitle = styled.div`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[400] })};
    margin-right: 12px;
`;

export const FilterItem = styled.div`
    // override inline style
    width: auto !important;
    display: inline-flex;
`;

export const ChartContainer = styled.div`
    box-sizing: border-box;
    padding: 0 14px 8px 14px;
    width: calc(100% - 240px);
`;

export const LegendsContainer = styled.div`
    padding-top: 8px;
    width: 240px;
    padding-right: 16px;
`;

export const StyledBox = styled(Box)`
    width: 100%;
    height: 554px;
`;

export const SearchOverviewGraphHeaderStyle = styled(FlexRow)<{ marginBottom: string }>`
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    height: 64px;
    box-sizing: border-box;
    ${({ marginBottom }) => `margin-bottom:${marginBottom}`}
`;

export const ChipDownContainer = styled.div`
    width: auto;
    display: inline-flex;
    margin-right: 8px;
`;

export const SearchOverviewGraphContainer = styled.div`
    background-color: white;

    .react-tabs ul {
        margin-bottom: 16px;
    }
`;

export const TabsContainer: any = styled.div`
    flex-grow: 1;
    flex-basis: 100%;
    .sitesVsCategory {
        text-transform: uppercase;
        padding-bottom: 9px;
        border-bottom: 1px solid ${colorsPalettes.carbon["100"]};
    }
`;

export const TabContentStyle = styled.div`
    padding: 0 16px;
    box-sizing: border-box;
    flex-grow: 1;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
`;

export const CtaWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    background-color: white;
`;

export const CtaButton = styled(Button)`
    margin: 6px;
`;

export const StyledHeaderTitle: any = styled(Title).attrs({
    "data-automation-box-title": true,
})`
    font-size: 20px;
    padding: 19px 24px;
    display: flex;
    align-items: center;
`;
StyledHeaderTitle.displayName = "StyledHeaderTitle";

export const UtilitiesContainer = styled.div`
    display: flex;
`;

export const MonthToDateToggleContainer = styled.div`
    align-self: center;
    padding: 2px 20px 0px 20px;
`;

export const UtilitiesContainerWrapper = styled.div`
    padding: 11px 20px;
`;

export const MMXAlertWrapper = styled.div`
    align-self: center;
    margin-top: 2px;
    margin-left: 2px;
`;

export const AllItemContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto;
`;

export const AllItemName = styled.div`
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
`;

export const AllItemValue = styled(AllItemName)`
    display: block;
    color: ${colorsPalettes.carbon[500]};
    text-align: end;
`;

export const IconsContainer = styled.div`
    padding-top: 3px;
    padding-left: 4px;
`;

export const LegendDividerWithMargin = styled(LegendDivider)`
    margin-bottom: 16px;
`;
