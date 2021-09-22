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

const defaultWebsitePageState = "findVideoAds_bycompetitor";

export const FindVideoAdsPage: FC = () => {
    const i18n = i18nFilter();

    return (
        <TabbedUseCaseHomepage
            title={i18n("aquisitionintelligence.adCreativeResearch.findvideoads.homepage.title")}
            subtitle={i18n(
                "aquisitionintelligence.adCreativeResearch.findvideoads.homepage.subtitle",
            )}
            subtitlePosition="centered"
            tabsTitle={i18n(
                "aquisitionintelligence.adCreativeResearch.findvideoads.homepage.tabsTitle",
            )}
            headerImageUrl={SecondaryHomePageHeaderImageUrl}
            tabs={[
                {
                    tabTitle: i18n(
                        "aquisitionintelligence.adCreativeResearch.findvideoads.homepage.competition.tabTitle",
                    ),
                    tabComponent: (
                        <StartPageWrapper>
                            <StartPageInfoWrapper>
                                <SWReactIcons iconName="info" size="xs" />
                                <StartPageInfoText>
                                    {i18n(
                                        "aquisitionintelligence.adCreativeResearch.findvideoads.homepage.competition.infoText",
                                    )}
                                </StartPageInfoText>
                            </StartPageInfoWrapper>
                            <StartPageAutoCompleteWrap>
                                <AutocompleteWebsitesRecent
                                    defaultWebsitePageState={defaultWebsitePageState}
                                />
                            </StartPageAutoCompleteWrap>
                        </StartPageWrapper>
                    ),
                },
            ]}
        />
    );
};
