import React from "react";
import { TopCountries } from "./components/TopCountriesCard/TopCountries";
import { Technologies } from "./components/Technologies/TechnologiesContainer";
import AdNetworkFeed from "../AdNetworkFeed/AdNetworkFeed";
import { SiteInfo } from "../AboutCards/components/SiteInfo/SiteInfo";
import {
    StyledAboutTabContainer,
    StyledGeneralInfoContainer,
    StyledGeneralInfoTitle,
} from "./styles";
import { GENERALINFO_TITLE } from "../../constants";
import { useTranslation } from "components/WithTranslation/src/I18n";
import TopOpportunityContainer from "../../../benchmarks/components/TopOpportunity/TopOpportunityContainer";
import {
    BENCHMARK_ITEMS_LINK_FULL_REVIEW,
    TOPICS_TRANSLATION_KEY,
} from "pages/workspace/sales/sub-modules/benchmarks/constants";
import { IconButton } from "@similarweb/ui-components/dist/button";
import useRightSidebarTrackingService from "pages/sales-intelligence/hooks/useRightSidebarTrackingService";
import { AD_NETWORKS_TOPICS } from "./consts";
import { TechnologiesStore } from "../../types/technologies";
import { BenchmarksQuotaType } from "../../../benchmarks/types/benchmarks";
import { TopicType } from "../../../benchmarks/types/topics";
import { TechnologiesData } from "../../types/technologies";
import { swSettings } from "common/services/swSettings";

type AboutCardsProps = {
    topCountries: any;
    adNetworks: any;
    siteInfo: any;
    linkToTrends(): void;
    linkToBenchmarks(metricName: string): void;
    accountReviewLink: string;
    topic: TopicType["code"];
    technologies: TechnologiesStore;
    activeWebsite: string;
    benchmarksQuota: BenchmarksQuotaType;
    benchmarksAreEmpty: boolean;
    isSales: boolean;
};

export function AboutCards({
    topCountries,
    adNetworks,
    siteInfo,
    linkToTrends,
    linkToBenchmarks,
    accountReviewLink,
    topic,
    technologies,
    activeWebsite,
    benchmarksQuota,
    benchmarksAreEmpty,
    isSales, // To know if Sidebar used in sales or not
}: AboutCardsProps): JSX.Element {
    const translate = useTranslation();
    const sidebarTrackingService = useRightSidebarTrackingService();

    const renderTopOpportunity = () => {
        if (
            !benchmarksAreEmpty ||
            (benchmarksQuota?.remaining > 0 && benchmarksQuota?.isUltimateAccess)
        ) {
            return (
                <StyledAboutTabContainer>
                    <TopOpportunityContainer onViewAllClick={linkToBenchmarks} />
                </StyledAboutTabContainer>
            );
        }

        return null;
    };

    const showTechnographics = swSettings?.components?.Workspaces?.resources?.Technographics;

    return (
        <StyledGeneralInfoContainer>
            <StyledGeneralInfoTitle>
                {translate(GENERALINFO_TITLE)}
                {accountReviewLink && (
                    <a
                        href={accountReviewLink}
                        data-automation="website-analysis-tile"
                        target="_blank"
                        rel="noreferrer"
                        onClick={() =>
                            sidebarTrackingService.trackAboutAccReviewClicked(
                                translate(`${TOPICS_TRANSLATION_KEY}.${topic}`),
                            )
                        }
                    >
                        <IconButton type="flat" iconName="link-out" placement="right">
                            {translate(`${BENCHMARK_ITEMS_LINK_FULL_REVIEW}`)}
                        </IconButton>
                    </a>
                )}
            </StyledGeneralInfoTitle>
            <StyledAboutTabContainer>
                <SiteInfo isSales={isSales} info={siteInfo} linkToTrends={linkToTrends} />
            </StyledAboutTabContainer>
            <StyledAboutTabContainer>
                <TopCountries topCountries={topCountries} topic={topic} />
            </StyledAboutTabContainer>
            <StyledAboutTabContainer>
                {showTechnographics && (
                    <Technologies
                        activeWebsite={activeWebsite}
                        technologies={technologies?.data}
                        isLoading={technologies?.isLoading}
                    />
                )}
            </StyledAboutTabContainer>
            {AD_NETWORKS_TOPICS.includes(topic) && (
                <StyledAboutTabContainer>
                    <AdNetworkFeed feed={adNetworks} />
                </StyledAboutTabContainer>
            )}
            {renderTopOpportunity()}
        </StyledGeneralInfoContainer>
    );
}
