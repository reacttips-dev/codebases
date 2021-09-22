import { onOpenAddToDashboardModal } from "pages/keyword-analysis/common/UtilityFunctions";
import { MetricsRow } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import Graph from "pages/keyword-analysis/OrganicPage/Graph/Graph";
import { EGraphGranularities } from "pages/keyword-analysis/OrganicPage/Graph/GraphData";
import React, { useMemo } from "react";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

export const MainGraph = ({
    params,
    sites,
    visitsBelowThreshold,
    addToDashBoardModal,
    commonProps,
}) => {
    const { keyword } = params;
    const { isKeywordsGroup, GroupHash } = commonProps;
    const keys = isKeywordsGroup ? keyword.substring(1) : keyword;

    const graphParams = useMemo(() => {
        const { tab, ...rest } = params;
        return {
            ...rest,
            webSource: devicesTypes.TOTAL,
            GroupHash,
            keyword: keys,
        };
    }, []);
    return (
        <MetricsRow>
            <Graph
                params={graphParams}
                isMarketShareDisable={visitsBelowThreshold}
                initialGranularity={EGraphGranularities.MONTHLY}
                addToDashboardMetric="KeywordAnalysisTotal"
                graphApiEndpoint="/widgetApi/KeywordAnalysisOP/KeywordAnalysisTotal/Graph"
                sites={sites}
                onOpenAddToDashboardModal={onOpenAddToDashboardModal(addToDashBoardModal)}
                isKeywordsGroup={isKeywordsGroup}
                disableGranularities
                pngHeaderDataTypeKey={"Keyword.analysis.total.png.header.type"}
            />
        </MetricsRow>
    );
};
