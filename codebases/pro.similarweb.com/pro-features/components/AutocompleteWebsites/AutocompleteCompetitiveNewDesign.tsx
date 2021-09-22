import { IChosenItem } from "../../../app/@types/chosenItems";
import { AutocompleteWebsitesCompareItem } from "components/AutocompleteWebsites/AutocompleteWebsitesCompareItem";
import { ISimilarSite, LoadingComponent } from "components/compare/WebsiteQueryBar";
import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { ISite } from "components/Workspace/Wizard/src/types";
import { IRecents } from "userdata";
import { IMarketingWorkspace } from "services/marketingWorkspaceApiService";
import { AutocompleteWebsitesRecentArenas } from "./AutocompleteWebsitesRecentArenas";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import { findParentByClass } from "@similarweb/ui-components/dist/utils";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { FakeInput } from "@similarweb/ui-components/dist/search-input";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { CenteredFlexRow, FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { NoDataWrapper } from "components/AutocompleteWebsites/styles";
import { SWReactIcons } from "@similarweb/icons";

const translate = i18nFilter();
const MAX_COMPARE_ITEMS = 4;

const Divider = styled.div`
    padding: 0 18px;
    font-family: ${$robotoFontFamily};
    letter-spacing: 0.7px;
    color: ${colorsPalettes.carbon[300]};
    font-size: 16px;
    font-weight: 500;
`;

const ItemsWrapper = styled.div`
    display: flex;
    align-items: baseline;
    min-height: 48px;
    width: 611px;
    border-radius: 8px;
    padding: 0 8px 0 8px;
`;

const FakeInputContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    width: 275px;
    border: 1px solid ${colorsPalettes.carbon[50]};
    height: 40px;
    border-radius: 3px;

    > div {
        height: 100%;
    }
    .ItemIcon {
        width: 28px;
        height: 28px;
    }

    .ListItemWebsite {
        padding: 11px 0px 10px 14px;
        height: 34px;
        width: 235px;
    }
    .ItemText {
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const AutocompleteTitle = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[400], $size: 14 })};
    margin-bottom: 8px;
`;

const AutocompleteCompetitorsTitle = styled(AutocompleteTitle)`
    display: flex;
    justify-content: space-between;
    min-width: 276px;
`;

const BoldText = styled.span`
    font-weight: 500;
`;

const NoDataIcon = styled(SWReactIcons)`
    height: 64px;
    width: 64px;
    margin: 20px 0 18px;
`;

const CompareItemSection = styled(FlexColumn)`
    align-items: flex-start;
    flex-wrap: nowrap;
    flex-grow: 1;
`;

const CompareItem = styled.div.attrs({
    className: "CompareItem",
})`
    margin-bottom: 4px;
`;

const SitesCounter = styled.span`
    color: ${colorsPalettes.carbon[300]};
`;

const AutocompleteSection = styled.div`
    position: relative;
`;

const AutocompleteWebsitesRecentArenasWrapper = styled.div<{ isOpen: boolean }>`
    width: ${({ isOpen }) => (isOpen ? `611` : `275`)}px;
`;

const Template = styled.div`
    height: 40px;
    width: 275px;
`;

const NoDataTextWrapper = styled.div<{ width?: number }>`
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
    font-size: 14px;
    margin-bottom: 57px;
    width: ${({ width = 142 }) => width}px;
    text-align: center;
