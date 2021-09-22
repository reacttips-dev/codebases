import { colorsPalettes } from "@similarweb/styles";
import { Injector } from "common/ioc/Injector";
import { TrafficShareWithVisits } from "components/React/Table/cells";
import { TrafficShareWithTooltip } from "components/TrafficShare/src/TrafficShareWithTooltip";
import { CHART_COLORS } from "constants/ChartColors";
import {
    FlexWithSpace,
    TableHeaderText,
    Text,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { i18nFilter, percentageFilter } from "filters/ngFilters";
import React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    GroupTrafficShareContainer,
    SearchOverviewTopKeywordTableRowContainerCompare,
    TopKeywordCoreWebsiteCellContainer,
    TrafficShareContainer,
    SearchOverviewTopKeywordTrafficShareHeaderContainerCompare,
    SearchOverviewTopKeywordTrendHeaderCompareContainer,
    DomainCompareContainer,
    GroupWrapper,
} from "../SearchOverviewTraffic/StyledComponent";
import ColorStack from "components/colorsStack/ColorStack";

const DomainColumnHeaderKey = "search.overview.top.keyword.compare.header.keyword";
const SearchTrafficColumnHeaderKey = "search.overview.top.keyword.compare.header.traffic.share";
const VolumeColumnHeaderKey = "search.overview.top.keyword.compare.header.total.traffic.share";
const ColumnHeaderSize = 12;
const chartMainColors = new ColorStack(CHART_COLORS.chartMainColors);

const TableRow = (row, index, routingParams, sitesColor) => {
    const { SearchTerm: searchTerm, SiteOrigins: siteOrigins } = row;
    const swNavigator = Injector.get<any>("swNavigator");
    const InnerLinkPage = "keywordAnalysis_overview";
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams, keyword: searchTerm });
    const keywordClicked = () => {
        TrackWithGuidService.trackWithGuid(
            "search.overview.page.top.keywords.inner.link",
            "click",
            { keyword: searchTerm },
        );
    };
    const data = Object.keys(siteOrigins).map((key, value) => {
        const site = sitesColor.filter((site) => site.key === key);
        return {
            name: key,
            text: `${percentageFilter()(siteOrigins[key], 1)}%`,
            width: siteOrigins[key] * 100,
            color: colorsPalettes.carbon[0],
            backgroundColor: site[0].color,
        };
    });
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
        <SearchOverviewTopKeywordTableRowContainerCompare key={index}>
            <TopKeywordCoreWebsiteCellContainer>
                <Text>{renderLink()}</Text>
            </TopKeywordCoreWebsiteCellContainer>
            <TrafficShareContainer>
                <TrafficShareWithVisits row={row} value={row.TotalShare} />
            </TrafficShareContainer>
            <GroupWrapper>
                <GroupTrafficShareContainer>
                    <TrafficShareWithTooltip
                        data={data}
                        title={i18nFilter()(
                            "search.overview.compare.competitive.traffic.share.tooltip.title",
                        )}
                        trafficShareHeight={12}
                        minWidthToShowData={20}
                    />
                </GroupTrafficShareContainer>
            </GroupWrapper>
        </SearchOverviewTopKeywordTableRowContainerCompare>
    );
};

export const SearchOverviewTopKeywordTableComponentCompare = (props) => {
    chartMainColors.reset();
    const i18n = i18nFilter();
    const { searchOverviewTrafficData, routingParams, keys } = props;
    const splitKeys = keys.split(",");
    const sitesColor = [];
    for (let i = 0; i < splitKeys.length; i++) {
        sitesColor.push({
            key: splitKeys[i],
            color: chartMainColors.acquire(),
        });
    }
    return (
        <div>
            <FlexWithSpace>
                <DomainCompareContainer>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(DomainColumnHeaderKey)}
                    </TableHeaderText>
                </DomainCompareContainer>
                <SearchOverviewTopKeywordTrafficShareHeaderContainerCompare>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(VolumeColumnHeaderKey)}
                    </TableHeaderText>
                </SearchOverviewTopKeywordTrafficShareHeaderContainerCompare>
                <SearchOverviewTopKeywordTrendHeaderCompareContainer>
                    <TableHeaderText fontSize={ColumnHeaderSize}>
                        {i18n(SearchTrafficColumnHeaderKey)}
                    </TableHeaderText>
                </SearchOverviewTopKeywordTrendHeaderCompareContainer>
            </FlexWithSpace>
            {searchOverviewTrafficData.searchOverviewTrafficList.map((row, index) =>
                TableRow(row, index, routingParams, sitesColor),
            )}
        </div>
    );
};
