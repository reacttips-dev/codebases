import { addToDashboard as addToDashboardFunction } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import React, { useRef } from "react";
import { useIndustryAnalysisOverviewHighLevelMetricsContext } from "pages/industry-analysis/overview/highLevelMetrics/context";

export const AddToDashboard = () => {
    const {
        selectedMetric,
        params,
        timeGranularity,
        queryParams,
        isPeriodOverPeriod,
    } = useIndustryAnalysisOverviewHighLevelMetricsContext();

    const modalRef = useRef();

    const onClick = () => {
        const defaultType = isPeriodOverPeriod ? "ComparedLine" : "Graph";
        const { metric, family = "Industry", type = defaultType } = selectedMetric;
        const { keys, category } = queryParams;
        const overrideAddToDashboardParams = {
            ...params,
            key: [{ name: category, id: keys, category: keys }],
            family,
        };
        const addToDashboardArgs = {
            metric,
            type,
            overrideAddToDashboardParams,
            filters: { timeGranularity: timeGranularity.value },
        };
        modalRef.current = addToDashboardFunction(addToDashboardArgs);
    };
    return <AddToDashboardButton onClick={onClick} modalRef={modalRef} />;
};
