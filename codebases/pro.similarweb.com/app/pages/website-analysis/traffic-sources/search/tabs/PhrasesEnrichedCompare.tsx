import { IconButton } from "@similarweb/ui-components/dist/button";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import Chart from "components/Chart/src/Chart";
import { CellKeywordPhrase, GroupTrafficShare, TrafficShare } from "components/React/Table/cells";
import { CHART_COLORS } from "constants/ChartColors";
import { i18nFilter } from "filters/ngFilters";
import { getOverTimeChartConfigCompare } from "pages/website-analysis/incoming-traffic/commonOverTime";

import {
    CloseIconButton,
    PhrasesOverTimeCompareShareWrap,
    PhrasesOverTimeIndex,
    PhrasesOverTimeWebSiteWrap,
    TrafficOverTime,
    TrafficOverTimeChangeWrapShare,
    TrafficOverTimeChart,
    TrafficOverTimeChartTitle,
    TrafficOverTimeLeft,
    TrafficOverTimeTitle,
} from "pages/website-analysis/incoming-traffic/StyledComponents";
import TrafficOverTimeChartNoData from "pages/website-analysis/TrafficOverTimeChartNoData";
import React from "react";
import { allTrackers } from "services/track/track";

export const PhrasesEnrichedCompare = (props) => {
    const i18n = i18nFilter();
    const { SharePerMonth, SearchTerm, index, SiteOriginsPerMonth, SiteOrigins, Share } = props.row;
    const { selectedSites: selectedSitesProps, pageNumber, pageSize } = props;
    const selectedSites = selectedSitesProps.split(",");
    const clickOutsideXButton = (e) => {
        allTrackers.trackEvent("Open", "Click", "Traffic Over Time/Collapsed");
        document.body.click();
    };
    const colors = CHART_COLORS.compareMainColors.slice();
    const categories = SiteOriginsPerMonth.map((x) => new Date(x.Key).getTime());
    const data = selectedSites.reduce((result, site, index) => {
        const siteData = [];
        SiteOriginsPerMonth.forEach((siteOrigin) => {
            const { Value, Key } = siteOrigin;
            const totalValue = SharePerMonth.find((x) => x.Key === Key).Value;
            const y = Value[site] ? Value[site] * totalValue : null;
            siteData.push({ y, originalValue: Value[site] });
        });
        result.push({ name: site, data: siteData });
        return result;
    }, []);
    return (
        <div>
            <TrafficOverTime>
                <TrafficOverTimeLeft>
                    <div onClick={clickOutsideXButton}>
                        <IconButton iconName="chev-up" type="flat" />
                    </div>
                    <PhrasesOverTimeIndex>{pageNumber * pageSize + index + 1}</PhrasesOverTimeIndex>
                    <PhrasesOverTimeWebSiteWrap className="PhrasesOverTimeWebSiteWrap">
                        <CellKeywordPhrase {...props.row} value={SearchTerm} row={props.row} />
                    </PhrasesOverTimeWebSiteWrap>
                    <PhrasesOverTimeCompareShareWrap>
                        <TrafficOverTimeTitle>
                            {i18n(
                                "analysis.source.search.all.table.columns.totalShareCompare.title",
                            )}
                        </TrafficOverTimeTitle>
                        <TrafficShare {...props.row} value={Share} row={props.row} />
                    </PhrasesOverTimeCompareShareWrap>
                    <TrafficOverTimeChangeWrapShare>
                        <TrafficOverTimeTitle>
                            {i18n("analysis.source.search.all.table.columns.shareCompare.title")}
                        </TrafficOverTimeTitle>
                        <GroupTrafficShare
                            {...props.row}
                            value={SiteOrigins}
                            row={props.row}
                            tableOptions={{}}
                        />
                    </TrafficOverTimeChangeWrapShare>
                </TrafficOverTimeLeft>
                <CloseIconButton
                    type="flat"
                    onClick={clickOutsideXButton}
                    iconName="clear"
                    placement="left"
                />
            </TrafficOverTime>
            {!props.showTrafficOverTimeChartNoData ? (
                <TrafficOverTimeChart>
                    <TrafficOverTimeChartTitle>
                        <BoxTitle tooltip={i18n("phrases.overtime.compare.chart.title.tooltip")}>
                            {i18n("phrases.overtime.compare.chart.title")}
                        </BoxTitle>
                    </TrafficOverTimeChartTitle>
                    <Chart
                        type="column"
                        config={getOverTimeChartConfigCompare({
                            type: "column",
                            colors,
                            categories,
                        })}
                        data={data}
                        domProps={{ style: { height: "250px" } }}
                    />
                </TrafficOverTimeChart>
            ) : (
                <TrafficOverTimeChartNoData />
            )}
        </div>
    );
};