`;

interface IAutocompleteCompetitiveProps {
    mainSite: ISite;
    onMainSiteAdd: (site: ISite) => void;
    onMainSiteRemove: () => void;
    compareSites: any;
    onCompareSitesAdd: (site) => void;
    onCompareSitesRemove: (site: ISite) => void;
    onSubmitClick?: () => void;
    recentSearches: IRecents;
    workspaces: IMarketingWorkspace[];
    similarSites?: ISimilarSite[];
    isFetching?: boolean;
    autocompleteProps?: any;
    openMainSiteAutocomplete?: boolean;
    openCompetitorsAutocomplete?: boolean;
    onAutocompleteFocus?: (type: string) => void;
    i18nKeys: Record<string, string>;
    autocompleteCompetitorsMissingTooltipKey?: string;
}

export const AutocompleteCompetitiveNewDesign: FunctionComponent<IAutocompleteCompetitiveProps> = ({
    mainSite,
    onMainSiteAdd,
    onMainSiteRemove,
    compareSites,
    onCompareSitesAdd,
    onCompareSitesRemove,
    autocompleteProps,
    recentSearches,
    workspaces,
    isFetching,
    similarSites,
    onSubmitClick,
    openMainSiteAutocomplete,
    openCompetitorsAutocomplete,
    onAutocompleteFocus,
    i18nKeys,
    autocompleteCompetitorsMissingTooltipKey,
}) => {
    const autoCompleteCompetitorsRef = useRef(null);
    const autoCompleteCompetitorsDropdownRef = useRef(null);
    const autoCompletePrimaryDropdownRef = useRef(null);
    const [isComparing, setIsComparing] = useState(false);
    const [isMainSiteAutocompleteTouched, setIsMainSiteAutocompleteTouched] = useState(false);
    const [isHideCompetitorsAutocomplete, setIsHideCompetitorsAutocomplete] = useState(false);
    const [isHideMainSiteAutocomplete, setIsHideMainSiteAutocomplete] = useState(false);
    const [inputValue, setInputValue] = useState(null);
    // A flag used for resolving the current desired behaviour of
    // pressing enter.
    const [hasEngagedAutocomplete, setHasEngagedAutocomplete] = useState(false);
    const [isCompetitorsAutocompleteTruncated, setIsCompetitorsAutocompleteTruncated] = useState(
        true,
    );
    const [isPrimaryAutocompleteTruncated, setIsPrimaryAutocompleteTruncated] = useState(true);

    useEffect(() => {
        document.body.addEventListener("click", handleBodyClick, { capture: true });

        return () => document.body.removeEventListener("click", handleBodyClick, { capture: true });
    }, []);

    const handleBodyClick = (e) => {
        if (
            !findParentByClass(e.target, "AutocompleteCompetitive") &&
            !findParentByClass(e.target, "CompareItem")
        ) {
            setIsComparing(false);
            autoCompleteCompetitorsRef?.current?.truncateResults(true);
        }
    };

    const handleMainSiteAdd = (item) => {
        onMainSiteAdd(item);
        if (!item.competitors || item?.competitors?.length === 0) {
            setIsComparing(true);
        }
        setInputValue(null);
        setHasEngagedAutocomplete(false);
        setIsPrimaryAutocompleteTruncated(true);
    };

    const handleMainSiteRemove = () => {
        onMainSiteRemove();
        setIsComparing(false);
        setInputValue(null);
        setHasEngagedAutocomplete(false);
    };

    const handleCompareSiteAdd = (item) => {
        setHasEngagedAutocomplete(false);
        setInputValue(null);
        onCompareSitesAdd(item);
        setIsComparing(false);
        setIsHideCompetitorsAutocomplete(true);
        setIsCompetitorsAutocompleteTruncated(true);
        // If user has added max allowed compare items, we don't reopen the autocomplete.
        // since the current item has not yet been updated, we add 1 to the value ie. + 1
        setTimeout(() => {
            setIsComparing(compareSites.length + 1 < MAX_COMPARE_ITEMS);
            setIsHideCompetitorsAutocomplete(false);
        }, 50);
    };

    const handleCompareSiteRemove = (item) => () => {
        onCompareSitesRemove(item);
        setIsCompetitorsAutocompleteTruncated(true);
        if (isComparing) {
            setIsComparing(false);
            setIsHideCompetitorsAutocomplete(true);

            // we need to close and reopen the autocomplete so that the list items are
            // updated with the current compare items. Otherwise, their closure contains
            // the competitors that existed when the autocomplete opened.
            setTimeout(() => {
                setIsComparing(true);
                setIsHideCompetitorsAutocomplete(false);
            }, 50);
        }
    };

    const onAutocompleteCompareCloseButtonClick = () => {
        setIsComparing(false);
        setInputValue(null);
        setHasEngagedAutocomplete(false);
    };

    const handleKeyPress = (event) => {
        setInputValue(event.target.value);
    };

    const onArrowKeyPress = () => {
        setHasEngagedAutocomplete(true);
    };

    useEffect(() => {
        if (openMainSiteAutocomplete) {
            setIsHideMainSiteAutocomplete(true);
            setTimeout(() => {
                setIsHideMainSiteAutocomplete(false);
            }, 0);
        }
    }, [openMainSiteAutocomplete]);

    useEffect(() => {
        if (openCompetitorsAutocomplete) {
            setIsHideCompetitorsAutocomplete(true);
            setIsComparing(true);
            setTimeout(() => {
                setIsHideCompetitorsAutocomplete(false);
            }, 0);
        }
    }, [openCompetitorsAutocomplete]);

    useEffect(() => {
        if (!isPrimaryAutocompleteTruncated) {
            if (!isMainSiteAutocompleteTouched) {
                setIsMainSiteAutocompleteTouched(true);
            }
            if (onAutocompleteFocus) {
                onAutocompleteFocus("primary");
            }
        }
    }, [isPrimaryAutocompleteTruncated]);

    const renderNoDataComponent = (text, textWidth?) => (
        <NoDataWrapper>
            <NoDataIcon iconName="affiliates-keyword" />
            <NoDataTextWrapper width={textWidth}>{translate(text)}</NoDataTextWrapper>
        </NoDataWrapper>
    );

    const renderNoDataSimilarsitesComponent = () =>
        renderNoDataComponent("autocomplete.competitive.competitors.no-data");

    const renderMainSiteNoDataComponent = () =>
        renderNoDataComponent("autocomplete.competitive.main-site.no-data", 218);

    const onCompetitorsFocus = () => {
        setIsComparing(true);
        if (onAutocompleteFocus) {
            onAutocompleteFocus("competitors");
        }
    };

    const mainSitePlaceholderAndIconColor = useMemo(() => {
        if (isMainSiteAutocompleteTouched && isPrimaryAutocompleteTruncated) {
            return colorsPalettes.blue[400];
        }
    }, [isPrimaryAutocompleteTruncated, isMainSiteAutocompleteTouched]);

    const competitorsPlaceholderAndIconColor = useMemo(() => {
        if ((mainSite || compareSites.length > 0) && isCompetitorsAutocompleteTruncated) {
            return colorsPalettes.blue[400];
        }
    }, [mainSite, isCompetitorsAutocompleteTruncated, compareSites]);

    const getExcludes = (): IChosenItem[] => {
        return mainSite ? [mainSite as IChosenItem, ...compareSites] : compareSites;
    };

    const scrollToBottom = (ref) => {
        ref?.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!isCompetitorsAutocompleteTruncated) {
            scrollToBottom(autoCompleteCompetitorsDropdownRef);
        }
        if (!isPrimaryAutocompleteTruncated) {
            scrollToBottom(autoCompletePrimaryDropdownRef);
        }
    }, [isCompetitorsAutocompleteTruncated, isPrimaryAutocompleteTruncated]);

    const getAutocompleteWebsitesCompareItem = (isDisabled) => {
        return (
            <AutocompleteWebsitesCompareItem
                className="AutocompleteCompetitive"
                onClick={handleCompareSiteAdd}
                similarSites={similarSites}
                excludes={getExcludes()}
                onCloseButtonClick={onAutocompleteCompareCloseButtonClick}
                renderNoDataSimilarsitesComponent={renderNoDataSimilarsitesComponent}
                autocompleteProps={{
                    placeholder: translate("autocomplete.competitive.placeholder.text.new"),
                    position: "relative",
                    top: compareSites.length > 0 && !isCompetitorsAutocompleteTruncated ? 8 : 0,
                    preventTruncateUnlessForced: isComparing,
                    autoFocus: openCompetitorsAutocomplete || isComparing,
                    isFocused: isComparing,
                    searchIcon: "add",
                    placeholderColor: competitorsPlaceholderAndIconColor,
                    iconColor: competitorsPlaceholderAndIconColor,
                    disabled: isDisabled,
                    onFocus: onCompetitorsFocus,
                    setIsResultsTruncated: setIsCompetitorsAutocompleteTruncated,
                    ...autocompleteProps,
                }}
                onKeyUp={handleKeyPress}
                onArrowKeyPress={onArrowKeyPress}
                overrideEnterFunc={
                    !hasEngagedAutocomplete && !inputValue?.trim() && compareSites.length > 0
                        ? onSubmitClick
                        : null
                }
                AutocompleteWidth={276}
                ref={autoCompleteCompetitorsRef}
                autoCompleteDropdownRef={autoCompleteCompetitorsDropdownRef}
            />
        );
    };

    return (
        <>
            <ItemsWrapper>
                <FlexColumn>
                    <AutocompleteTitle>
                        {translate(i18nKeys.i18nTitleKeyPartFirst)}{" "}
                        <BoldText>{translate(i18nKeys.i18nTitleKeyPartSecond)} </BoldText>
                        {translate(i18nKeys.i18nTitleKeyPartThird)}
                    </AutocompleteTitle>
                    <CenteredFlexRow>
                        {!isHideMainSiteAutocomplete ? (
                            !mainSite ? (
                                <AutocompleteWebsitesRecentArenasWrapper
                                    isOpen={!isPrimaryAutocompleteTruncated}
                                >
                                    <AutocompleteWebsitesRecentArenas
                                        excludes={compareSites}
                                        onClick={handleMainSiteAdd}
                                        recentSearches={recentSearches}
                                        workspaces={workspaces}
                                        autoCompleteDropdownRef={autoCompletePrimaryDropdownRef}
                                        renderNoDataComponent={renderMainSiteNoDataComponent}
                                        autocompleteProps={{
                                            placeholder: translate(
                                                "autocomplete.competitive.choose.website.new",
                                            ),
                                            searchIcon: "add",
                                            autoFocus: openMainSiteAutocomplete,
                                            placeholderColor: mainSitePlaceholderAndIconColor,
                                            iconColor: mainSitePlaceholderAndIconColor,
                                            setIsResultsTruncated: setIsPrimaryAutocompleteTruncated,
                                            ...autocompleteProps,
                                        }}
                                    />
                                </AutocompleteWebsitesRecentArenasWrapper>
                            ) : (
                                <FakeInputContainer>
                                    <FakeInput onClear={handleMainSiteRemove}>
                                        <div>
                                            <ListItemWebsite
                                                text={mainSite.name}
                                                img={mainSite.image}
                                            />
                                        </div>
                                    </FakeInput>
                                </FakeInputContainer>
                            )
                        ) : (
                            <Template />
                        )}
                        {isPrimaryAutocompleteTruncated && (
                            <Divider>{translate("autocomplete.competitive.vs")}</Divider>
                        )}
                    </CenteredFlexRow>
                </FlexColumn>
                {isPrimaryAutocompleteTruncated && (
                    <PlainTooltip
                        cssClass="plainTooltip-element"
                        tooltipContent={translate(autocompleteCompetitorsMissingTooltipKey)}
                        placement="top"
                        enabled={
                            !mainSite &&
                            compareSites.length === 0 &&
                            isCompetitorsAutocompleteTruncated
                        }
                        maxWidth={340}
                    >
                        <FlexColumn>
                            <AutocompleteCompetitorsTitle>
                                <div>
                                    {translate(i18nKeys.i18nSubTitleKeyPartFirst)}{" "}
                                    <BoldText>
                                        {translate(i18nKeys.i18nSubTitleKeyPartSecond)}{" "}
                                    </BoldText>
                                    {translate(i18nKeys.i18nSubTitleKeyPartThird)}{" "}
                                </div>
                                <SitesCounter>
                                    ({compareSites.length}/{MAX_COMPARE_ITEMS})
                                </SitesCounter>
                            </AutocompleteCompetitorsTitle>
                            <CompareItemSection>
                                {compareSites.length > 0 &&
                                    compareSites.map((compareSite) => {
                                        return (
                                            <CompareItem key={compareSite.name}>
                                                <FakeInputContainer>
                                                    <FakeInput
                                                        onClear={handleCompareSiteRemove(
                                                            compareSite,
                                                        )}
                                                    >
                                                        <div>
                                                            <ListItemWebsite
                                                                text={compareSite.name}
                                                                img={
                                                                    compareSite.image ??
                                                                    compareSite.icon
                                                                }
                                                            />
                                                        </div>
                                                    </FakeInput>
                                                </FakeInputContainer>
                                            </CompareItem>
                                        );
                                    })}
                                {compareSites.length < MAX_COMPARE_ITEMS && (
                                    <AutocompleteSection>
                                        {!mainSite && compareSites.length === 0 ? (
                                            getAutocompleteWebsitesCompareItem(true)
                                        ) : isFetching ? (
                                            <LoadingComponent
                                                loaderStyles={{ top: "0", width: 274 }}
                                                placeholderText={translate(
                                                    "autocomplete.competitive.placeholder.text",
                                                )}
                                                headerText={translate(
                                                    "autocomplete.websitesCompare.seperator.text.similarSites",
                                                )}
                                            />
                                        ) : (
                                            !isHideCompetitorsAutocomplete &&
                                            getAutocompleteWebsitesCompareItem(false)
                                        )}
                                    </AutocompleteSection>
                                )}
                            </CompareItemSection>
                        </FlexColumn>
                    </PlainTooltip>
                )}
            </ItemsWrapper>
        </>
    );
};
