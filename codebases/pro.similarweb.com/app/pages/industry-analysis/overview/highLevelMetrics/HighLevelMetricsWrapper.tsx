import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { timeGranularity } from "components/widget/widget-utilities/time-granularity";
import {
    getContextValue,
    IndustryAnalysisOverviewHighLevelMetricsContextProvider,
} from "./context";
import categoryService from "common/services/categoryService";
import { HighLevelMetrics } from "pages/industry-analysis/overview/highLevelMetrics/HighLevelMetrics";
import { colorsPalettes } from "@similarweb/styles";

const HighLevelMetricsContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    height: fit-content;
    min-height: 500px;
`;

const DEFAULT_QUERY_PARAMS = {
    timeGranularity: timeGranularity.monthly,
    includeSubdomains: true,
};

const HighLevelMetricsWrapperInner = ({ state }) => {
    const { routing } = state;
    const { params } = routing;
    const { duration, category, country, webSource, comparedDuration } = params;
    const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);
    const durations = DurationService.getDurationData(duration, comparedDuration);
    const { from, to, isWindow, compareFrom, compareTo } = durations.forAPI;
    const { forDisplayApi, categoryHash, forApi } = categoryObject;
    const queryParams = {
        category: forDisplayApi,
        categoryHash,
        country,
        isWindow,
        keys: forApi,
        from,
        to,
        webSource,
        compareFrom,
        compareTo,
        ...DEFAULT_QUERY_PARAMS,
    };
    return (
        <HighLevelMetricsContainer>
            <IndustryAnalysisOverviewHighLevelMetricsContextProvider
                value={getContextValue(queryParams, params, durations)}
            >
                <HighLevelMetrics />
            </IndustryAnalysisOverviewHighLevelMetricsContextProvider>
        </HighLevelMetricsContainer>
    );
};

const mapStateToProps = (state) => ({ state });

export const HighLevelMetricsWrapper = connect(mapStateToProps)(HighLevelMetricsWrapperInner);

SWReactRootComponent(HighLevelMetricsWrapper, "HighLevelMetricsWrapper");
