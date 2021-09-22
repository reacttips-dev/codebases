import { autocompleteStates } from "components/compare/WebsiteQueryBar";
import { i18nFilter } from "filters/ngFilters";
import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useRef } from "react";
import { getWebsiteResults } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { ListItemSeparator, ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { SwLog } from "@similarweb/sw-log";
import { AutocompleteStyled, StyledItemWrapper, StyledSecondColumn } from "./styles";
import classNames from "classnames";
import {
    IAutocompleteWebsitesCompareItemProps,
    IAutocompleteWebsitesCompareItemWrap,
} from "./types";
import { NoData } from "./components/NoData";
import { ScrollAreaWrap } from "./components/ScrollAreaWrapper";

const translate = i18nFilter();

export const toAutocompleteWebsiteShape = <T extends { name: string; image: string }>(
    website: T,
) => {
    return { Domain: website.name, Favicon: website.image };
};

const normalizedSimilarSite = (item) => {
    return {
        name: item.Domain,
        icon: item.Favicon,
    };
};

const normalizedSearches = (item) => {
    return {
        name: item.name,
        icon: item.image,
    };
};

const AutocompleteWebsitesCompareItemRenderFunction: ForwardRefRenderFunction<
    IAutocompleteWebsitesCompareItemWrap,
    IAutocompleteWebsitesCompareItemProps
> = (props, ref) => {
    const {
        onClick,
        similarSites,
        excludes,
        autocompleteProps,
        onCloseButtonClick,
        className,
        onKeyUp,
        onArrowKeyPress,
        overrideEnterFunc,
        overrideGetWebsites = getWebsiteResults,
        AutocompleteWidth,
        customItemStructure,
        secondColumnName,
        secondColumnFormatter,
        modifySearchResult,
        renderSimilarSitesHead,
        renderSearchResultsHead,
        renderNoDataSimilarsitesComponent,
        renderNoDataSearchesComponent,
        autoCompleteDropdownRef,
    } = props;
    const autocompleteRef = useRef(null);

    useImperativeHandle(ref, () => ({
        truncateResults: (force: boolean) => {
            autocompleteRef.current.truncateResults(force);
        },
    }));

    const onItemClick = (item) => () => {
        onClick(item);
    };

    const renderItemCreator = (type) => (item) => {
        return { ...item, type, props: { onClick: onItemClick(item) } };
    };

    const getListItems = async (query) => {
        if (query && query !== "") {
            try {
                const results = await overrideGetWebsites(query);
                if (results.length === 0) {
                    return [autocompleteStates.NO_DATA_SEARCHES];
                }
                const modifiedSearchResult = modifySearchResult
                    ? modifySearchResult(results)
                    : results;

                return modifiedSearchResult
                    .filter((x) => !excludes.find((exclude) => exclude.name === x.name))
                    .map((item) => {
                        const normalizedItem = customItemStructure
                            ? customItemStructure(item)
                            : normalizedSearches(item);
                        return renderItemCreator("query")(normalizedItem);
                    });
            } catch (e) {
                SwLog.error(e);
                return [autocompleteStates.ERROR];
            }
        } else {
            if (similarSites[0] === autocompleteStates.NO_DATA_SIMILARSITES) {
                return similarSites;
            }
            const similar = similarSites
                .filter(
                    (x) =>
                        !excludes.find(
                            (exclude) => exclude.name === (x.Domain ? x.Domain : x.name),
                        ),
                )
                .reduce((results, item) => {
                    const normalizedItem = customItemStructure
                        ? customItemStructure(item)
                        : normalizedSimilarSite(item);
                    results.push(renderItemCreator("similar")(normalizedItem));
                    return results;
                }, []);
            return [...similar];
        }
    };

    const getSimilarSitesHead = () => {
        if (typeof renderSimilarSitesHead === "function") {
            return renderSimilarSitesHead();
        }

        return (
            <ListItemSeparator>
                {translate("autocomplete.websitesCompare.seperator.text.similarSites")}
            </ListItemSeparator>
        );
    };

    const getSearchResultsHead = () => {
        if (typeof renderSearchResultsHead === "function") {
            return renderSearchResultsHead();
        }

        return null;
    };

    const renderItems = ({ selectedItemId, listItems }) => {
        const className = "ListItemsContainer";
        const itemCreator = (item, index) => {
            const {
                name,
                icon,
                disabled,
                props: { onClick },
            } = item;
            const active = index === selectedItemId;

            return (
                <StyledItemWrapper
                    key={`${name}_${index}`}
                    className={classNames({ active }, { disabled: disabled && !active })}
                >
                    <ListItemWebsite
                        className={"SimilarWebsiteItem"}
                        isActive={active}
                        key={`${name}_${index}`}
                        img={icon}
                        text={name}
                        onClick={onClick}
                        customRenderData={
                            <StyledSecondColumn>
                                {secondColumnFormatter
                                    ? secondColumnFormatter(item[secondColumnName])
                                    : item[secondColumnName]}
                            </StyledSecondColumn>
                        }
                    />
                </StyledItemWrapper>
            );
        };

        const similar = [];
        const searchResults = [];

        listItems.map((item, index) => {
            if (item === autocompleteStates.NO_DATA_SIMILARSITES) {
                if (typeof renderNoDataSimilarsitesComponent === "function") {
                    similar.push(renderNoDataSimilarsitesComponent());
                } else {
                    similar.push(
                        <NoData text={"autocomplete.websitesCompare.similarsites.nodata"} />,
                    );
                }
            }
            if (item === autocompleteStates.NO_DATA_SEARCHES) {
                if (typeof renderNoDataSearchesComponent === "function") {
                    searchResults.push(renderNoDataSearchesComponent());
                } else {
                    searchResults.push(
                        <NoData text={"autocomplete.websitesCompare.searches.nodata"} />,
                    );
                }
            }
            if (item.type === "similar") {
                similar.push(itemCreator(item, index));
            }
            if (item.type === "query") {
                searchResults.push(itemCreator(item, index));
            }
        });
        return (
            listItems.length > 0 && (
                <div className={className} ref={autoCompleteDropdownRef}>
                    {similar.length > 0 && (
                        <>
                            {getSimilarSitesHead()}
                            <ScrollAreaWrap>{similar}</ScrollAreaWrap>
                        </>
                    )}
                    {searchResults.length > 0 && (
                        <>
                            {getSearchResultsHead()}
                            <ScrollAreaWrap>{searchResults}</ScrollAreaWrap>
                        </>
                    )}
                </div>
            )
        );
    };

    return (
        <AutocompleteStyled
            className={className}
            isFocused
            width={AutocompleteWidth}
            autoFocus
            getListItems={getListItems}
            renderItems={renderItems}
            loadingComponent={<DotsLoader />}
            preventTruncateUnlessForced
            onCloseClick={onCloseButtonClick}
            resetValueOnSelect
            floating
            debounce={250}
            maxResults={20}
            onKeyUp={onKeyUp}
            onArrowKeyPress={onArrowKeyPress}
            overrideEnterFunc={overrideEnterFunc}
            initialSelectedItemId={-1}
            ref={autocompleteRef}
            {...autocompleteProps}
        />
    );
};
export const AutocompleteWebsitesCompareItem = forwardRef(
    AutocompleteWebsitesCompareItemRenderFunction,
);
