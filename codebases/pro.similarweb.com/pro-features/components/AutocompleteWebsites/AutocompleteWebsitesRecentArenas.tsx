import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { DefaultFetchService } from "services/fetchService";
import { IRecents } from "userdata";
import { IMarketingWorkspace } from "services/marketingWorkspaceApiService";
import { ListItemWebsite, ListItemSeparator } from "@similarweb/ui-components/dist/list-item";
import { ISite } from "components/Workspace/Wizard/src/types";
import { AutocompleteArenaItem } from "@similarweb/ui-components/dist/autocomplete/src/AutocompleteItems/AutocompleteArenaItem";
import { RecentService } from "services/recent/recentService";
const fetchService = DefaultFetchService.getInstance();

interface IAutocompleteWebsitesRecentArenasProps {
    children?: React.ReactNode;
    onClick: (mainSite: ISite, competitors?: ISite[]) => void;
    excludes: ISite[];
    recentSearches: IRecents;
    workspaces: IMarketingWorkspace[];
    autocompleteProps: any;
    renderNoDataComponent?(): React.ReactNode;
    autoCompleteDropdownRef?: React.MutableRefObject<any>;
}
const AutocompleteStyled = styled(Autocomplete)`
    width: 100%;
`;

enum EItemsType {
    ARENA = "arena",
    QUERY = "query",
    RECENT = "recent",
    ERROR = "error",
}

export const AutocompleteWebsitesRecentArenas: FunctionComponent<IAutocompleteWebsitesRecentArenasProps> = ({
    onClick,
    recentSearches,
    workspaces,
    excludes,
    autocompleteProps,
    renderNoDataComponent,
    autoCompleteDropdownRef,
}) => {
    const onItemClick = (item) => () => {
        onClick(item);
    };
    const renderItemCreator = (type: EItemsType) => (item) => {
        return { ...item, type, props: { onClick: onItemClick({ ...item, type }) } };
    };
    const getListItems = async (query) => {
        if (query !== "") {
            const results = await fetchService.get<ISite[]>(
                `/autocomplete/websites?size=9&term=${query}&webSource=Desktop&validate=true`,
            );
            return results
                .filter((x) => !excludes.find((exclude) => exclude.name === x.name))
                .map(renderItemCreator(EItemsType.QUERY));
        } else {
            if (
                (!workspaces || workspaces?.length === 0) &&
                (!recentSearches || recentSearches.length === 0)
            ) {
                return [{ type: EItemsType.ERROR }];
            }
            const arenas = workspaces.reduce((results, workspace) => {
                if (workspace.arenas) {
                    workspace.arenas.forEach((arena) => {
                        const { allies, competitors } = arena;
                        results.push(renderItemCreator(EItemsType.ARENA)({ allies, competitors }));
                    });
                }
                return results;
            }, []);
            const RESULTS_MAX_AMOUNT = 10;
            const IDEAL_RESULTS_PER_TYPE = 5;
            const recentWebsiteSearches = recentSearches.filter(
                ({ data: { type } }) => type === "website",
            );
            const uniqueRecentWebsiteSearches = recentWebsiteSearches.filter(
                RecentService.uniqueFilter(true),
            );
            const recents = uniqueRecentWebsiteSearches
                .slice(0, RESULTS_MAX_AMOUNT)
                .reduce((results, item) => {
                    const { mainItem, comparedItems, resources } = item.data as any;
                    const { mainItemFavIcon, comparedItemsFavicon } = resources;
                    const allies = [{ domain: mainItem, favicon: mainItemFavIcon }];
                    const competitors = comparedItems.map((domain, index) => ({
                        domain,
                        favicon: comparedItemsFavicon[index],
                    }));
                    results.push(renderItemCreator(EItemsType.RECENT)({ allies, competitors }));
                    return results;
                }, []);
            const arenasToDisplay = arenas.slice(
                0,
                Math.max(IDEAL_RESULTS_PER_TYPE, RESULTS_MAX_AMOUNT - recents.length),
            );
            const recentsToDisplay = recents.slice(
                0,
                Math.max(IDEAL_RESULTS_PER_TYPE, RESULTS_MAX_AMOUNT - arenas.length),
            );
            return [...arenasToDisplay, ...recentsToDisplay];
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
        const arenas = [];
        let error;
        listItems.map((item, index) => {
            const { type: itemType } = item;
            if (itemType === EItemsType.ARENA || itemType === EItemsType.RECENT) {
                const {
                    allies,
                    competitors,
                    props: { onClick },
                } = item;
                const mainSite = {
                    name: allies[0].domain,
                    image: allies[0].favicon,
                };
                const compareSites = competitors.map((competitor) => {
                    return { name: competitor.domain };
                });
                const autoCompleteRow = (
                    <AutocompleteArenaItem
                        mainSite={mainSite}
                        compareSites={compareSites}
                        onClick={onClick}
                        key={index}
                    />
                );
                itemType === EItemsType.ARENA
                    ? arenas.push(autoCompleteRow)
                    : recents.push(autoCompleteRow);
            }
            if (itemType === EItemsType.QUERY) {
                searchResults.push(itemCreator(item, index));
            }
            if (itemType === EItemsType.ERROR && typeof renderNoDataComponent === "function") {
                error = renderNoDataComponent();
            }
        });
        return (
            <div
                ref={autoCompleteDropdownRef}
                className={className}
                style={{ maxHeight: "54vh", overflowY: "auto" }}
            >
                {listItems.length > 0 && (
                    <>
                        {arenas.length > 0 && (
                            <>
                                <ListItemSeparator>My Arenas</ListItemSeparator>
                                {arenas}
                            </>
                        )}
                        {recents.length > 0 && (
                            <div style={{ paddingTop: "8px" }}>
                                <ListItemSeparator>Recents</ListItemSeparator>
                                {recents}
                            </div>
                        )}
                        {searchResults.length > 0 && <>{searchResults}</>}
                        {error}
                    </>
                )}
            </div>
        );
    };
    return (
        <AutocompleteStyled
            getListItems={getListItems}
            renderItems={renderItems}
            loadingComponent={<DotsLoader />}
            floating={true}
            debounce={250}
            placeholder="Start typing here..."
            {...autocompleteProps}
        />
    );
};
