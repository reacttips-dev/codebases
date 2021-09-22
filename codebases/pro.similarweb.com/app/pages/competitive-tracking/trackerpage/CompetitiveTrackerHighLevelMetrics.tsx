import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC, useMemo } from "react";
import { connect } from "react-redux";
import {
    CompetitiveTrackerHighLevelMetricsContextProvider,
    getContextValue,
} from "./context/context";
import { PageHeader } from "pages/competitive-tracking/homepage/PageHeader";
import { LoadingSpinner } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { ICompetitiveTrackerHighLevelMetricsProps } from "./CompetitiveTrackerHighLevelMetrics.types";
import { LoaderContainer } from "./tabs/styled";
import {
    HighLevelMetricsContainer,
    PageHeaderContainer,
} from "./CompetitiveTrackerHighLevelMetrics.styles";
import { TrackerHeader } from "./TrackerHeader";
import { TrackerOverview } from "./TrackerOverview";
import { Tabs } from "./tabs/Tabs";
import { CompetitiveTrackerInsights } from "./insights/CompetitiveTrackerInsights";

const CompetitiveTrackerHighLevelMetricsInner: FC<ICompetitiveTrackerHighLevelMetricsProps> = (
    props,
) => {
    const { routing, segmentsModule } = props;
    const { segmentsLoading } = segmentsModule;

    if (segmentsLoading) {
        return (
            <LoaderContainer>
                <LoadingSpinner />
            </LoaderContainer>
        );
    }
    return (
        <PageHeaderContainer>
            <PageHeader />
            <HighLevelMetricsContainer>
                <CompetitiveTrackerHighLevelMetricsContextProvider
                    value={getContextValue(routing, segmentsModule)}
                >
                    <TrackerHeader />
                    <TrackerOverview />
                    <Tabs />
                    <CompetitiveTrackerInsights trackerId={routing?.params?.trackerId} />
                </CompetitiveTrackerHighLevelMetricsContextProvider>
            </HighLevelMetricsContainer>
        </PageHeaderContainer>
    );
};

const mapStateToProps = (state) => {
    const { segmentsModule = {}, routing } = state;
    return {
        segmentsModule,
        routing,
    };
};

export const CompetitiveTrackerHighLevelMetrics = connect(mapStateToProps)(
    CompetitiveTrackerHighLevelMetricsInner,
);

SWReactRootComponent(CompetitiveTrackerHighLevelMetrics, "CompetitiveTrackerHighLevelMetrics");
