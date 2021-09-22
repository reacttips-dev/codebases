import { IconButton } from "@similarweb/ui-components/dist/button";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import Chart from "components/Chart/src/Chart";
import { CellKeywordPhrase, TrafficShare } from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import { dateToUTC } from "pages/website-analysis/incoming-traffic/chartConfig";
import { getOverTimeChartConfigSingle } from "pages/website-analysis/incoming-traffic/commonOverTime";
import {
    CloseIconButton,
    PhrasesOverTimeIndex,
    PhrasesOverTimeShareWrap,
    PhrasesOverTimeWebSiteWrap,
    TrafficOverTime,
    TrafficOverTimeChart,
    TrafficOverTimeChartTitle,
    TrafficOverTimeLeft,
    TrafficOverTimeTitle,
} from "pages/website-analysis/incoming-traffic/StyledComponents";
import TrafficOverTimeChartNoData from "pages/website-analysis/TrafficOverTimeChartNoData";
import * as React from "react";
import { allTrackers } from "services/track/track";

export const PhrasesEnrichedSingle = (props) => {
    const i18n = i18nFilter();
    const { pageSize, pageNumber, row } = props;
    const { SharePerMonth, SearchTerm, Share, index } = row;
    const clickOutsideXButton = (e) => {
        allTrackers.trackEvent("Open", "Click", "Traffic Over Time/Collapsed");
        document.body.click();
    };
    const data = SharePerMonth.map((item) => [
        dateToUTC(item.Key),
        item.Value === "NaN" ? null : item.Value,
    ]);
    const graphData = [{ data }];
    return (
        <div>
            <TrafficOverTime>
                <TrafficOverTimeLeft>
                    <div onClick={clickOutsideXButton}>
                        <IconButton iconName="chev-up" type="flat" />
                    </div>
                    <PhrasesOverTimeIndex>{pageNumber * pageSize + index + 1}</PhrasesOverTimeIndex>
                    <PhrasesOverTimeWebSiteWrap className="PhrasesOverTimeWebSiteWrap">
                        <CellKeywordPhrase
                            {...props.row}
                            value={SearchTerm}
                            row={props.row}
                            style={{ justifyContent: "flex-start" }}
                        />
                    </PhrasesOverTimeWebSiteWrap>
                    <PhrasesOverTimeShareWrap>
                        <TrafficOverTimeTitle>
                            {i18n("analysis.source.referrals.table.columns.share.title")}
                        </TrafficOverTimeTitle>
                        <TrafficShare {...props.row} value={Share} row={props.row} />
                    </PhrasesOverTimeShareWrap>
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
                        <BoxTitle tooltip={i18n("phrases.overtime.chart.title.tooltip")}>
                            {i18n("phrases.overtime.chart.title")}
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
        </div>
    );
};
