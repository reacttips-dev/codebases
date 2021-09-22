import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import React, { FunctionComponent, useState } from "react";
import { AutocompleteWebsitesRecent } from "components/AutocompleteWebsites/AutocompleteWebsitesRecent.tsx";
import TabbedUseCaseHomepage from "@similarweb/ui-components/dist/homepages/tabbed-use-case/src/TabbedUseCaseHomepage";
import { SWReactIcons } from "@similarweb/icons";
import { AutocompleteKeywords } from "components/AutocompleteKeywords/AutocompleteKeywords";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { IconButton } from "@similarweb/ui-components/dist/button";
import * as utils from "components/filters-bar/utils";
import { swSettings } from "common/services/swSettings";
import { ISearches } from "userdata";
import { IMarketingWorkspace } from "services/marketingWorkspaceApiService";
import {
    StartPageWrapper,
    StartPageInfoWrapper,
    StartPageInfoText,
    StartPageAutoCompleteWrap,
    StartPageCountryContainer,
    StartPageFooter,
} from "./StyledComponents";
import { i18nFilter } from "filters/ngFilters";

interface IFindTextAdsPageProps {
    visitTopAds: ({ keyword: string, country: number }) => void;
}

export const FindTextAdsPage: FunctionComponent<IFindTextAdsPageProps> = ({ visitTopAds }) => {
    const i18n = i18nFilter();
    const availableKeywordsAdsCountries = utils.getCountries(
        false,
        swSettings.components.KeywordsAds,
    );
    const onClickSeedKeyword = (keyword) => {
        setSeedKeyword(keyword);
    };
    const [selectedKeywordsAdsCountryId, setSelectedKeywordsAdsCountryId] = useState(
        availableKeywordsAdsCountries[0].id,
    );
    const [seedKeyword, setSeedKeyword] = useState("");
    const changeKeywordsAdsCountry = (selectedCountry) => {
        setSelectedKeywordsAdsCountryId(selectedCountry.id);
    };
    const onClickVisitTopAds = () => {
        visitTopAds({
            keyword: seedKeyword,
            country: selectedKeywordsAdsCountryId,
        });
    };
    return (
        <TabbedUseCaseHomepage
            title={i18n("aquisitionintelligence.adCreativeResearch.searchTextAds.homepage.title")}
            subtitle={i18n(
                "aquisitionintelligence.adCreativeResearch.searchTextAds.homepage.subtitle",
            )}
            subtitlePosition="centered"
            tabsTitle={i18n(
                "aquisitionintelligence.adCreativeResearch.searchTextAds.homepage.tabsTitle",
            )}
            headerImageUrl={SecondaryHomePageHeaderImageUrl}
            tabs={[
                {
                    tabTitle: i18n(
                        "aquisitionintelligence.adCreativeResearch.searchTextAds.homepage.keyword.tabTitle",
                    ),
                    tabComponent: (
                        <StartPageWrapper>
                            <StartPageInfoWrapper>
                                <SWReactIcons iconName="info" size="xs" />
                                <StartPageInfoText>
                                    {i18n(
                                        "aquisitionintelligence.adCreativeResearch.searchTextAds.homepage.keyword.infoText",
                                    )}
                                </StartPageInfoText>
                            </StartPageInfoWrapper>
                            <StartPageAutoCompleteWrap>
                                <AutocompleteKeywords
                                    autocompleteProps={{
                                        placeholder: i18n(
                                            "aquisitionintelligence.adCreativeResearch.searchTextAds.homepage.keyword.searchPlaceHolder",
                                        ),
                                    }}
                                    selectedValue={seedKeyword}
                                    onClick={onClickSeedKeyword}
                                />
                                <StartPageCountryContainer>
                                    <CountryFilter
                                        width={228}
                                        height={40}
                                        availableCountries={availableKeywordsAdsCountries}
                                        changeCountry={changeKeywordsAdsCountry}
                                        selectedCountryIds={{
                                            [selectedKeywordsAdsCountryId]: true,
                                        }}
                                        dropdownPopupPlacement={"ontop-left"}
                                        dropdownPopupWidth={243}
                                    />
                                </StartPageCountryContainer>
                            </StartPageAutoCompleteWrap>
                            {seedKeyword && (
                                <StartPageFooter>
                                    <IconButton
                                        iconName="arrow-right"
                                        type="flat"
                                        onClick={onClickVisitTopAds}
                                    >
                                        {i18n(
                                            "aquisitionintelligence.adCreativeResearch.searchTextAds.homepage.keyword.cta.button",
                                        )}
                                    </IconButton>
                                </StartPageFooter>
                            )}
                        </StartPageWrapper>
                    ),
                },
                {
                    tabTitle: i18n(
                        "aquisitionintelligence.adCreativeResearch.searchTextAds.homepage.competition.tabTitle",
                    ),
                    tabComponent: (
                        <StartPageWrapper>
                            <StartPageInfoWrapper>
                                <SWReactIcons iconName="info" size="xs" />
                                <StartPageInfoText>
                                    {i18n(
                                        "aquisitionintelligence.adCreativeResearch.searchTextAds.homepage.competition.infoText",
                                    )}
                                </StartPageInfoText>
                            </StartPageInfoWrapper>
                            <StartPageAutoCompleteWrap>
                                <AutocompleteWebsitesRecent
                                    defaultWebsitePageState="findSearchTextAds_bycompetitor"
                                    defaultWebsitePageStateParams={{ selectedTab: "ads" }}
                                />
                            </StartPageAutoCompleteWrap>
                        </StartPageWrapper>
                    ),
                },
            ]}
        />
    );
};
