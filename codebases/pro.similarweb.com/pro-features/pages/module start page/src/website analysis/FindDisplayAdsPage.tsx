import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import React, { FC } from "react";
import TabbedUseCaseHomepage from "@similarweb/ui-components/dist/homepages/tabbed-use-case/src/TabbedUseCaseHomepage";
import { i18nFilter } from "filters/ngFilters";
import { SWReactIcons } from "@similarweb/icons";
import {
    StartPageWrapper,
    StartPageInfoWrapper,
    StartPageInfoText,
    StartPageAutoCompleteWrap,
} from "./StyledComponents";
import { AutocompleteWebsitesRecent } from "components/AutocompleteWebsites/AutocompleteWebsitesRecent";

const defaultWebsitePageState = "findDisplayAds_bycompetitor";
const selectedTabVideos = { selectedTab: "creatives" };

export const FindDisplayAdsPage: FC = () => {
    const i18n = i18nFilter();

    return (
        <TabbedUseCaseHomepage
            title={i18n("aquisitionintelligence.adCreativeResearch.finddisplayads.homepage.title")}
            subtitle={i18n(
                "aquisitionintelligence.adCreativeResearch.finddisplayads.homepage.subtitle",
            )}
            subtitlePosition="centered"
            tabsTitle={i18n(
                "aquisitionintelligence.adCreativeResearch.finddisplayads.homepage.tabsTitle",
            )}
            headerImageUrl={SecondaryHomePageHeaderImageUrl}
            tabs={[
                {
                    tabTitle: i18n(
                        "aquisitionintelligence.adCreativeResearch.finddisplayads.homepage.competition.tabTitle",
                    ),
                    tabComponent: (
                        <StartPageWrapper>
                            <StartPageInfoWrapper>
                                <SWReactIcons iconName="info" size="xs" />
                                <StartPageInfoText>
                                    {i18n(
                                        "aquisitionintelligence.adCreativeResearch.finddisplayads.homepage.competition.infoText",
                                    )}
                                </StartPageInfoText>
                            </StartPageInfoWrapper>
                            <StartPageAutoCompleteWrap>
                                <AutocompleteWebsitesRecent
                                    defaultWebsitePageState={defaultWebsitePageState}
                                    defaultWebsitePageStateParams={selectedTabVideos}
                                />
                            </StartPageAutoCompleteWrap>
                        </StartPageWrapper>
                    ),
                },
            ]}
        />
    );
};
