import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { i18nFilter } from "filters/ngFilters";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import UseCaseHomePage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import { AutocompleteCompetitiveNewDesign } from "components/AutocompleteWebsites/AutocompleteCompetitiveNewDesign";
import { IRecents } from "userdata";
import { IMarketingWorkspace } from "services/marketingWorkspaceApiService";
import { autocompleteStates } from "components/compare/WebsiteQueryBar";
import { DefaultFetchService } from "services/fetchService";
import swLog from "@similarweb/sw-log";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";

interface IFindAffiliateByCompetitionHomePageProps {
    visitIncomingTraffic: ({ key: string }) => void;
    recentSearches: IRecents;
    workspaces: IMarketingWorkspace[];
}

export const StyledIconButtonWrapper = styled.div`
    top: 30px;
    position: relative;
    height: fit-content;
`;

export const StyledIconButton = styled(IconButton)`
    min-width: 156px;
    margin-left: 18px;
`;

const BoldText = styled.span`
    font-weight: 500;
`;

export const SearchComponentsWrapper = styled.div`
    min-height: 400px;
`;

const fetchService = DefaultFetchService.getInstance();

export const FindAffiliateByCompetitionHomePage: FunctionComponent<IFindAffiliateByCompetitionHomePageProps> = ({
    visitIncomingTraffic,
    recentSearches,
    workspaces,
}) => {
    const i18n = i18nFilter();
    const [mainSite, setMainSite] = useState(null);
    const [isShowSubmitBtnTooltip, setIsShowSubmitBtnTooltip] = useState(false);
    const [compareSites, setCompareSites] = useState([]);
    const [isMainSiteAutocompleteOpen, setISMainSiteAutocompleteOpen] = useState(false);
    const [isCompetitorsAutocompleteOpen, setIsCompetitorsAutocompleteOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [similarSites, setSimilarSites] = useState([]);
    const [isAutoSubmit, setIsAutoSubmit] = useState(false);
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

    useEffect(() => {
        if (similarSites?.length === compareSites?.length) {
            similarSites[0] = autocompleteStates.NO_DATA_SIMILARSITES;
        }
    }, [compareSites]);

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

            if (compareSites.length > 0) {
                setCompareSites(compareSites);
                setIsAutoSubmit(true);
            }

            TrackWithGuidService.trackWithGuid(
                "affiliate.research.homepage.find.affiliates.by.competition.primary.site.added.from.list",
                "click",
                { Domain: item.name },
            );
        } else {
            setMainSite(item);

            TrackWithGuidService.trackWithGuid(
                "affiliate.research.homepage.find.affiliates.by.competition.primary.site.entered",
                "click",
                { Domain: item.name },
            );
        }
    };

    const onMainSiteRemove = () => {
        setMainSite(null);
        TrackWithGuidService.trackWithGuid(
            "affiliate.research.homepage.find.affiliates.by.competition.primary.site.removed",
            "remove",
        );
    };

    const onCompareSitesRemove = (item) => {
        const array = [...compareSites];
        const index = array.indexOf(item);
        array.splice(index, 1);
        setCompareSites(array);
        TrackWithGuidService.trackWithGuid(
            "affiliate.research.homepage.find.affiliates.by.competition.competitor.site.removed",
            "remove",
        );
    };

    const onCompareSitesAdd = (item) => {
        const updatedCompareSites = [...compareSites, item];
        setCompareSites(updatedCompareSites);
        if (updatedCompareSites.length > 1) {
            TrackWithGuidService.trackWithGuid(
                "affiliate.research.homepage.find.affiliates.by.competition.second.third.fourth.competitor.site.added",
                "add",
                { Domain: item.name },
            );
        } else {
            TrackWithGuidService.trackWithGuid(
                "affiliate.research.homepage.find.affiliates.by.competition.first.site.added",
                "click",
                { Domain: item.name },
            );
        }
    };

    const getSubmitButtonTooltipContent = () =>
        !mainSite ? (
            <>
                {i18n(
                    "affiliate.research.homepage.find.affiliates.by.competition.submit.button.disable.part.1",
                )}{" "}
                <BoldText>
                    {i18n(
                        "affiliate.research.homepage.find.affiliates.by.competition.submit.button.disable.part.2",
                    )}{" "}
                </BoldText>
                {i18n(
                    "affiliate.research.homepage.find.affiliates.by.competition.submit.button.disable.part.3",
                )}
            </>
        ) : (
            <>
                {i18n(
                    "affiliate.research.homepage.find.affiliates.by.competition.submit.button.missing.competitors",
                )}
            </>
        );

    useEffect(() => {
        if (isAutoSubmit) {
            onClickVisitIncomingTraffic();
        }
    }, [isAutoSubmit]);

    const onClickVisitIncomingTraffic = () => {
        if (!mainSite && compareSites.length < 2) {
            setIsShowSubmitBtnTooltip(true);
            setISMainSiteAutocompleteOpen(true);
            TrackWithGuidService.trackWithGuid(
                "affiliate.research.homepage.find.affiliates.by.competition.button.submit.error",
                "submit-error-client",
            );
        } else if (compareSites.length === 0) {
            setIsShowSubmitBtnTooltip(true);
            setIsCompetitorsAutocompleteOpen(true);
            TrackWithGuidService.trackWithGuid(
                "affiliate.research.homepage.find.affiliates.by.competition.button.submit.error",
                "submit-error-client",
            );
        } else {
            popupRef.current.closePopup();
            const key = mainSite?.name
                ? [mainSite.name, ...compareSites.map((chip) => chip.name)].join(",")
                : [...compareSites.map((chip) => chip.name)].join(",");

            TrackWithGuidService.trackWithGuid(
                "affiliate.research.homepage.find.affiliates.by.competition.button.submit.ok",
                "submit-ok",
                {
                    input: key,
                },
            );
            visitIncomingTraffic({ key });
        }
    };

    const onAutocompleteFocus = (type) => {
        if (type === "primary") {
            TrackWithGuidService.trackWithGuid(
                "affiliate.research.homepage.find.affiliates.by.competition.primary.dropdown.focus",
                "open",
            );
        } else {
            TrackWithGuidService.trackWithGuid(
                "affiliate.research.homepage.find.affiliates.by.competition.competitors.dropdown.focus",
                "open",
            );
        }
    };

    const i18nKeys = {
        i18nTitleKeyPartFirst: "autocomplete.competitive.main.site.title.first.part",
        i18nTitleKeyPartSecond: "autocomplete.competitive.main.site.title.second.part",
        i18nTitleKeyPartThird: "autocomplete.competitive.main.site.title.third.part",
        i18nSubTitleKeyPartFirst: "autocomplete.competitive.competitor.title.first.part",
        i18nSubTitleKeyPartSecond: "autocomplete.competitive.competitor.title.second.part",
        i18nSubTitleKeyPartThird: "autocomplete.competitive.competitor.title.third.part",
    };

    return (
        <div data-automation="find-affiliates-by-competition">
            <UseCaseHomePage
                icon={{ name: "affiliates-competition", size: "xxl" }}
                showSearchComponentsInTheBody={true}
                paddingBottom="23px"
                title={i18n("aquisitionintelligence.findaffiliates.bycompetition.title")}
                titlePosition="centered"
                subtitle={i18n("aquisitionintelligence.findaffiliates.bycompetition.subtitle")}
                bodyMaxWidth={802}
                width={"100%"}
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
                                    onSubmitClick={onClickVisitIncomingTraffic}
                                    openMainSiteAutocomplete={isMainSiteAutocompleteOpen}
                                    openCompetitorsAutocomplete={isCompetitorsAutocompleteOpen}
                                    onAutocompleteFocus={onAutocompleteFocus}
                                    i18nKeys={i18nKeys}
                                    autocompleteCompetitorsMissingTooltipKey={
                                        "autocomplete.competitive.competitors.missing"
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
                                        onClick={onClickVisitIncomingTraffic}
                                        isDisabled={isShowSubmitBtnTooltip}
                                    >
                                        {i18n(
                                            "aquisitionintelligence.affiliateResearch.homepage.cta",
                                        )}
                                    </StyledIconButton>
                                </StyledIconButtonWrapper>
                            </PopupClickContainer>
                        </FlexRow>
                    </SearchComponentsWrapper>
                }
            />
        </div>
    );
};
