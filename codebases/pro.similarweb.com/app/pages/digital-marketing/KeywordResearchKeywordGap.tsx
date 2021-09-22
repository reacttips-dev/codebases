import { Injector } from "common/ioc/Injector";
import UseCaseHomePage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import { SwNavigator } from "common/services/swNavigator";
import { autocompleteStates } from "components/compare/WebsiteQueryBar";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import * as React from "react";
import { AssetsService } from "services/AssetsService";
import { DefaultFetchService } from "services/fetchService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    IMarketingWorkspace,
    marketingWorkspaceApiService,
} from "services/marketingWorkspaceApiService";
import swLog from "@similarweb/sw-log";
import { i18nFilter } from "filters/ngFilters";
import { iconTypes } from "UtilitiesAndConstants/Constants/IconTypes";
import { RecentService } from "services/recent/recentService";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { AutocompleteCompetitiveNewDesign } from "components/AutocompleteWebsites/AutocompleteCompetitiveNewDesign";
import {
    SearchComponentsWrapper,
    StyledIconButtonWrapper,
    StyledIconButton,
} from "pages/digital-marketing/find-affiliate/home-pages/FindAffiliateByCompetitionHomePage";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import { BoldText } from "pages/workspace/marketing/highlights/StyledComponents";

const fetchService = DefaultFetchService.getInstance();
const DEFAULT_SEPARATOR = ",";

export enum ESelectedTypes {
    ARENA = "arena",
    QUERY = "query",
    RECENT = "recent",
    SEARCH_RESULT = "search_result",
    QUERY_PARAM = "query_param",
}

export const SecondaryHomePageHeaderImageUrl = AssetsService.assetUrl(
    "/images/secondary-home-page-header.png",
);

