import { autocompleteStates } from "components/compare/WebsiteQueryBar";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import React, { FunctionComponent, useEffect, useState } from "react";
import TabbedUseCaseHomepage from "@similarweb/ui-components/dist/homepages/tabbed-use-case/src/TabbedUseCaseHomepage";
import { SWReactIcons } from "@similarweb/icons";
import { AutocompleteWebCategories } from "components/AutocompleteWebCategories/AutocompleteWebCategories";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { AutocompleteCompetitive } from "components/AutocompleteWebsites/AutocompleteCompetitive";
import * as utils from "components/filters-bar/utils";
import { ICategory } from "common/services/categoryService.types";
import { swSettings } from "common/services/swSettings";
import { DefaultFetchService } from "services/fetchService";
import { IRecents } from "userdata";
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
import swLog from "@similarweb/sw-log";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const fetchService = DefaultFetchService.getInstance();

interface IMediaBuyingAdNetworksStartPageProps {
    visitTrafficChannels: ({ category: string, country: number }) => void;
    visitUserAcquisitionNetworks: ({ key: string }) => void;
    recentSearches: IRecents;
    workspaces: IMarketingWorkspace[];
}

export const MediaBuyingAdNetworksStartPage: FunctionComponent<IMediaBuyingAdNetworksStartPageProps> = ({
    visitTrafficChannels,
    visitUserAcquisitionNetworks,
    recentSearches,
    workspaces,
}) => {
    const i18n = i18nFilter();
    const [mainSite, setMainSite] = useState(null);
    const [compareSites, setCompareSites] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [similarSites, setSimilarSites] = useState([]);

    useEffect(() => {
        async function getSimilarSites() {
            setIsFetching(true);
            let similarSites;
            try {
                similarSites = await fetchService.get(
                    `/api/WebsiteOverview/getsimilarsites?key=${mainSite.name}&limit=20`,
                );
            } catch (e) {
                swLog.error(`Error fetching similarSites - TrafficSearchStartPageInner -- ${e}`);
                return [autocompleteStates.ERROR];
            }
            if (!similarSites?.length) {
                similarSites[0] = autocompleteStates.NO_DATA_SIMILARSITES;
            }
            setSimilarSites(similarSites);
            setIsFetching(false);
        }
        if (mainSite?.name) {
            getSimilarSites();
        }
    }, [mainSite?.name]);

    const availableIndustryCountries = utils.getCountries(
        false,
        swSettings.components.IndustryAnalysisTopKeywords,
    );
    const [selectedIndustryCountryId, setSelectedIndustryCountryId] = useState(
        availableIndustryCountries[0].id,
    );
    const [selectedCategory, setSelectedCategory] = useState<ICategory>(null);
    const onClickCategory = (category: ICategory) => {
        setSelectedCategory(category);
        if (category.isCustomCategory) {
            TrackWithGuidService.trackWithGuid(
                "marketingintelligence.mediabuyingadnetwork.homepage.custom.industry.select",
                "click",
                { SelectedCustomIndustry: category.text },
            );
        } else {
            TrackWithGuidService.trackWithGuid(
                "marketingintelligence.mediabuyingadnetwork.homepage.industry.select",
                "click",
                { SelectedIndustry: category.text },
            );
        }
    };
    const changeIndustryCountry = (selectedCountry) => {
        setSelectedIndustryCountryId(selectedCountry.id);
    };
    const onClickVisitTopKeywords = () => {
        visitTrafficChannels({
            category: selectedCategory.forUrl,
            country: selectedIndustryCountryId,
        });
    };
    const onClickVisitIncomingTraffic = () => {
        visitUserAcquisitionNetworks({
            key: [mainSite.name, ...compareSites.map((chip) => chip.name)].join(","),
        });
    };
    const onMainSiteAdd = (item) => {
        if (item.allies) {
            const { allies, competitors } = item;
            const mainSite = {
                name: allies[0].domain,
                image: allies[0].favicon,
            };
            setMainSite(mainSite);
            const compareSites = competitors.map((competitor) => {
                return { name: competitor.domain, image: competitor.favicon };
            });
            setCompareSites(compareSites);
            TrackWithGuidService.trackWithGuid(
                "marketingintelligence.mediabuyingadnetwork.homepage.competition.first.competitor",
                "click",
            );
        } else {
            setMainSite(item);
            TrackWithGuidService.trackWithGuid(
                "marketingintelligence.mediabuyingadnetwork.homepage.competition.first.competitors",
                "click",
            );
        }
    };
    const onMainSiteRemove = () => {
        setMainSite(null);
        setCompareSites([]);
        setSimilarSites([]);
    };
    const onCompareSitesRemove = (item) => {
        const array = [...compareSites];
        const index = array.indexOf(item);
        array.splice(index, 1);
        setCompareSites(array);
    };
    const onCompareSitesAdd = (item) => {
        setCompareSites([...compareSites, item]);
        const similarSitesWithoutItem = similarSites.filter((site) => site.Domain !== item.name);
        setSimilarSites(similarSitesWithoutItem);
        TrackWithGuidService.trackWithGuid(
            "marketingintelligence.mediabuyingadnetwork.homepage.competition.competitors.button",
            "click",
        );
    };
    const onClearWebCategoriesSearch = () => {
        setSelectedCategory(null);
    };
    const onTabChange = (index) => {
        TrackWithGuidService.trackWithGuid(
            "marketingintelligence.mediaBuyingadnetworks.homepage.buttons",
            "click",
            { SelectedTabName: index === 0 ? "Industry" : "Competition" },
        );
    };
    const onFocusWebsite = () => {
        TrackWithGuidService.trackWithGuid(
            "marketingintelligence.mediabuyingadnetworks.homepage.competition.search",
            "open",
        );
    };
    const onFocusIndustry = () => {
        TrackWithGuidService.trackWithGuid(
            "marketingintelligence.mediabuyingadnetworks.homepage.industry.search",
            "open",
        );
    };

    return (
        <TabbedUseCaseHomepage
            title={i18n("aquisitionintelligence.mediaBuying.adNetworks.homepage.title")}
            subtitle={i18n("aquisitionintelligence.mediaBuying.adNetworks.homepage.subtitle")}
            subtitlePosition="centered"
            tabsTitle={i18n("aquisitionintelligence.mediaBuying.adNetworks.homepage.tabsTitle")}
            headerImageUrl={SecondaryHomePageHeaderImageUrl}
            onTabChange={onTabChange}
            tabs={[
                {
                    tabTitle: i18n(
                        "aquisitionintelligence.mediaBuying.adNetworks.homepage.market.tabTitle",
                    ),
                    tabComponent: (
                        <StartPageWrapper>
                            <StartPageInfoWrapper>
                                <SWReactIcons iconName="info" size="xs" />
                                <StartPageInfoText>
                                    {i18n(
                                        "aquisitionintelligence.mediaBuying.adNetworks.homepage.market.infoText",
                                    )}
                                </StartPageInfoText>
                            </StartPageInfoWrapper>
                            <StartPageAutoCompleteWrap>
                                <AutocompleteWebCategories
                                    selectedValue={selectedCategory}
                                    onClick={onClickCategory}
                                    autocompleteProps={{
                                        onFocus: onFocusIndustry,
                                        placeholder: i18n(
                                            "aquisitionintelligence.mediaBuying.adNetworks.homepage.market.searchPlaceHolder",
                                        ),
                                    }}
                                    onClearSearch={onClearWebCategoriesSearch}
                                />
                                <StartPageCountryContainer>
                                    <CountryFilter
                                        width={228}
                                        height={40}
                                        availableCountries={availableIndustryCountries}
                                        changeCountry={changeIndustryCountry}
                                        selectedCountryIds={{ [selectedIndustryCountryId]: true }}
                                        dropdownPopupPlacement={"ontop-left"}
                                        dropdownPopupWidth={243}
                                    />
                                </StartPageCountryContainer>
                            </StartPageAutoCompleteWrap>
                            {selectedCategory && (
                                <StartPageFooter>
                                    <IconButton
                                        iconName="arrow-right"
                                        type="flat"
                                        onClick={onClickVisitTopKeywords}
                                    >
                                        {i18n(
                                            "aquisitionintelligence.mediaBuying.adNetworks.homepage.market.cta",
                                        )}
                                    </IconButton>
                                </StartPageFooter>
                            )}
                        </StartPageWrapper>
                    ),
                },
                {
                    tabTitle: i18n(
                        "aquisitionintelligence.mediaBuying.adNetworks.homepage.competition.tabTitle",
                    ),
                    tabComponent: (
                        <StartPageWrapper>
                            <StartPageInfoWrapper>
                                <SWReactIcons iconName="info" size="xs" />
                                <StartPageInfoText>
                                    {i18n(
                                        "aquisitionintelligence.mediaBuying.adNetworks.homepage.competition.infoText",
                                    )}
                                </StartPageInfoText>
                            </StartPageInfoWrapper>
                            <StartPageAutoCompleteWrap>
                                <AutocompleteCompetitive
                                    mainSite={mainSite}
                                    onMainSiteAdd={onMainSiteAdd}
                                    onMainSiteRemove={onMainSiteRemove}
                                    compareSites={compareSites}
                                    onCompareSitesAdd={onCompareSitesAdd}
                                    onCompareSitesRemove={onCompareSitesRemove}
                                    recentSearches={recentSearches}
                                    workspaces={workspaces}
                                    isFetching={isFetching}
                                    similarSites={similarSites}
                                    onSubmitClick={onClickVisitIncomingTraffic}
                                    autocompleteProps={{ onFocus: onFocusWebsite }}
                                />
                            </StartPageAutoCompleteWrap>
                            {mainSite && compareSites.length > 0 && (
                                <StartPageFooter>
                                    <IconButton
                                        iconName="arrow-right"
                                        type="flat"
                                        onClick={onClickVisitIncomingTraffic}
                                    >
                                        {i18n(
                                            "aquisitionintelligence.mediaBuying.adNetworks.homepage.competition.cta",
                                        )}
                                    </IconButton>
                                </StartPageFooter>
                            )}
                        </StartPageWrapper>
                    ),
                },
            ]}
        />
    );
};
