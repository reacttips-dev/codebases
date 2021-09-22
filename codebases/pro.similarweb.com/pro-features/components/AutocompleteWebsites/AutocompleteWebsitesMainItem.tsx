import { autocompleteStates } from "components/compare/WebsiteQueryBar";
import { i18nFilter } from "filters/ngFilters";
import React, { FunctionComponent } from "react";
import { getWebsiteResults } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { ListItemWebsite, ListItemSeparator } from "@similarweb/ui-components/dist/list-item";
import { SwLog } from "@similarweb/sw-log";
import { NoData } from "./components/NoData";
import { ScrollAreaWrap } from "./components/ScrollAreaWrapper";
import { AutocompleteStyled } from "./styles";
import { IAutocompleteWebsitesMainItemProps } from "./types";

const translate = i18nFilter();

const normalizedRecent = (item) => {
    return {
        name: item.mainItem,
        image: item.resources.mainItemFavIcon,
    };
};

export const AutocompleteWebsitesMainItem: FunctionComponent<IAutocompleteWebsitesMainItemProps> = ({
    onClick,
    recentSearches,
    excludes,
    autocompleteProps,
    className,
    onKeyUp,
    onArrowKeyPress,
    overrideEnterFunc,
}) => {
    const onItemClick = (item) => () => {
        onClick(item);
    };

    const renderItemCreator = (type) => (item) => {
        return { ...item, type, props: { onClick: onItemClick(item) } };
    };

    const getListItems = async (query) => {
        if (query && query !== "") {
            try {
                const results = await getWebsiteResults(query);
                if (results.length === 0) {
                    return [autocompleteStates.NO_DATA_SEARCHES];
                }
                return results
                    .filter((x) => !excludes.find((exclude) => exclude.name === x.name))
                    .map(renderItemCreator("query"));
            } catch (e) {
                SwLog.error(e);
                return [autocompleteStates.ERROR];
            }
        } else {
            if (recentSearches[0] === autocompleteStates.NO_DATA_RECENTS) {
                return recentSearches;
            }

            const recents = recentSearches
                .filter((x) => !excludes.find((exclude) => exclude.name === x.data["mainItem"]))
                .reduce((results, item) => {
                    const { type } = item.data;
                    if (type === "website") {
                        const normalizedItem = normalizedRecent(item.data);
                        results.push(renderItemCreator("recent")(normalizedItem));
                    }
                    return results;
                }, []);
            return [...recents];
        }
    };

    const renderItems = ({ selectedItemId, listItems }) => {
        const className = listItems.length > 0 ? "ListItemsContainer" : "";

        const itemCreator = (item, index) => {
            const { name, image } = item;
            return (
                <ListItemWebsite
                    isActive={index === selectedItemId}
                    key={`${name}_${index}`}
                    img={image}
                    text={name}
                    onClick={item.props.onClick}
                />
            );
        };

        const recents = [];
        const searchResults = [];

        listItems.map((item, index) => {
            if (item === autocompleteStates.NO_DATA_RECENTS) {
                recents.push(<NoData text={"autocomplete.websitesMain.recents.nodata"} />);
            }
            if (item === autocompleteStates.NO_DATA_SEARCHES) {
                searchResults.push(
                    <NoData text={"autocomplete.websitesCompare.searches.nodata"} />,
                );
            }
            if (item.type === "recent") {
                recents.push(itemCreator(item, index));
            }
            if (item.type === "query") {
                searchResults.push(itemCreator(item, index));
            }
        });
        return (
            <div className={className}>
                {listItems.length > 0 && (
                    <>
                        {recents.length > 0 && (
                            <>
                                <ListItemSeparator>
                                    {translate("autocomplete.websitesMain.seperator.text.recents")}
                                </ListItemSeparator>
                                <ScrollAreaWrap>{recents}</ScrollAreaWrap>
                            </>
                        )}
                        {searchResults.length > 0 && (
                            <>
                                <ScrollAreaWrap>{searchResults}</ScrollAreaWrap>
                            </>
                        )}
                    </>
                )}
            </div>
        );
    };
    return (
        <AutocompleteStyled
            className={className}
            isFocused={true}
            autoFocus={true}
            getListItems={getListItems}
            renderItems={renderItems}
            loadingComponent={<DotsLoader />}
            preventTruncateUnlessForced={true}
            resetValueOnSelect={true}
            floating={true}
            debounce={250}
            maxResults={20}
            onKeyUp={onKeyUp}
            onArrowKeyPress={onArrowKeyPress}
            overrideEnterFunc={overrideEnterFunc}
            initialSelectedItemId={-1}
            {...autocompleteProps}
        />
    );
};

AutocompleteWebsitesMainItem.defaultProps = {
    excludes: [],
};
