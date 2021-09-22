import { Injector } from "common/ioc/Injector";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import {
    FlexWithSpace,
    TableHeaderText,
    Text,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { i18nFilter, percentageFilter } from "filters/ngFilters";
import React from "react";
import {
    Bullet,
    SearchOverviewCompareDomainContainer,
    SearchOverviewTableRowContainerCompare,
    TrafficContainer,
    CompareCoreWebsiteCellContainer,
    SearchOverviewCompareContentWrapper,
    CompareTextCellContainer,
    ColumnHeaderText,
    SearchOverviewCompareColumnContainer,
} from "../SearchOverviewTraffic/StyledComponent";
import { CHART_COLORS } from "constants/ChartColors";

const EngineColumnHeaderKey = "search.overview.traffic.header.column.engine";
const TypeColumnHeaderKey = "search.overview.traffic.header.column.type";
const ColumnHeaderSize = 12;
const InnerLinkPage = "websites-worldwideOverview";
const TextAndIconMargin = "8px";

const TableRow = (row, index, isSearchByChannel, routingParams) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams, key: row.domain });
    return (
        <SearchOverviewTableRowContainerCompare key={index}>
            {row.Favicon ? (
                <CompareCoreWebsiteCellContainer>
                    <CoreWebsiteCell
                        icon={row.Favicon}
                        domain={row.Name}
                        internalLink={innerLink}
                        textAndIconMargin={TextAndIconMargin}
                        className="hide-external-link"
                    />
                </CompareCoreWebsiteCellContainer>
            ) : (
                <CompareTextCellContainer>
                    <div className={row.iconName} />
                    {row.Name}
                </CompareTextCellContainer>
            )}
            {row.sites.map((site) => RenderRowData(site.Value))}
        </SearchOverviewTableRowContainerCompare>
    );
};

const RenderColumnHeader = ({ domain, color }) => {
    return (
        <SearchOverviewCompareColumnContainer style={{ marginRight: "8px" }}>
            <Bullet color={color} />
            <ColumnHeaderText>{domain}</ColumnHeaderText>
        </SearchOverviewCompareColumnContainer>
    );
};

const RenderRowData = (value) => {
    return (
        <TrafficContainer style={{ marginRight: "10px" }}>
            <Text>{`${percentageFilter()(value, 2)}%`}</Text>
        </TrafficContainer>
    );
};

export const SearchOverviewTableComponentCompare = (props) => {
    const i18n = i18nFilter();
    const { searchOverviewTrafficData, routingParams } = props;
    const { searchOverviewTrafficList, searchName } = searchOverviewTrafficData;
    const isSearchByChannel = searchName === "SearchTrafficByChannel";
    const tableHeaderKey = isSearchByChannel ? TypeColumnHeaderKey : EngineColumnHeaderKey;
    return (
        <SearchOverviewCompareContentWrapper>
            <FlexWithSpace>
                <SearchOverviewCompareDomainContainer>
                    <TableHeaderText
                        style={{ alignSelf: "center", padding: "0 0 0 16px" }}
                        fontSize={ColumnHeaderSize}
                    >
                        {i18n(tableHeaderKey)}
                    </TableHeaderText>
                </SearchOverviewCompareDomainContainer>
                {searchOverviewTrafficList[0].sites.map(({ Domain }, index) =>
                    RenderColumnHeader({
                        domain: Domain,
                        color: CHART_COLORS.chartMainColors[index],
                    }),
                )}
            </FlexWithSpace>
            {searchOverviewTrafficList.map((row, index) =>
                TableRow(row, index, isSearchByChannel, routingParams),
            )}
        </SearchOverviewCompareContentWrapper>
    );
};
