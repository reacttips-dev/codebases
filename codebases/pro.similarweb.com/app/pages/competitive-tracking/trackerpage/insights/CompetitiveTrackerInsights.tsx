import React, { useContext, useEffect, useMemo, useState } from "react";
import { IInsightRecord } from "services/competitiveTrackerInsights/types/serviceTypes";
import { CompetitiveTrackerInsightsService } from "services/competitiveTrackerInsights/CompetitiveTrackerInsightsService";
import { i18nFilter } from "filters/ngFilters";
import { CompetitiveTrackerInsightTextService } from "services/competitiveTrackerInsightTexts/CompetitiveTrackerInsightTextsService";
import { SWReactIcons } from "@similarweb/icons";
import { InsightCards } from "./InsightCards/InsightCards";
import {
    ICompetitiveTrackerInsightsProps,
    ICompetitiveTrackerInsightServices,
} from "./CompetitiveTrackerInsights.types";
import { useCompetitiveTrackerHighLevelMetricsContext } from "../context/context";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    InsightsContainer,
    InsightsTitle,
    InsightsTitleContainer,
} from "./CompetitiveTrackerInsights.styles";

export const CompetitiveTrackerInsights: React.FunctionComponent<ICompetitiveTrackerInsightsProps> = (
    props,
) => {
    const { trackerId } = props;
    const { segmentsModule } = useCompetitiveTrackerHighLevelMetricsContext();

    const [isInsightsLoading, setIsInsightsLoading] = useState(false);
    const [insightsData, setInsightsData] = useState<IInsightRecord[]>([]);

    const services = useMemo<ICompetitiveTrackerInsightServices>(() => {
        return {
            trackerService: CompetitiveTrackerService,
            insightsService: CompetitiveTrackerInsightsService,
            insightTexts: CompetitiveTrackerInsightTextService,
            translate: i18nFilter(),
            navigator: Injector.get<SwNavigator>("swNavigator"),
            eventTracking: TrackWithGuidService,
        };
    }, []);

    const tracker = useMemo(() => {
        return services.trackerService.getById(trackerId);
    }, [trackerId, services]);

    useEffect(() => {
        if (segmentsModule.segmentsLoading) {
            return;
        }

        const fetchInsights = async () => {
            setIsInsightsLoading(true);
            const insightsData = await services?.insightsService.getAllTrackerInsights(
                tracker,
                segmentsModule,
            );
            setInsightsData(insightsData);
            setIsInsightsLoading(false);
        };

        fetchInsights();
    }, [trackerId, services, segmentsModule]);

    const isLoading = segmentsModule.segmentsLoading || isInsightsLoading;

    return (
        <InsightsContainer>
            <InsightsTitleContainer>
                <SWReactIcons iconName={"wand"} size={"xs"} />
                <InsightsTitle>{"Insights"}</InsightsTitle>
            </InsightsTitleContainer>
            <InsightCards isLoading={isLoading} insightRecords={insightsData} services={services} />
        </InsightsContainer>
    );
};
