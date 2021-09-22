import SWReactRootComponent from "decorators/SWReactRootComponent";
import {
    MetricContainer,
    MetricsRow,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import {
    OrganicTopKeywordsCompare,
    PaidTopKeywordsCompare,
} from "pages/website-analysis/components/WWOTopKeywords";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";

const WWOSearchTrafficCompare = (props) => {
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
    const [noDataState, setNoDataState] = React.useState({
        topKeywordsOrganic: false,
        topKeywordsPaid: false,
    });
    const commonProps = { queryParams, noDataState, setNoDataState };
    return (
        <MetricsRow>
            <MetricContainer width={"100%"} height={"395px"} padding={0}>
                {props.organic ? (
                    <OrganicTopKeywordsCompare {...commonProps} routingParams={params} />
                ) : (
                    <PaidTopKeywordsCompare {...commonProps} routingParams={params} />
                )}
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
const Connected = connect(mapStateToProps)(React.memo(WWOSearchTrafficCompare, propsAreEqual));
SWReactRootComponent(Connected, "WWOSearchTrafficCompare");
