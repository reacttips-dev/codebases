import { Injector } from "common/ioc/Injector";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import { ProgressBar } from "components/React/ProgressBar";
import {
    CoreWebsiteCellContainer,
    TableHeaderText,
    Text,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { i18nFilter, percentageFilter } from "filters/ngFilters";
import React from "react";
import {
    ProgressCellContainer,
    SearchOverviewHeaderContainer,
    TableRowContainer,
    DomainContainer,
    TrafficShareContainer,
    TrafficShareHeaderContainer,
    StyledItemIcon,
    StyledItemIconContainer,
} from "../SearchOverviewTraffic/StyledComponent";
import TrafficShare from "components/React/Table/FlexTable/cells/TrafficShare";
const DomainColumnHeaderKey = "analysis.competitors.search.organic.table.columns.domain.title";
const TrafficShareColumnHeaderKey =
    "analysis.competitors.search.organic.table.columns.traffic.share.title";
const ColumnHeaderSize = 12;
const InnerLinkPage = "websites-worldwideOverview";
const TextAndIconMargin = "8px";

const TableRow = (row, index, routingParams) => {
    const {
        Domain: domain,
        Favicon: favicon,
        Value: value,
        Name: name,
        SearchTerm: searchTerm,
    } = row;
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams, key: domain });
    return (
        <TableRowContainer key={index}>
            <CoreWebsiteCellContainer>
                {favicon ? (
                    <CoreWebsiteCell
                        icon={favicon}
                        domain={domain || searchTerm}
                        internalLink={innerLink}
                        textAndIconMargin={TextAndIconMargin}
                        className="hide-external-link"
                    />
                ) : (
                    <Text>{name}</Text>
                )}
            </CoreWebsiteCellContainer>
            <TrafficShare totalShare={value} />
        </TableRowContainer>
    );
};

export const SearchOverviewTrafficTableComponent = (props) => {
    const i18n = i18nFilter();
    const { searchOverviewTrafficData, routingParams } = props;
    return (
        <div>
            <SearchOverviewHeaderContainer>
                <DomainContainer>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(DomainColumnHeaderKey)}
                    </TableHeaderText>
                </DomainContainer>
                <TrafficShareHeaderContainer>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(TrafficShareColumnHeaderKey)}
                    </TableHeaderText>
                </TrafficShareHeaderContainer>
            </SearchOverviewHeaderContainer>
            {searchOverviewTrafficData.searchOverviewTrafficList.map((row, index) =>
                TableRow(row, index, routingParams),
            )}
        </div>
    );
};

const SearchEnginesTableRow = (row, index) => {
    const { Value: value, Name: name, Favicon: favicon } = row;
    const nameWithFirstChartUpperCase = name && name[0].toUpperCase() + name.substring(1);
    return (
        <TableRowContainer key={index}>
            <CoreWebsiteCellContainer>
                <StyledItemIconContainer>
                    <StyledItemIcon iconName={name} iconSrc={favicon} />
                </StyledItemIconContainer>
                <Text>{nameWithFirstChartUpperCase}</Text>
            </CoreWebsiteCellContainer>
            <TrafficShare totalShare={value} />
        </TableRowContainer>
    );
};

export const SearchOverviewTrafficTableForSearchEnginesComponent = (props) => {
    const i18n = i18nFilter();
    const { searchOverviewTrafficData } = props;
    const SEARCH_ENGINES_COLUMN_HEADER_KEY =
        "analysis.competitors.search.organic.table.columns.search.engines.title";
    return (
        <div>
            <SearchOverviewHeaderContainer>
                <DomainContainer>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(SEARCH_ENGINES_COLUMN_HEADER_KEY)}
                    </TableHeaderText>
                </DomainContainer>
                <TrafficShareHeaderContainer>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(TrafficShareColumnHeaderKey)}
                    </TableHeaderText>
                </TrafficShareHeaderContainer>
            </SearchOverviewHeaderContainer>
            {searchOverviewTrafficData.searchOverviewTrafficList.map((row, index) =>
                SearchEnginesTableRow(row, index),
            )}
        </div>
    );
};
