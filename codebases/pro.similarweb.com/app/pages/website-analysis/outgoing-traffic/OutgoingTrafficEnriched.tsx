import { IconButton } from "@similarweb/ui-components/dist/button";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import Chart from "components/Chart/src/Chart";
import { TrafficShare } from "components/React/Table/cells";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import ComponentsProvider from "components/WithComponent/src/ComponentsProvider";
import { i18nFilter } from "filters/ngFilters";
import { StyledCoreWebsiteCell } from "pages/segments/analysis/StyledComponents";
import { dateToUTC } from "pages/website-analysis/incoming-traffic/chartConfig";
import { getOverTimeChartConfigSingle } from "pages/website-analysis/incoming-traffic/commonOverTime";
import {
    CloseIconButton,
    OutgoingTrafficOverTimeIndex,
    ToggleIconButton,
    TrafficOverTime,
    TrafficOverTimeChart,
    TrafficOverTimeChartTitle,
    TrafficOverTimeLeft,
    TrafficOverTimeShareWrap,
    TrafficOverTimeTitle,
    TrafficOverTimeWebSiteWrap,
} from "pages/website-analysis/incoming-traffic/StyledComponents";
import TrafficOverTimeChartNoData from "pages/website-analysis/TrafficOverTimeChartNoData";
import React, { FunctionComponent } from "react";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../scripts/common/services/swNavigator";

export const OutgoingTrafficEnriched: FunctionComponent<any> = (props) => {
    const i18n = i18nFilter();
    const { pageSize, pageNumber, row } = props;
    const { TotalSharePerMonth, Domain, Share, index, Favicon } = row;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const params = swNavigator.getParams();
    const durationRaw = DurationService.getDurationData(params.duration).raw;
    const { from, to } = durationRaw;
    const duration = DurationService.getDiffSymbol(from, to);
    const showTrafficOverTimeChartNoData = ["28d", "1m"].includes(duration);
    const clickOutsideXButton = (e) => {
        allTrackers.trackEvent("Open", "Click", "Traffic Over Time/Collapsed");
        document.body.click();
    };
    const data = TotalSharePerMonth.map((item) => [dateToUTC(item.Key), item.Value]);
    const graphData = [{ data }];
    return (
        <>
            <TrafficOverTime>
                <TrafficOverTimeLeft>
                    <div onClick={clickOutsideXButton}>
                        <ToggleIconButton iconName="chev-up" type="flat" />
                    </div>
                    <OutgoingTrafficOverTimeIndex>
                        {pageNumber * pageSize + index + 1}
                    </OutgoingTrafficOverTimeIndex>
                    <TrafficOverTimeWebSiteWrap>
                        <ComponentsProvider components={{ WebsiteTooltip }}>
                            <StyledCoreWebsiteCell
                                icon={Favicon}
                                domain={Domain}
                                externalLink={`http://${Domain}`}
                                trackExternalLink={() =>
                                    allTrackers.trackEvent(
                                        "external link",
                                        "click",
                                        `Conversion Category Overview`,
                                    )
                                }
                            />
                        </ComponentsProvider>
                    </TrafficOverTimeWebSiteWrap>
                    <TrafficOverTimeShareWrap>
                        <TrafficOverTimeTitle>
                            {i18n("analysis.source.referrals.table.columns.share.title")}
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
            {!showTrafficOverTimeChartNoData ? (
                <TrafficOverTimeChart>
                    <TrafficOverTimeChartTitle>
                        <BoxTitle tooltip={i18n("outgoingtraffic.overtime.chart.title.tooltip")}>
                            {i18n("outgoingtraffic.overtime.chart.title")}
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