const KeywordResearchKeywordGapHomepage: FunctionComponent = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { chosenSiteName, chosenSiteFavicon } = swNavigator.getParams();
    const recentSearches = RecentService.getRecents();
    const i18n = i18nFilter();
    const [compareSites, setCompareSites] = useState([]);
    const [isShowSubmitBtnTooltip, setIsShowSubmitBtnTooltip] = useState(false);
    const [isMainSiteAutocompleteOpen, setISMainSiteAutocompleteOpen] = useState(false);
    const [isCompetitorsAutocompleteOpen, setIsCompetitorsAutocompleteOpen] = useState(false);

    const [mainSite, setMainSite] = useState<{
        name: string;
        image: string;
        type?: ESelectedTypes;
    }>(
        chosenSiteName && chosenSiteFavicon
            ? {
                  name: chosenSiteName,
                  image: decodeURIComponent(chosenSiteFavicon),
                  type: ESelectedTypes.QUERY_PARAM,
              }
            : null,
    );
    const [isFetching, setIsFetching] = useState(false);
    const [similarSites, setSimilarSites] = useState([]);
    const [workspaces, setWorkspaces] = useState<IMarketingWorkspace[]>([]);
    const popupRef = useRef<PopupClickContainer>();

    useEffect(() => {
        if (isShowSubmitBtnTooltip) {
            popupRef.current.openPopup();
            setTimeout(() => {
                setIsShowSubmitBtnTooltip(false);
                if (isMainSiteAutocompleteOpen) {
                    setISMainSiteAutocompleteOpen(false);
                }
                if (isCompetitorsAutocompleteOpen) {
                    setIsCompetitorsAutocompleteOpen(false);
                }
                popupRef.current.closePopup();
            }, 3000);
        } else {
            popupRef.current.closePopup();
        }
    }, [isShowSubmitBtnTooltip]);

    useEffect(() => {
        async function getSimilarSites() {
            setIsFetching(true);
            let similarSites;
            try {
                similarSites = await fetchService.get(`/api/WebsiteOverview/getsimilarsites`, {
                    key: mainSite.name,
                    limit: 20,
                });
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
        marketingWorkspaceApiService.getMarketingWorkspaces().then((workspaces) => {
            setWorkspaces(workspaces);
        });
    }, [mainSite?.name]);

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
            "digital.marketing.keywords.research.find.keywords.search.competitive.compare",
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
    const showPage = (item) => {
        return item.allies && item.competitors && item.competitors.length > 0;
    };

    const onMainSiteAdd = (item) => {
        let chosenSitesNames;
        if (showPage(item)) {
            const compareSites = item.competitors.map((competitor) => {
                return { name: competitor.domain, image: competitor.favicon };
            });
            const compareSitesNames = compareSites.map((site) => site.name).join(DEFAULT_SEPARATOR);
            chosenSitesNames = [item.allies[0].domain, compareSitesNames].join(DEFAULT_SEPARATOR);
            visitTrafficSearch({
                key: chosenSitesNames,
            });
        } else {
            if (item.allies) {
                const { allies } = item;
                const mainSite = {
                    name: allies[0].domain,
                    image: allies[0].favicon,
                    type: item.type,
                };
                setMainSite(mainSite);
                chosenSitesNames = mainSite.name;
            } else {
                setMainSite(item);
                chosenSitesNames = item.name;
            }
        }
        TrackWithGuidService.trackWithGuid(
            "digital.marketing.keywords.research.find.keywords.search.competitive.main.site",
            "click",
            { website: chosenSitesNames, type: item.type },
        );
    };

    const onMainSiteRemove = () => {
        setMainSite(null);
    };

    const visitTrafficSearch = ({ key }) => {
        swNavigator.go("findkeywords_bycompetition", {
            key,
            isWWW: "*",
            IncludeNoneBranded: true,
        });
    };

    const visitKeywords = () => {
        if (!mainSite && compareSites.length < 2) {
            setIsShowSubmitBtnTooltip(true);
            setISMainSiteAutocompleteOpen(true);
            TrackWithGuidService.trackWithGuid(
                "keyword.research.homepage.find.keywords.by.kap.button.submit.error",
                "submit-error-client",
            );
        } else if (compareSites.length === 0) {
            setIsShowSubmitBtnTooltip(true);
            setIsCompetitorsAutocompleteOpen(true);
            TrackWithGuidService.trackWithGuid(
                "keyword.research.homepage.find.keywords.by.kap.button.submit.error",
                "submit-error-client",
            );
        } else {
            popupRef.current.closePopup();
            const names = mainSite?.name
                ? [mainSite.name, ...compareSites.map((chip) => chip.name)].join(DEFAULT_SEPARATOR)
                : [...compareSites.map((chip) => chip.name)].join(DEFAULT_SEPARATOR);
            const mainSiteType = mainSite?.type;
            TrackWithGuidService.trackWithGuid(
                "digital.marketing.keywords.research.find.keywords.by",
                "click",
                {
                    isRecent: mainSiteType,
                    section: "website",
                    search: names,
                },
            );
            visitTrafficSearch({
                key: names,
            });
        }
    };

    const getSubmitButtonTooltipContent = () =>
        !mainSite ? (
            <>
                {i18n(
                    "keyword.research.homepage.find.keywords.by.gap.submit.button.disable.part.1",
                )}{" "}
                <BoldText>
                    {i18n(
                        "keyword.research.homepage.find.keywords.by.gap.submit.button.disable.part.2",
                    )}{" "}
                </BoldText>
                {i18n(
                    "keyword.research.homepage.find.keywords.by.gap.submit.button.disable.part.3",
                )}
            </>
        ) : (
            <>
                {i18n(
                    "affiliate.research.homepage.find.affiliates.by.competition.submit.button.missing.competitors",
                )}
            </>
        );

    const i18nKeys = {
        i18nTitleKeyPartFirst: "autocomplete.competitive.main.site.title.first.part",
        i18nTitleKeyPartSecond: "autocomplete.keywords.gap.main.site.title.second.part",
        i18nTitleKeyPartThird: "autocomplete.competitive.main.site.title.third.part",
        i18nSubTitleKeyPartFirst: "autocomplete.competitive.competitor.title.first.part",
        i18nSubTitleKeyPartSecond: "autocomplete.keywords.gap.main.site.title.second.part",
        i18nSubTitleKeyPartThird: "autocomplete.competitive.competitor.title.third.part",
    };

    return (
        <UseCaseHomePage
            icon={{ name: iconTypes.KEYWORD_GAP, size: "xxl" }}
            paddingBottom={"23px"}
            title={i18n("digitalMarketing.findKeywords.keywordGap.title")}
            subtitle={i18n("digitalMarketing.findKeywords.keywordGap.subTitle")}
            titlePosition="centered"
            bodyMaxWidth={802}
            width={"100%"}
            showSearchComponentsInTheBody={true}
            headerImageUrl={SecondaryHomePageHeaderImageUrl}
            searchComponents={
                <SearchComponentsWrapper>
                    <FlexRow>
                        <div>
                            <AutocompleteCompetitiveNewDesign
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
                                openMainSiteAutocomplete={isMainSiteAutocompleteOpen}
                                openCompetitorsAutocomplete={isCompetitorsAutocompleteOpen}
                                onAutocompleteFocus={onCompetitiveFocus}
                                i18nKeys={i18nKeys}
                                autocompleteCompetitorsMissingTooltipKey={
                                    "keywords.autocomplete.competitive.competitors.missing"
                                }
                            />
                        </div>
                        <PopupClickContainer
                            ref={popupRef}
                            content={() => getSubmitButtonTooltipContent()}
                            config={{
                                placement: "top",
                                cssClass: "PlainTooltip-element",
                                cssClassContent: "PlainTooltip-content",
                                enabled: isShowSubmitBtnTooltip,
                            }}
                            appendTo={".submit-button"}
                        >
                            <StyledIconButtonWrapper className={"submit-button"}>
                                <StyledIconButton
                                    iconName="arrow-right"
                                    type="primary"
                                    onClick={visitKeywords}
                                    isDisabled={isShowSubmitBtnTooltip}
                                >
                                    {i18n(
                                        "aquisitionintelligence.keywordResearch.homepage.seed.cta",
                                    )}
                                </StyledIconButton>
                            </StyledIconButtonWrapper>
                        </PopupClickContainer>
                    </FlexRow>
                </SearchComponentsWrapper>
            }
        />
    );
};

SWReactRootComponent(KeywordResearchKeywordGapHomepage, "KeywordResearchKeywordGapHomepage");
