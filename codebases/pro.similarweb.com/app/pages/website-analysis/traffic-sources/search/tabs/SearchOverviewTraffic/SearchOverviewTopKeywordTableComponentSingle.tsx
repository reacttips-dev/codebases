import { Injector } from "common/ioc/Injector";
import { TrafficShareWithVisits } from "components/React/Table/cells";
import {
    TableHeaderText,
    Text,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { i18nFilter, swPositionFilter } from "filters/ngFilters";
import React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    SearchOverviewTopKeywordTableRowContainer,
    DomainContainer,
    SearchOverviewTopKeywordTrafficShareHeaderContainerSingle,
    SearchOverviewTopKeywordTrendHeaderContainer,
    TopKeywordCoreWebsiteCellContainer,
    TrafficShareContainer,
    SearchOverviewTopKeywordHeader,
    VolumeContainer,
    StyledItemIconContainer,
    MaxWidthCoreWebsiteCellContainer,
    SearchOverviewHeaderContainer,
    TrafficShareHeaderContainer,
    TableRowContainer,
} from "../SearchOverviewTraffic/StyledComponent";
import { StyledItemIcon } from "components/core cells/src/CoreRecentCell/StyledComponents";
import { KeywordCompetitorsAffinityCell } from "components/React/Table/cells/KeywordCompetitorsAffinityCell";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

const DomainColumnHeaderKey = "search.overview.traffic.topKeywordsTable.column.header.keyword";
const SearchTrafficColumnHeaderKey =
    "search.overview.traffic.topKeywordsTable.column.header.searchTraffic";
const VolumeColumnHeaderKey = "search.overview.traffic.topKeywordsTable.column.header.volume";
const ColumnHeaderSize = 12;

const TopKeywordTableRow = (row, index, routingParams) => {
    const { SearchTerm: searchTerm, KwVolume: kwVolume } = row;
    const swNavigator = Injector.get<any>("swNavigator");
    const InnerLinkPage = "keywordAnalysis-overview";
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams, keyword: searchTerm });
    const keywordClicked = () => {
        TrackWithGuidService.trackWithGuid(
            "search.overview.page.top.keywords.inner.link",
            "click",
            { keyword: searchTerm },
        );
    };
    const renderLink = () => {
        if (swNavigator.current().name.match(/accountreview_/)) {
            return <span>{searchTerm}</span>;
        }

        return (
            <a href={innerLink} onClick={keywordClicked}>
                {searchTerm}
            </a>
        );
    };
    return (
        <SearchOverviewTopKeywordTableRowContainer key={index}>
            <TopKeywordCoreWebsiteCellContainer>
                <Text>{renderLink()}</Text>
            </TopKeywordCoreWebsiteCellContainer>
            <TrafficShareContainer>
                <TrafficShareWithVisits row={row} value={row.TotalShare} />
            </TrafficShareContainer>
            <VolumeContainer>
                <Text>{swPositionFilter()(kwVolume)}</Text>
            </VolumeContainer>
        </SearchOverviewTopKeywordTableRowContainer>
    );
};

const OrganicCompetitorsTableRow = ({ Domain, Favicon, Affinity }, index) => {
    return (
        <TableRowContainer key={index}>
            <MaxWidthCoreWebsiteCellContainer>
                <StyledItemIconContainer>
                    <StyledItemIcon iconSrc={Favicon} />
                </StyledItemIconContainer>
                <Text>{Domain}</Text>
            </MaxWidthCoreWebsiteCellContainer>
            <KeywordCompetitorsAffinityCell value={Affinity} />
        </TableRowContainer>
    );
};

export const SearchOverviewTopKeywordTableComponentSingle = (props) => {
    const i18n = i18nFilter();
    const { searchOverviewTrafficData, routingParams } = props;
    return (
        <div>
            <SearchOverviewTopKeywordHeader>
                <DomainContainer>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(DomainColumnHeaderKey)}
                    </TableHeaderText>
                </DomainContainer>
                <SearchOverviewTopKeywordTrendHeaderContainer>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(SearchTrafficColumnHeaderKey)}
                    </TableHeaderText>
                </SearchOverviewTopKeywordTrendHeaderContainer>
                <SearchOverviewTopKeywordTrafficShareHeaderContainerSingle>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(VolumeColumnHeaderKey)}
                    </TableHeaderText>
                </SearchOverviewTopKeywordTrafficShareHeaderContainerSingle>
            </SearchOverviewTopKeywordHeader>
            {searchOverviewTrafficData.searchOverviewTrafficList.map((row, index) =>
                TopKeywordTableRow(row, index, routingParams),
            )}
        </div>
    );
};

export const SearchOverviewOrganicCompetitors = ({ searchOverviewTrafficData }) => {
    const i18n = i18nFilter();

    const domainTitle = i18n("analysis.competitors.search.organic.table.columns.domain.title");
    const searchOverlapTooltip = i18n(
        "analysis.competitors.search.organic.table.columns.affinity.last.three.months.tooltip",
    );
    const searchOverlapTooltipTitle = i18n(
        "analysis.competitors.search.organic.table.columns.affinity.title",
    );
    const overlapScoreTitle = i18n(
        "analysis.competitors.search.organic.table.columns.affinity.title",
    );

    return (
        <div>
            <SearchOverviewHeaderContainer>
                <DomainContainer>
                    <TableHeaderText fontSize={ColumnHeaderSize}>{domainTitle}</TableHeaderText>
                </DomainContainer>
                <TrafficShareHeaderContainer>
                    <PlainTooltip
                        tooltipContent={
                            <div className="u-flex-column">
                                <span className="u-bold">{searchOverlapTooltipTitle}</span>
                                <span>{searchOverlapTooltip}</span>
                            </div>
                        }
                    >
                        <TableHeaderText fontSize={ColumnHeaderSize}>
                            {overlapScoreTitle}
                        </TableHeaderText>
                    </PlainTooltip>
                </TrafficShareHeaderContainer>
            </SearchOverviewHeaderContainer>
            {searchOverviewTrafficData.searchOverviewTrafficList.map(OrganicCompetitorsTableRow)}
        </div>
    );
};
