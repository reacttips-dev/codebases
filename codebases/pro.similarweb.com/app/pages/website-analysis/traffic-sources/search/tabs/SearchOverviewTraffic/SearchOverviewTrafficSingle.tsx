import SWReactRootComponent from "decorators/SWReactRootComponent";
import {
    MetricsRow,
    MetricsSpace,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import {
    TrafficBySearchEngine,
    TrafficBySearchType,
    SearchOverviewTopOrganicKeywords,
    SearchOverviewTopPaidKeywords,
    OrganicCompetitors,
} from "../SearchOverviewTraffic/SearchOverviewTrafficTables";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { MetricContainer } from "../SearchOverviewTraffic/StyledComponent";
import { SearchOverviewSingleInsights } from "components/React/commonInsights/components/containers/SearchOverviewSingleInsights";

const metricHeight = "330px";
const metricWidth = "33.3%";
const metricMarginTop = "24px";
const bigMetricWidth = "50%";

export const SearchOverviewTrafficSingle = (props) => {
    const { country, isWWW, duration, key, webSource } = props.params;
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const queryParams = {
        country,
        from,
        includeSubDomains: isWWW === "*",
        isWindow,
        keys: key,
        to,
        webSource,
        timeGranularity: "Monthly",
    };
    return (
        <>
            <MetricsRow marginTop={metricMarginTop}>
                <MetricContainer height={metricHeight} width={metricWidth}>
                    <TrafficBySearchEngine queryParams={queryParams} />
                </MetricContainer>
                <MetricsSpace />
                <MetricContainer height={metricHeight} width={metricWidth}>
                    <TrafficBySearchType queryParams={queryParams} />
                </MetricContainer>
                <MetricsSpace />
                <MetricContainer height={metricHeight} width={metricWidth}>
                    <OrganicCompetitors queryParams={queryParams} routingParams={props.params} />
                </MetricContainer>
            </MetricsRow>
            <SearchOverviewSingleInsights />
            <MetricsRow marginTop={metricMarginTop}>
                <MetricContainer height={metricHeight} width={bigMetricWidth}>
                    <SearchOverviewTopOrganicKeywords
                        queryParams={queryParams}
                        routingParams={props.params}
                    />
                </MetricContainer>
                <MetricsSpace />
                <MetricContainer height={metricHeight} width={bigMetricWidth}>
                    <SearchOverviewTopPaidKeywords
                        queryParams={queryParams}
                        routingParams={props.params}
                    />
                </MetricContainer>
            </MetricsRow>
        </>
    );
};

const mapStateToProps = (props) => {
    const { routing } = props;
    const { params } = routing;
    return {
        params: {
            ...params,
        },
    };
};

const propsAreEqual = (prevProps, nextProps) => prevProps.params.key === nextProps.params.key;
const Connected = connect(mapStateToProps)(React.memo(SearchOverviewTrafficSingle, propsAreEqual));

SWReactRootComponent(Connected, "SearchOverviewTrafficSingle");
