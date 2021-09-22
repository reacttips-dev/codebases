import {
    CategoryInsightCard,
    DomainInsightCard,
    FeedbackInsightCard,
} from "@similarweb/ui-components/dist/insight-card";
import { IInsightRecord } from "services/competitiveTrackerInsights/types/serviceTypes";
import { ICompetitiveTrackerInsightServices } from "../CompetitiveTrackerInsights.types";
import { getNavDetailsForInsight } from "./InsightUrlBuilder";

const onNavigateClick = (insight: IInsightRecord, services: ICompetitiveTrackerInsightServices) => {
    services.eventTracking.trackWithGuid("competitive.tracking.insight.click", "click", {
        entity: insight.entityType,
        insight: insight.insightType,
    });
    const navDetails = getNavDetailsForInsight(insight);
    services.navigator.go(navDetails.stateName, navDetails.stateParams);
};

const onPromptNavigateClick = (services: ICompetitiveTrackerInsightServices) => {
    const { trackerId } = services.navigator.getParams();

    services.eventTracking.trackWithGuid("competitive.tracking.enrich.insights.click", "click");
    services.navigator.go("companyResearch_competitiveTracking_edit", {
        trackerId,
    });
};

const renderSegmentInsightCard = (
    insight: IInsightRecord,
    services: ICompetitiveTrackerInsightServices,
) => {
    return (
        <DomainInsightCard
            headerText={insight.metaData.segment?.domain}
            headerImage={insight.metaData.segment?.favicon}
            bodyTexts={services.insightTexts.createBodyTextForInsight(insight)}
            footerButtonText={services.translate("competitive.tracking.insights.cta")}
            onFooterButtonClick={() => onNavigateClick(insight, services)}
        />
    );
};

const renderDomainInsightCard = (
    insight: IInsightRecord,
    services: ICompetitiveTrackerInsightServices,
) => {
    return (
        <DomainInsightCard
            headerText={insight.entityId}
            headerImage={insight.entityImage}
            bodyTexts={services.insightTexts.createBodyTextForInsight(insight)}
            footerButtonText={services.translate("competitive.tracking.insights.cta")}
            onFooterButtonClick={() => onNavigateClick(insight, services)}
        />
    );
};

const renderIndustryInsightCard = (
    insight: IInsightRecord,
    services: ICompetitiveTrackerInsightServices,
) => {
    return (
        <CategoryInsightCard
            headerText={insight.metaData.industry.text}
            headerIcon={"serp-news"}
            bodyTexts={services.insightTexts.createBodyTextForInsight(insight)}
            footerButtonText={services.translate("competitive.tracking.insights.cta")}
            onFooterButtonClick={() => onNavigateClick(insight, services)}
        />
    );
};

export const renderPromptCard = (services: ICompetitiveTrackerInsightServices) => {
    return (
        <FeedbackInsightCard
            headerText={"Want to see more insights?"}
            bodyText={"Add to your competitive set to enrich your insights"}
            footerButtonText={services.translate("competitive.tracking.insights.add.competitors")}
            onFooterButtonClick={() => onPromptNavigateClick(services)}
        />
    );
};

export const renderNoDataCard = (services: ICompetitiveTrackerInsightServices) => {
    return (
        <FeedbackInsightCard
            headerText={"Not enough traffic for insights"}
            bodyText={
                "Your competitive set is too small to fetch insights. Add more competitors to see current trends."
            }
            footerButtonText={services.translate("competitive.tracking.insights.add.competitors")}
            onFooterButtonClick={() => onPromptNavigateClick(services)}
        />
    );
};

export const renderInsightCardFromRecord = (
    insight: IInsightRecord,
    services: ICompetitiveTrackerInsightServices,
) => {
    switch (insight.entityType) {
        case "Industry":
            return renderIndustryInsightCard(insight, services);
        case "Domain":
            return renderDomainInsightCard(insight, services);
        case "Segment":
            return renderSegmentInsightCard(insight, services);
        default:
            return null;
    }
};
