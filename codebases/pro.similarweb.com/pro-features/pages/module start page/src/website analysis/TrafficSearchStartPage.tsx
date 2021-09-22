import { setIsGroupContext } from "actions/keywordGeneratorToolActions";
import { Injector } from "common/ioc/Injector";
import { AutocompleteKeywordGroups } from "components/AutocompleteKeywords/AutocompleteKeywordsGroups";
import LocationService from "components/Modals/src/UnlockModal/LocationService";
import { autocompleteStates } from "components/compare/WebsiteQueryBar";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import { FunctionComponent, useEffect, useState } from "react";
import * as React from "react";
import TabbedUseCaseHomepage from "@similarweb/ui-components/dist/homepages/tabbed-use-case/src/TabbedUseCaseHomepage";
import { AutocompleteWebCategories } from "components/AutocompleteWebCategories/AutocompleteWebCategories";
import { AutocompleteCompetitive } from "components/AutocompleteWebsites/AutocompleteCompetitive";
import { SWReactIcons } from "@similarweb/icons";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import * as utils from "components/filters-bar/utils";
import { swSettings } from "common/services/swSettings";
import { ICategory } from "common/services/categoryService.types";
import { DefaultFetchService } from "services/fetchService";
import { openUnlockModal } from "services/ModalService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { IRecents } from "userdata";
import { IMarketingWorkspace } from "services/marketingWorkspaceApiService";
import { connect } from "react-redux";
import { KeywordsGroupUtilities } from "UtilitiesAndConstants/UtilityFunctions/KeywordsGroupUtilities";
import swLog from "@similarweb/sw-log";
import {
    StartPageWrapper,
    StartPageInfoWrapper,
    StartPageInfoText,
    StartPageAutoCompleteWrap,
    StartPageCountryContainer,
    StartPageFooter,
} from "./StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import {
    arrow,
    KeywordGeneratorToolIcon1,
    KeywordGeneratorToolIcon2,
    KeywordGeneratorToolIcon3,
} from "pages/keyword-analysis/keyword-generator-tool/illustrations";
import {
    IllustrationContainer,
    SeparatorContainer,
} from "pages/keyword-analysis/keyword-generator-tool/styledComponents";
import { NoBorderTile } from "@similarweb/ui-components/dist/grouped-tiles";
const fetchService = DefaultFetchService.getInstance();
interface ITrafficSearchStartPageProps {
    visitKeywordGenerator: ({ keyword: string, country: number }) => void;
    visitTopKeywords: ({ category: string, country: number }) => void;
    visitTrafficSearch: ({ key: string }) => void;
    recentSearches: IRecents;
    workspaces: IMarketingWorkspace[];
    setIsGroupContext: (isGroupContext: boolean) => void;
}

export enum findKeywordsTypes {
    SeedKeyword,
    Industry,
    Competition,
}

