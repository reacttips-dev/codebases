import { IconButton } from "@similarweb/ui-components/dist/button";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import Chart from "components/Chart/src/Chart";
import { TrafficShare } from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import { dateToUTC } from "pages/website-analysis/incoming-traffic/chartConfig";
import { getOverTimeChartConfigSingle } from "pages/website-analysis/incoming-traffic/commonOverTime";
import {
    CloseIconButton,
    SocialTrafficOverTimeIndex,
    TrafficOverTime,
    TrafficOverTimeChart,
    TrafficOverTimeChartTitle,
    TrafficOverTimeLeft,
    TrafficOverTimeShareWrap,
    TrafficOverTimeTitle,
    TrafficOverTimeWebSiteWrap,
} from "pages/website-analysis/incoming-traffic/StyledComponents";
import TrafficOverTimeChartNoData from "pages/website-analysis/TrafficOverTimeChartNoData";
import React from "react";
import { allTrackers } from "services/track/track";

export const SocialOverTimeEnrichedRowSingle = (props) => {
    const i18n = i18nFilter();
    const { row, enrichProps, page, pageSize } = props;
    const { Page: Domain, Share, index, TotalSharePerMonth = [] } = row;
    const { clickOutsideXButton } = enrichProps;
    const data = TotalSharePerMonth.map((item) => [dateToUTC(item.Key), item.Value]);
    const graphData = [{ data }];
    return (
        <>
            <TrafficOverTime>
                <TrafficOverTimeLeft>
                    <div onClick={clickOutsideXButton}>
                        <IconButton iconName="chev-up" type="flat" />
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
                            {i18n("analysis.traffic.social.single.title")}
                        </TrafficOverTimeTitle>
                        <TrafficShare {...props.row} value={Share} row={props.row} />
                    </TrafficOverTimeShareWrap>
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
                        <BoxTitle
                            tooltip={i18n("analysis.traffic.social.single.chart.title.tooltip")}
                        >
                            {i18n("analysis.traffic.social.single.chart.title")}
                        </BoxTitle>
                    </TrafficOverTimeChartTitle>
                    <Chart
                        type="area"
                        config={getOverTimeChartConfigSingle("line")}
                        data={graphData}
                        domProps={{ style: { height: "250px" } }}
                    />
                </TrafficOverTimeChart>
            ) : (
                <TrafficOverTimeChartNoData />
            )}
        </>
    );
};
