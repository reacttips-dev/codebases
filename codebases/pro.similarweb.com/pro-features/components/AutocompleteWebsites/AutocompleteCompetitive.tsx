import { SWReactIcons } from "@similarweb/icons";
import { IChosenItem } from "../../../app/@types/chosenItems";
import { AutocompleteWebsitesCompareItem } from "components/AutocompleteWebsites/AutocompleteWebsitesCompareItem";
import { ISimilarSite, LoadingComponent } from "components/compare/WebsiteQueryBar";
import React, { FunctionComponent, useEffect, useState } from "react";
import { ISite } from "components/Workspace/Wizard/src/types";
import { IRecents } from "userdata";
import { IMarketingWorkspace } from "services/marketingWorkspaceApiService";
import { AutocompleteWebsitesRecentArenas } from "./AutocompleteWebsitesRecentArenas";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";
import { QueryBarWebsiteItem } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItems/QueryBarWebsiteItem";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import { findParentByClass } from "@similarweb/ui-components/dist/utils";

const translate = i18nFilter();
const MAX_COMPARE_ITEMS = 4;

const Divider = styled.div`
    padding: 0 13px;
    font-family: ${$robotoFontFamily};
    letter-spacing: 0.7px;
    color: rgba(14, 30, 62, 0.5);
    margin: 0 16px;
    font-size: 16px;
`;

const ItemsWrapper = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #eceef0;
    min-height: 48px;
    width: 638px;
    border-radius: 8px;
    padding: 0 8px 0 16px;
`;

const MainItemSection = styled.div``;

const IconSection = styled.div`
    width: 24px;
    height: 24px;
    margin-right: 4px;
    .SWReactIcons {
        width: 24px;
        height: 24px;
    }
`;

const CompareItemSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex-grow: 1;
    padding: 8px 0;
`;

const CompareItem = styled.div.attrs({
    className: "CompareItem",
})`
    margin: 8px 8px 8px 0;
`;

const AutocompleteSection = styled.div`
    position: relative;
    max-width: 248px;
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
}

export const AutocompleteCompetitive: FunctionComponent<IAutocompleteCompetitiveProps> = ({
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
}) => {
    // A flag used for opening and closing the autocomplete.
    const [isComparing, setIsComparing] = useState(false);
    // The current value in the autocompletes input.
    const [inputValue, setInputValue] = useState(null);
    // A flag used for resolving the current desired behaviour of
    // pressing enter.
    const [hasEngagedAutocomplete, setHasEngagedAutocomplete] = useState(false);

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
        }
    };

    const handleMainSiteAdd = (item) => {
        onMainSiteAdd(item);
        if (!item.competitors) {
            setIsComparing(true);
        }
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
        // If user has added max allowed compare items, we don't reopen the autocomplete.
        // since the current item has not yet been updated, we add 1 to the value ie. + 1
        setTimeout(() => setIsComparing(compareSites.length + 1 < MAX_COMPARE_ITEMS), 50);
    };

    const handleCompareSiteRemove = (item) => () => {
        onCompareSitesRemove(item);
        if (isComparing) {
            setIsComparing(false);
            // we need to close and reopen the autocomplete so that the list items are
            // updated with the current compare items. Otherwise, their closure contains
            // the competitors that existed when the autocomplete opened.
            setTimeout(() => setIsComparing(true), 50);
        }
    };

    const onCompareButtonClick = () => {
        setHasEngagedAutocomplete(false);
        setInputValue(null);
        setIsComparing(true);
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

    return (
        <>
            {!mainSite ? (
                <AutocompleteWebsitesRecentArenas
                    excludes={compareSites}
                    onClick={handleMainSiteAdd}
                    recentSearches={recentSearches}
                    workspaces={workspaces}
                    autocompleteProps={{
                        placeholder: translate("autocomplete.competitive.choose.website"),
                        ...autocompleteProps,
                    }}
                />
            ) : (
                <ItemsWrapper>
                    <IconSection>
                        <SWReactIcons iconName="search" />
                    </IconSection>
                    <MainItemSection>
                        <QueryBarWebsiteItem
                            image={mainSite.image}
                            text={mainSite.name}
                            onButtonClick={handleMainSiteRemove}
                            onItemClick={() => null}
                            isCompare={true}
                            isDisabled={true}
                        />
                    </MainItemSection>

                    <Divider>vs</Divider>
                    <CompareItemSection>
                        {compareSites.length > 0 &&
                            compareSites.map((compareSite) => {
                                return (
                                    <CompareItem key={compareSite.name}>
                                        <QueryBarWebsiteItem
                                            text={compareSite.name}
                                            image={compareSite.image ?? compareSite.icon}
                                            onItemClick={() => null}
                                            onButtonClick={handleCompareSiteRemove(compareSite)}
                                            isCompare={true}
                                            isDisabled={true}
                                        />
                                    </CompareItem>
                                );
                            })}
                        {compareSites.length < MAX_COMPARE_ITEMS && (
                            <AutocompleteSection>
                                {!isComparing ? (
                                    <IconButton
                                        className={"QueryBar-compare-button"}
                                        onClick={onCompareButtonClick}
                                        iconName="add"
                                    >
                                        {translate(
                                            "autocomplete.competitive.button.add.competitor",
                                        )}
                                    </IconButton>
                                ) : isFetching ? (
                                    <LoadingComponent
                                        loaderStyles={{ top: "-24" }}
                                        placeholderText={translate(
                                            "autocomplete.competitive.placeholder.text",
                                        )}
                                        headerText={translate(
                                            "autocomplete.websitesCompare.seperator.text.similarSites",
                                        )}
                                    />
                                ) : (
                                    <AutocompleteWebsitesCompareItem
                                        className="AutocompleteCompetitive"
                                        onClick={handleCompareSiteAdd}
                                        similarSites={similarSites}
                                        excludes={[mainSite as IChosenItem, ...compareSites]}
                                        onCloseButtonClick={onAutocompleteCompareCloseButtonClick}
                                        autocompleteProps={{
                                            placeholder: translate(
                                                "autocomplete.competitive.placeholder.text",
                                            ),
                                            position: "relative",
                                            top: compareSites.length > 0 ? 8 : 0,
                                            ...autocompleteProps,
                                        }}
                                        onKeyUp={handleKeyPress}
                                        onArrowKeyPress={onArrowKeyPress}
                                        overrideEnterFunc={
                                            !hasEngagedAutocomplete &&
                                            !inputValue?.trim() &&
                                            compareSites.length > 0
                                                ? onSubmitClick
                                                : null
                                        }
                                        AutocompleteWidth={276}
                                    />
                                )}
                            </AutocompleteSection>
                        )}
                    </CompareItemSection>
                </ItemsWrapper>
            )}
        </>
    );
};
