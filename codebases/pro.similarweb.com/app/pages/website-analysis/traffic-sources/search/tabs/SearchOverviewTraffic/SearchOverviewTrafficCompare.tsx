import SWReactRootComponent from "decorators/SWReactRootComponent";
import {
    MetricsRow,
    MetricsSpace,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import {
    SearchOverviewTopOrganicKeywordsCompare,
    SearchOverviewTopPaidKeywordsCompare,
    TrafficByCompare,
} from "../SearchOverviewTraffic/SearchOverviewTrafficTablesCompare";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { MetricContainer } from "../SearchOverviewTraffic/StyledComponent";
import { SearchOverviewCompareInsights } from "components/React/commonInsights/components/containers/SearchOverviewCompareInsights";

const metricHeight = "330px";
const metricMarginTop = "24px";
const metricWidth = "50%";

const SearchOverviewTrafficCompareInner = (props) => {
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
                <MetricContainer width={"100%"}>
                    <TrafficByCompare
                        queryParams={queryParams}
                        routingParams={props.params}
                        {...props}
                        defaultApiCall={"SearchTrafficByEngines"}
                    />
                </MetricContainer>
            </MetricsRow>
            <SearchOverviewCompareInsights />
            <MetricsRow marginTop={metricMarginTop}>
                <MetricContainer height={metricHeight} width={metricWidth}>
                    <SearchOverviewTopOrganicKeywordsCompare
                        queryParams={queryParams}
                        routingParams={props.params}
                    />
                </MetricContainer>
                <MetricsSpace />
                <MetricContainer height={metricHeight} width={metricWidth}>
                    <SearchOverviewTopPaidKeywordsCompare
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
const Connected = connect(mapStateToProps)(
    React.memo(SearchOverviewTrafficCompareInner, propsAreEqual),
);

SWReactRootComponent(Connected, "SearchOverviewTrafficCompare");
