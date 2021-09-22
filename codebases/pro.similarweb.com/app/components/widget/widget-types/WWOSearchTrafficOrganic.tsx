import SWReactRootComponent from "decorators/SWReactRootComponent";
import {
    MetricContainer,
    MetricsRow,
    MetricsSpace,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { OrganicBrandedNonBranded } from "../../../pages/website-analysis/components/WWOOrganicBrandedNonBranded";
import { OrganicTopKeywords } from "../../../pages/website-analysis/components/WWOTopKeywords";

const WWOSearchTrafficOrganic = (props) => {
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
        BrandedNonBranded: false,
        topKeywordsOrganic: false,
    });
    const commonProps = { queryParams, noDataState, setNoDataState };
    return (
        <MetricsRow>
            <MetricContainer width={"55%"} height={"305px"} padding={0}>
                <OrganicBrandedNonBranded {...commonProps} routingParams={params} />
            </MetricContainer>
            <MetricsSpace />
            <MetricContainer width={"55%"} height={"305px"} padding={0}>
                <OrganicTopKeywords {...commonProps} routingParams={params} />
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
const Connected = connect(mapStateToProps)(React.memo(WWOSearchTrafficOrganic, propsAreEqual));
SWReactRootComponent(Connected, "WWOSearchTrafficOrganic");
