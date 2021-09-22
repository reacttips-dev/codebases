import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import Chart from "components/Chart/src/Chart";
import { TrafficShare } from "components/React/Table/cells";
import { TrafficShareWithTooltip } from "components/TrafficShare/src/TrafficShareWithTooltip";
import { CHART_COLORS } from "constants/ChartColors";
import { i18nFilter, smallNumbersPercentageFilter } from "filters/ngFilters";
import { getOverTimeChartConfigCompare } from "pages/website-analysis/incoming-traffic/commonOverTime";
import {
    CloseIconButton,
    SocialTrafficOverTimeIndex,
    ToggleIconButton,
    TrafficOverTime,
    TrafficOverTimeChangeWrapShare,
    TrafficOverTimeChart,
    TrafficOverTimeChartTitle,
    TrafficOverTimeLeft,
    TrafficOverTimeShareWrap,
    TrafficOverTimeTitle,
    TrafficOverTimeWebSiteWrap,
    TrafficShareWithTooltipContainer,
} from "pages/website-analysis/incoming-traffic/StyledComponents";
import TrafficOverTimeChartNoData from "pages/website-analysis/TrafficOverTimeChartNoData";
import React from "react";
import { allTrackers } from "services/track/track";

export const SocialOverTimeEnrichedRowCompare = (props) => {
    const { enrichProps, row, pageSize, page, chosenItems } = props;
    const { clickOutsideXButton, keys } = enrichProps;
    const {
        Page: Domain,
        index,
        SiteOriginsPerMonth = [],
        TotalSharePerMonth = [],
        SiteOrigins,
        TotalShare,
    } = row;
    const i18n = i18nFilter();
    const colors = CHART_COLORS.compareMainColors.slice();
    const categories = SiteOriginsPerMonth.map((x) => new Date(x.Key).getTime());
    const data = keys.reduce((result, site) => {
        const siteData = [];
        SiteOriginsPerMonth.map((siteKey) => {
            const { Value, Key } = siteKey;
            const totalValue = TotalSharePerMonth.find((x) => x.Key === Key).Value;
            const y = Value[site] ? Value[site] * totalValue : null;
            siteData.push({ y, originalValue: Value[site] });
        });
        result.push({ name: site, data: siteData });
        return result;
    }, []);

    const trafficDistribution = SiteOrigins.map(({ name, value }, index) => ({
        name,
        width: value,
        text: smallNumbersPercentageFilter()(value, 1),
        color: colorsPalettes.carbon[0],
        backgroundColor: chosenItems.find((x) => x.name === name).color,
    }));
    return (
        <div>
            <TrafficOverTime>
                <TrafficOverTimeLeft>
                    <div onClick={clickOutsideXButton}>
                        <ToggleIconButton iconName="chev-up" type="flat" />
                    </div>
                    <SocialTrafficOverTimeIndex>
                        {(page - 1) * pageSize + index + 1}
                    </SocialTrafficOverTimeIndex>
                    <TrafficOverTimeWebSiteWrap>
                        {Domain}
                        <a
                            href={`http://${Domain}`}
                            target="_blank"
                            onClick={() =>
                                allTrackers.trackEvent(
                                    "external link",
                                    "click",
                                    `Conversion Category Overview`,
                                )
                            }
                        >
                            <IconButton iconName="link-out" type="flat" iconSize="xs" />
                        </a>
                    </TrafficOverTimeWebSiteWrap>
                    <TrafficOverTimeShareWrap>
                        <TrafficOverTimeTitle>
                            {i18n("analysis.traffic.social.compare.title")}
                        </TrafficOverTimeTitle>
                        <TrafficShare {...props.row} value={TotalShare} row={props.row} />
                    </TrafficOverTimeShareWrap>
                    <TrafficOverTimeChangeWrapShare>
                        <TrafficOverTimeTitle>
                            {i18n("analysis.traffic.social.compare.share.title")}
                        </TrafficOverTimeTitle>
                        <TrafficShareWithTooltipContainer>
                            <TrafficShareWithTooltip
                                data={trafficDistribution}
                                title={i18n("analysis.traffic.social.compare.share.tooltip")}
                            />
                        </TrafficShareWithTooltipContainer>
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
                        <BoxTitle tooltip={i18n("analysis.traffic.social.compare.chart.tooltip")}>
                            {i18n("analysis.traffic.social.compare.chart.title")}
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
