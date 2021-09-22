import SWReactRootComponent from "decorators/SWReactRootComponent";
import {
    MetricContainer,
    MetricsRow,
    MetricsSpace,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { WWOTopAds } from "pages/website-analysis/components/WWOTopAds";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { PaidTopKeywords } from "../../../pages/website-analysis/components/WWOTopKeywords";

const WWOSearchTrafficPaid = (props) => {
    const { params } = props;
    const { country, key, isWWW, duration } = params;
    if (!key) {
        return null;
    }
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const queryParams = {
        country,
        from,
        includeSubDomains: isWWW === "*",
        isWindow,
        keys: key,
        to,
        webSource: "Total",
    };
    const [noDataState, setNoDataState] = React.useState({ TopAds: false, topKeywordsPaid: false });
    const commonProps = { queryParams, noDataState, setNoDataState };
    return (
        <MetricsRow>
            <MetricContainer width={"55%"} height={"305px"} padding={0}>
                <WWOTopAds {...commonProps} routingParams={params} />
            </MetricContainer>
            <MetricsSpace />
            <MetricContainer width={"55%"} height={"305px"} padding={0}>
                <PaidTopKeywords {...commonProps} routingParams={params} />
            </MetricContainer>
        </MetricsRow>
    );
};

const mapStateToProps = (props) => {
    const { routing, common } = props;
    const { params } = routing;
    const { showGAApprovedData } = common;
    return {
        params: {
            ...params,
            showGAApprovedData,
        },
    };
};

const propsAreEqual = (prevProps, nextProps) => prevProps.params.key === nextProps.params.key;
const Connected = connect(mapStateToProps)(React.memo(WWOSearchTrafficPaid, propsAreEqual));
SWReactRootComponent(Connected, "WWOSearchTrafficPaid");
