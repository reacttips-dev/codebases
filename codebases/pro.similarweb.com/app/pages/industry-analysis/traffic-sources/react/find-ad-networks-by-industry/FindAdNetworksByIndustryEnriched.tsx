import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import Chart from "components/Chart/src/Chart";
import {
    ChangePercentage,
    TrafficShare,
    WebsiteTooltipTopCell,
} from "components/React/Table/cells";
import { i18nFilter } from "filters/ngFilters";
import { dateToUTC } from "pages/website-analysis/incoming-traffic/chartConfig";
import { getOverTimeChartConfigSingle } from "pages/website-analysis/incoming-traffic/commonOverTime";
import {
    CloseIconButton,
    RowDetailHeader,
    RowDetailHeaderLeft,
    RowDetailHeaderIndex,
    AdNetworksWrap,
    TrafficShareWrap,
    ChangeWrap,
    NewChangeWrapper,
    LeaderWrap,
    FieldTitle,
    RowDetailBody,
    ChartTitle,
} from "./Components/StyledComponents";
import TrafficOverTimeChartNoData from "pages/website-analysis/TrafficOverTimeChartNoData";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export const FindAdNetworksByIndustryEnriched = (props) => {
    const i18n = i18nFilter();
    const { pageSize, pageNumber, row } = props;
    const {
        SharePerMonth,
        Name,
        TrafficLeader,
        TrafficLeaderFavicon,
        TrafficLeaderUrl,
        TotalShare,
        Change,
        index,
    } = row;
    const clickOutsideXButton = (e) => {
        TrackWithGuidService.trackWithGuid("find.ad.networks.by.industry.inner.table", "click", {
            action: "Find Ad Network By Industry/Collapsed",
        });
        document.body.click();
    };
    const data = SharePerMonth.map((item) => [
        dateToUTC(item.Key),
        item.Value === "NaN" ? null : item.Value,
    ]);
    const graphData = [{ data }];
    return (
        <>
            <RowDetailHeader>
                <RowDetailHeaderLeft>
                    <div onClick={clickOutsideXButton}>
                        <IconButton iconName="chev-up" type="flat" />
                    </div>
                    <RowDetailHeaderIndex>{pageNumber * pageSize + index + 1}</RowDetailHeaderIndex>
                    <AdNetworksWrap>{Name}</AdNetworksWrap>
                    <TrafficShareWrap>
                        <FieldTitle>
                            {i18n("find.ad.networks.by.industry.table.columns.trafficshare")}
                        </FieldTitle>
                        <TrafficShare {...props.row} value={TotalShare} row={props.row} />
                    </TrafficShareWrap>
                    <ChangeWrap>
                        <FieldTitle>
                            {i18n("find.ad.networks.by.industry.table.columns.change")}
                        </FieldTitle>
                        {props.row.NewChange ? (
                            <NewChangeWrapper>{i18n("new.label.pill")}</NewChangeWrapper>
                        ) : (
                            <ChangePercentage {...props.row} value={Change} row={props.row} />
                        )}
                    </ChangeWrap>
                    <LeaderWrap>
                        <FieldTitle>
                            {i18n("find.ad.networks.by.industry.table.columns.leader")}
                        </FieldTitle>
                        {TrafficLeader ? (
                            <WebsiteTooltipTopCell
                                {...props}
                                tableMetadata={{ hasChilds: false }}
                                secondaryIcon={TrafficLeaderFavicon}
                                secondaryUrl={TrafficLeaderUrl}
                                secondaryValue={TrafficLeader}
                            />
                        ) : (
                            <div style={{ marginLeft: 25 }}>-</div>
                        )}
                    </LeaderWrap>
                </RowDetailHeaderLeft>
                <CloseIconButton
                    type="flat"
                    onClick={clickOutsideXButton}
                    iconName="clear"
                    placement="left"
                />
            </RowDetailHeader>
            {!props.showChartNoData ? (
                <RowDetailBody>
                    <ChartTitle>
                        <BoxTitle
                            tooltip={i18n("find.ad.networks.by.industry.chart.title.tooltip")}
                        >
                            {i18n("find.ad.networks.by.industry.chart.title")}
                        </BoxTitle>
                    </ChartTitle>
                    <Chart
                        type="line"
                        config={getOverTimeChartConfigSingle("line")}
                        data={graphData}
                        domProps={{ style: { height: "250px" } }}
                    />
                </RowDetailBody>
            ) : (
                <TrafficOverTimeChartNoData />
            )}
        </>
    );
};
