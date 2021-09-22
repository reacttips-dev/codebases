import { AddToDashboard } from "pages/keyword-analysis/common/AddToDashboard";
import {
    onCalculateVisitsTrend,
    onOpenAddToDashboardModal,
} from "pages/keyword-analysis/common/UtilityFunctions";
import { SearchVisits } from "pages/keyword-analysis/KeywordsOverviewPage/Components/SearchVisits";
import { SearchVolume } from "pages/keyword-analysis/KeywordsOverviewPage/Components/SearchVolume";
import {
    MetricContainer,
    MetricsRow,
    MetricsSpace,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import React from "react";

export const HeaderComponents = ({ commonProps, addToDashBoardModal, setVisitsBelowThreshold }) => {
    return (
        <MetricsRow>
            <MetricContainer width="50%">
                <>
                    <SearchVolume {...commonProps} showZeroClick={false} />
                    <AddToDashboard
                        webSource="Total"
                        type="SingleMetric"
                        metric="KeywordAnalysisVolumes"
                        onOpen={onOpenAddToDashboardModal(addToDashBoardModal)}
                    />
                </>
            </MetricContainer>
            <MetricsSpace />
            <MetricContainer width="50%">
                <>
                    <SearchVisits
                        {...commonProps}
                        onCalculateVisitsTrend={onCalculateVisitsTrend(setVisitsBelowThreshold)}
                    />
                    <AddToDashboard
                        webSource="Total"
                        type="KeywordAnalysisTotalVisits"
                        metric="KeywordAnalysisTrafficShareOverTime"
                        onOpen={onOpenAddToDashboardModal(addToDashBoardModal)}
                        overrideAddToDasboardParams={{ duration: "12m" }}
                    />
                </>
            </MetricContainer>
        </MetricsRow>
    );
};
