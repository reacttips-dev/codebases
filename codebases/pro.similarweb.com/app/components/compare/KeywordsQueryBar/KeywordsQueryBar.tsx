import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    IKeywordsWithGroupsQueryBarProps,
    IKeywordsWithoutGroupsQueryBarProps,
} from "./KeywordsQueryBarTypes";
import { findSelectedKeywordGroup } from "./KeywordsQueryBarHelper";
import { QueryBarItem } from "../QueryBarItem";
import { swSettings } from "common/services/swSettings";
import { findParentByClass } from "@similarweb/ui-components/dist/utils/index";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { KeywordLoaderContainer, QueryBarContainer } from "./KeywordsQueryBarStyles";
import { KeywordsQueryBarItem } from "./components/KeywordsQueryBarItem";
import { KeywordsQueryBarAutocomplete } from "./components/KeywordsQueryBarAutocomplete";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import { SwNavigator } from "common/services/swNavigator";

export const KeywordsQueryBar: React.FunctionComponent<
    IKeywordsWithoutGroupsQueryBarProps | IKeywordsWithGroupsQueryBarProps
> = (props) => {
    const {
        isLoading,
        isKeywordMode,
        keywordGroups,
        selectedKeywordGroupId,
        selectedKeyword,
        onSearchItemClick = null,
        showButtons = true,
        showKeywordGroups = true,
        preventCloseOnEmptyValue = false,
        secondaryText,
        showSearch = true,
        showKeywords,
    } = props;

    if (!keywordGroups?.length && !isKeywordMode) {
        return null;
    }

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isGroupShareModalOpen, setIsGroupShareModalOpen] = useState(false);

    const services = useMemo(() => {
        return {
            navigator: Injector.get<SwNavigator>("swNavigator"),
            translate: i18nFilter(),
        };
    }, []);

    /**
     * Makes sure that we close the search upon clicking outside of the search area
     */
    const handleBodyClick = useCallback(
        (e) => {
            // In case the search group share modal is opened - we don't want to close
            // the search component, since the share modal is rendered from within it
            if (isGroupShareModalOpen) {
                return;
            }

            if (
                !findParentByClass(e.target, "QueryBarAutoComplete") &&
                !findParentByClass(e.target, "keywordsGroupEditorModal")
            ) {
                setIsSearchOpen(false);
            }
        },
        [isGroupShareModalOpen, setIsSearchOpen],
    );

    const handleSearchItemClick = useCallback(
        (item) => {
            if (preventCloseOnEmptyValue && item === "") return;

            setIsSearchOpen(false);
            if (onSearchItemClick) {
                onSearchItemClick(item);
            } else {
                const currPageState = services.navigator.current();
                const currPageDefaultParams = swSettings.getCurrentComponent().defaultParams;
                if (typeof item === "string") {
                    services.navigator.go(currPageState, {
                        ...currPageDefaultParams,
                        keywordGroupId: item,
                        webSource: "Total",
                        ...(currPageState.defaultQueryParams ?? {}),
                    });
                } else {
                    services.navigator.go(currPageState, {
                        ...currPageDefaultParams,
                        keywordGroupId: item.Id ?? item.name,
                        webSource: "Total",
                        ...(currPageState.defaultQueryParams ?? {}),
                    });
                }
            }
        },
        [setIsSearchOpen, services.navigator],
    );

    useEffect(() => {
        document.body.addEventListener("click", handleBodyClick, { capture: true });

        return () => {
            document.body.removeEventListener("click", handleBodyClick, { capture: true });
        };
    }, [handleBodyClick]);

    const selectedKeywordGroup = findSelectedKeywordGroup(keywordGroups, selectedKeywordGroupId);

    const itemComponent = !isLoading && (
        <KeywordsQueryBarItem
            keyword={selectedKeyword}
            keywordGroup={selectedKeywordGroup}
            isKeywordMode={isKeywordMode}
            onItemClick={() => setIsSearchOpen(true)}
            secondaryText={secondaryText}
            showSearch={showSearch}
            services={{
                translate: services.translate,
                swNavigator: services.navigator,
            }}
            showButtons={showButtons}
        />
    );

    const searchComponent = (
        <KeywordsQueryBarAutocomplete
            showKeywords={showKeywords}
            onItemClick={handleSearchItemClick}
            selectedValue={isKeywordMode ? selectedKeyword : ""}
            isKeywordMode={isKeywordMode}
            className={"QueryBarAutoComplete"}
            showKeywordGroups={showKeywordGroups}
            onGroupShareModalOpened={() => {
                setIsGroupShareModalOpen(true);
            }}
            onGroupShareModalClosed={() => {
                // Upon closing the share modal - we want to close
                // both the modal and the autocomplete (search)
                setIsGroupShareModalOpen(false);
                setIsSearchOpen(false);
            }}
            onGroupEditorModalClosed={() => {
                setIsSearchOpen(false);
            }}
            onGroupDelete={(deletedGroup: { Id: string }) => {
                if (isKeywordMode) {
                    return;
                }

                // In case the keyword group we're currently deleting from the autocomplete
                // is the currently selected keyword group, then we should navigate the user back to the homepage
                if (selectedKeywordGroup?.id === deletedGroup?.Id) {
                    const homeState = services.navigator.current().homeState;
                    services.navigator.go(homeState);
                }
            }}
        />
    );

    const loadingComponent = (
        <KeywordLoaderContainer>
            <PixelPlaceholderLoader width={140} height={26} />
        </KeywordLoaderContainer>
    );

    // Logic for enabling search / loader, as used by
    // the QueryBarItem component
    const shouldEnableSearchOrLoad = isSearchOpen || isLoading;
    const itemId = isKeywordMode ? selectedKeyword : selectedKeywordGroup?.id;

    return (
        <QueryBarContainer>
            <QueryBarItem
                id={itemId}
                isLoading={isLoading}
                activeItem={shouldEnableSearchOrLoad ? itemId : null}
                renderComponent={itemComponent}
                searchComponent={searchComponent}
                loadingComponent={loadingComponent}
            />
        </QueryBarContainer>
    );
};

export default SWReactRootComponent(KeywordsQueryBar, "KeywordsQueryBar");