const TrafficSearchStartPageInner: FunctionComponent<ITrafficSearchStartPageProps> = ({
    visitKeywordGenerator,
    visitTrafficSearch,
    visitTopKeywords,
    recentSearches,
    workspaces,
    setIsGroupContext,
}) => {
    const i18n = i18nFilter();
    const $rootScope = Injector.get("$rootScope") as any;
    const $modal = Injector.get<any>("$modal") as any;
    const [compareSites, setCompareSites] = useState([]);
    const [seedKeyword, setSeedKeyword] = useState({ keyword: "", isRecent: false });
    const [mainSite, setMainSite] = useState(null);
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

    const availableKeywordCountries = utils.getCountries(
        false,
        swSettings.components.KeywordsGenerator,
    );
    const availableIndustryCountries = utils.getCountries(
        false,
        swSettings.components.IndustryAnalysisTopKeywords,
    );
    const [selectedKeywordCountryId, setSelectedKeywordCountryId] = useState(
        availableKeywordCountries[0].id,
    );
    const [selectedIndustryCountryId, setSelectedIndustryCountryId] = useState(
        availableIndustryCountries[0].id,
    );
    const [selectedCategory, setSelectedCategory] = useState<ICategory>(null);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const onTabChange = (index) => {
        let selectedTabName = "";
        switch (index) {
            case findKeywordsTypes.SeedKeyword:
                selectedTabName = "Seed Keyword";
                break;
            case findKeywordsTypes.Industry:
                selectedTabName = "Industry";
                break;
            case findKeywordsTypes.Competition:
                selectedTabName = "Competition";
                break;
        }
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.buttons",
            "click",
            { selectedTabName },
        );
        setSelectedTab(index);
    };
    const onCompetitiveFocus = () => {
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.search.competitive",
            "open",
        );
    };
    const onCompareSitesAdd = (item) => {
        setCompareSites([...compareSites, item]);
        const similarSitesWithoutItem = similarSites.filter((site) => site.Domain !== item.name);
        setSimilarSites(similarSitesWithoutItem);
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.search.competitive",
            "click",
            { website: item.name },
        );
    };

    const onCompareSitesRemove = (item) => {
        const array = [...compareSites];
        const index = array.indexOf(item);
        array.splice(index, 1);
        setCompareSites(array);
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
        } else {
            setMainSite(item);
        }
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.search.competitive",
            "click",
            { website: item.name ? item.name : item.type },
        );
    };

    const onMainSiteRemove = () => {
        setMainSite(null);
        setCompareSites([]);
        setSimilarSites([]);
    };

    const onClickVisitKeywordGenerator = () => {
        const isRecentText = seedKeyword.isRecent ? "recent" : "Search_results";
        const isGroup = seedKeyword.keyword.startsWith("*");
        const groupName =
            isGroup &&
            `*${KeywordsGroupUtilities.getGroupNameById(seedKeyword.keyword.substring(1))}`;
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.by",
            "click",
            {
                isRecent: isRecentText,
                section: "keyword",
                search: isGroup ? groupName : seedKeyword.keyword,
            },
        );
        visitKeywordGenerator({ keyword: seedKeyword.keyword, country: selectedKeywordCountryId });
    };

    const onClickVisitTopKeywords = () => {
        const sectionTextForTrack = selectedCategory.isCustomCategory
            ? "Custom Industry"
            : "industry";
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.by",
            "click",
            {
                isRecent: "Search_results",
                section: sectionTextForTrack,
                search: selectedCategory.text,
            },
        );
        visitTopKeywords({ category: selectedCategory.forUrl, country: selectedIndustryCountryId });
    };

    const onClickSeedKeyword = (keyword, isGroupContext, isRecent) => {
        setSeedKeyword({ keyword, isRecent });
        setIsGroupContext(isGroupContext);
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.search.keyword",
            "click",
            { keyword: keyword },
        );
    };
    const onFocusSeedKeyword = () => {
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.search.keyword",
            "open",
        );
    };
    const changeKeywordCountry = (selectedCountry) => {
        setSelectedKeywordCountryId(selectedCountry.id);
    };
    const changeIndsustryCountry = (selectedCountry) => {
        setSelectedIndustryCountryId(selectedCountry.id);
    };
    const onClickCategory = (category: ICategory) => {
        setSelectedCategory(category);
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.search.industry",
            "click",
            { category: category.text },
        );
    };

    const onFocusCategory = () => {
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.search.industry",
            "open",
        );
    };

    const onCreateCustomCategoryClick = () => {
        // if (swSettings.components.Home.resources.IsCCAllowed) {
        //     TrackWithGuidService.trackWithGuid(
        //         "digital.marketing.keywords.research.find_keywords.by_industry.custom_category.empty_state.button",
        //         "click",
        //     );
        //     const scope = $rootScope.$new();
        //
        //     $modal.open({
        //         controller: "customCategoriesWizardCtrl as ctrl",
        //         templateUrl: "/app/components/customCategoriesWizard/custom-categories-wizard.html",
        //         windowClass: "swWizard customCategoriesWizardWindow",
        //         scope,
        //     });
        // } else {
        //     const unlockHook = { modal: "CustomCategories", slide: "NewCategory" };
        //     const location = `${LocationService.getCurrentLocation()}/New Category`;
        //     openUnlockModal(unlockHook, location);
        // }
    };
    const onClearSeedKeywordSearch = () => {
        setSeedKeyword({ keyword: "", isRecent: false });
    };

    const onClearWebCategoriesSearch = () => {
        setSelectedCategory(null);
    };

    const visitKeywords = () => {
        const names = [mainSite.name, ...compareSites.map((chip) => chip.name)].join(",");
        const mainSiteType = mainSite.type === "query" ? "search_result" : mainSite.type;
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.by",
            "click",
            { isRecent: mainSiteType ? mainSiteType : "arena", section: "website", search: names },
        );
        visitTrafficSearch({
            key: [mainSite.name, ...compareSites.map((chip) => chip.name)].join(","),
        });
    };
    return (
        <TabbedUseCaseHomepage
            title={i18n("aquisitionintelligence.keywordResearch.homepage.title")}
            subtitle={i18n("aquisitionintelligence.keywordResearch.homepage.subtitle")}
            subtitlePosition="centered"
            tabsTitle={i18n("aquisitionintelligence.keywordResearch.homepage.tabsTitle")}
            selectedTabIndex={selectedTab}
            onTabChange={onTabChange}
            headerImageUrl={SecondaryHomePageHeaderImageUrl}
            tabs={[
                {
                    tabTitle: i18n("aquisitionintelligence.keywordResearch.homepage.seed.tabTitle"),
                    tabComponent: (
                        <StartPageWrapper>
                            <StartPageInfoWrapper>
                                <SWReactIcons iconName="info" size="xs" />
                                <StartPageInfoText>
                                    {i18n(
                                        "aquisitionintelligence.keywordResearch.homepage.seed.infoText",
                                    )}
                                </StartPageInfoText>
                            </StartPageInfoWrapper>
                            <StartPageAutoCompleteWrap>
                                <AutocompleteKeywordGroups
                                    autocompleteProps={{
                                        onFocus: onFocusSeedKeyword,
                                        placeholder: i18n(
                                            "aquisitionintelligence.keywordResearch.homepage.seed.searchPlaceHolder",
                                        ),
                                    }}
                                    selectedValue={
                                        seedKeyword.keyword?.startsWith("*")
                                            ? KeywordsGroupUtilities.getGroupNameById(
                                                  seedKeyword.keyword.substring(1),
                                              )
                                            : seedKeyword.keyword
                                    }
                                    onClick={(keywordsObj: any) => {
                                        const isGroupContext = keywordsObj.hasOwnProperty(
                                            "GroupHash",
                                        );
                                        onClickSeedKeyword(
                                            isGroupContext
                                                ? "*" + keywordsObj.Id
                                                : keywordsObj.name,
                                            isGroupContext,
                                            keywordsObj.isRecent,
                                        );
                                    }}
                                    onClearSearch={onClearSeedKeywordSearch}
                                />
                                <StartPageCountryContainer>
                                    <CountryFilter
                                        width={228}
                                        height={40}
                                        availableCountries={availableKeywordCountries}
                                        changeCountry={changeKeywordCountry}
                                        selectedCountryIds={{
                                            [selectedKeywordCountryId]: true,
                                        }}
                                        dropdownPopupPlacement={"ontop-left"}
                                        dropdownPopupWidth={243}
                                    />
                                </StartPageCountryContainer>
                            </StartPageAutoCompleteWrap>
                            {seedKeyword.keyword && (
                                <StartPageFooter>
                                    <IconButton
                                        iconName="arrow-right"
                                        type="flat"
                                        onClick={onClickVisitKeywordGenerator}
                                    >
                                        {i18n(
                                            "aquisitionintelligence.keywordResearch.homepage.seed.cta",
                                        )}
                                    </IconButton>
                                </StartPageFooter>
                            )}
                        </StartPageWrapper>
                    ),
                },
                {
                    tabTitle: i18n(
                        "aquisitionintelligence.keywordResearch.homepage.market.tabTitle",
                    ),
                    tabComponent: (
                        <StartPageWrapper>
                            <StartPageInfoWrapper>
                                <SWReactIcons iconName="info" size="xs" />
                                <StartPageInfoText>
                                    {i18n(
                                        "aquisitionintelligence.keywordResearch.homepage.market.infoText",
                                    )}
                                </StartPageInfoText>
                            </StartPageInfoWrapper>
                            <StartPageAutoCompleteWrap>
                                <AutocompleteWebCategories
                                    showCustomCategoryEmptyState={true}
                                    onCreateCustomCategoryClick={onCreateCustomCategoryClick}
                                    selectedValue={selectedCategory}
                                    onClearSearch={onClearWebCategoriesSearch}
                                    onClick={onClickCategory}
                                    autocompleteProps={{
                                        onFocus: onFocusCategory,
                                        placeholder: i18n(
                                            "aquisitionintelligence.keywordResearch.homepage.market.searchPlaceHolder",
                                        ),
                                    }}
                                />
                                <StartPageCountryContainer>
                                    <CountryFilter
                                        width={228}
                                        height={40}
                                        availableCountries={availableIndustryCountries}
                                        changeCountry={changeIndsustryCountry}
                                        selectedCountryIds={{
                                            [selectedIndustryCountryId]: true,
                                        }}
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
                                            "aquisitionintelligence.keywordResearch.homepage.seed.cta",
                                        )}
                                    </IconButton>
                                </StartPageFooter>
                            )}
                        </StartPageWrapper>
                    ),
                },
                {
                    tabTitle: i18n(
                        "aquisitionintelligence.keywordResearch.homepage.competition.tabTitle",
                    ),
                    tabComponent: (
                        <StartPageWrapper>
                            <StartPageInfoWrapper>
                                <SWReactIcons iconName="info" size="xs" />
                                <StartPageInfoText>
                                    {i18n(
                                        "aquisitionintelligence.keywordResearch.homepage.competition.infoText",
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
                                    onSubmitClick={visitKeywords}
                                    autocompleteProps={{ onFocus: onCompetitiveFocus }}
                                />
                            </StartPageAutoCompleteWrap>
                            {mainSite && compareSites.length > 0 && (
                                <StartPageFooter>
                                    <IconButton
                                        iconName="arrow-right"
                                        type="flat"
                                        onClick={visitKeywords}
                                    >
                                        {i18n(
                                            "aquisitionintelligence.keywordResearch.homepage.seed.cta",
                                        )}
                                    </IconButton>
                                </StartPageFooter>
                            )}
                        </StartPageWrapper>
                    ),
                },
            ]}
        >
            {selectedTab === 0 && (
                <IllustrationContainer>
                    <NoBorderTile
                        icon={KeywordGeneratorToolIcon1}
                        text={i18n("keyword.generator.tool.page.illustration.one.text")}
                        title={i18n("keyword.generator.tool.page.illustration.one.title")}
                    />
                    <SeparatorContainer>{arrow}</SeparatorContainer>
                    <NoBorderTile
                        icon={KeywordGeneratorToolIcon2}
                        text={i18n("keyword.generator.tool.page.illustration.two.text")}
                        title={i18n("keyword.generator.tool.page.illustration.two.title")}
                    />
                    <SeparatorContainer>{arrow}</SeparatorContainer>
                    <NoBorderTile
                        icon={KeywordGeneratorToolIcon3}
                        text={i18n("keyword.generator.tool.page.illustration.three.text")}
                        title={i18n("keyword.generator.tool.page.illustration.three.title")}
                    />
                </IllustrationContainer>
            )}
        </TabbedUseCaseHomepage>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        setIsGroupContext: (isGroupContext) => {
            dispatch(setIsGroupContext(isGroupContext));
        },
    };
};

export const TrafficSearchStartPage = connect(
    undefined,
    mapDispatchToProps,
)(TrafficSearchStartPageInner);
