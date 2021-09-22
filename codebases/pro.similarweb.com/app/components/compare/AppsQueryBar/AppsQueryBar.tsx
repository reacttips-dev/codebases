import { SWReactIcons } from "@similarweb/icons";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { QueryBarAppItem } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItems/QueryBarAppItem";
import * as classNames from "classnames";
import { NoData, ScrollAreaWrap } from "./AppsQueryBarAutocompleteComponents";
import { AutocompleteStyled } from "./AppsQueryBarAutocompleteStyles";
import { IAutocompleteStyledProps, ListItemsTypes } from "./AppsQueryBarAutocompleteTypes";
import { QueryBarItem } from "components/compare/QueryBarItem";
import {
    Separator,
    TopSection,
    TopSectionText,
    LoaderSection,
    TabSection,
    TabHeader,
} from "components/compare/StyledComponent";
import {
    autocompleteStates,
    LoadingComponent,
    PageOverlay,
} from "components/compare/WebsiteQueryBar";
import { CircularLoader } from "components/React/CircularLoader";
import { FaviconButtonContainer } from "components/React/FavIcon/FaviconButtonContainer";
import { AppTooltip } from "components/tooltips/src/AppTooltip/AppTooltip";
import { CHART_COLORS } from "constants/ChartColors";
import * as _ from "lodash";
import groupBy from "lodash/groupBy";
import React, { FC } from "react";
import { connect } from "react-redux";
import { DefaultFetchService } from "services/fetchService";
import {
    getAppResults,
    getRecentsAnalysis,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import styled, { css } from "styled-components";
import { Injector } from "common/ioc/Injector";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { BaseQueryBar, mapDispatchToProps, mapStateToProps } from "../BaseQueryBar";
import { findParentByClass } from "@similarweb/ui-components/dist/utils";
import { ListItemSeparator, ListItemApp } from "@similarweb/ui-components/dist/list-item";
import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import swLog from "@similarweb/sw-log";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input/src/DotsLoader";
import { normalizeAutocompleteSearchesItem, normalizeItem } from "./AppsQueryBarHelper";
import { chosenItems } from "common/services/chosenItems";
import { SwTrack } from "services/SwTrack";

declare const window;

enum UrlStorePrefix {
    GOOGLE = "0_",
    APPLE = "1_",
}

const MAX_COMPARABLE_ITEMS = 5;
const AUTOCOMPLETE_ITEMS_MAX_INDEX = 19;
const AUTOCOMPLETE_SEARCH_MAX_ITEMS = 20;
const BREAK_POINT = 1440;

const hoverMessagesObject = {
    hoverTitleFavoriteAdd: "solutions2.tooltip.favorites.title.app.add",
    hoverTitleFavoriteRemove: "solutions2.tooltip.favorites.title.app.remove",
    addSuccessToastMessage: "tooltip.favorites.app.add.confirmation",
    addErrorToastMessage: "tooltip.favorites.add.error",
    removeSuccessToastMessage: "tooltip.favorites.app.remove.confirmation",
    removeErrorToastMessage: "tooltip.favorites.remove.error",
};

const AppsQueryBarContainer = styled.div`
    .Popup-Container-infoCard {
        top: 60px !important;
    }
`;

const QueryBarComparedItemsContainer = styled.div<{ columns: number }>`
    display: grid;
    grid-template-columns: ${({ columns }) => `repeat(${columns}, minmax(128px, auto))`};
    grid-column-gap: 4px;
    min-width: 0;
    > div {
        margin-right: 8px;
    }
`;

const FaviconButtonStyle = styled.div`
    margin: 0 8px;
`;

const loaderOptions = {
    svg: {
        stroke: `${colorsPalettes.midnight[50]}`,
        strokeWidth: "4",
        r: 16,
        cx: "50%",
        cy: "50%",
    },
    style: {
        width: 92,
        height: 92,
    },
};

export const LoadingContainer = styled.div<IAutocompleteStyledProps>`
    width: ${({ width }) => (width ? `${width}px` : "408px")};
    max-height: 380px;
    position: ${({ position }) => (position ? position : "absolute")};
    z-index: 1030;
    left: ${({ left }) => left ?? "-80px"};
    ${({ right }) =>
        right
            ? css`
                  right: ${right};
              `
            : null};
    top: ${({ top }) => (top ? `${top}px` : "-4px")};
    border: 1px solid ${colorsPalettes.carbon[50]};
    background-color: ${colorsPalettes.carbon[0]};
    border-radius: 4px;
    box-shadow: 0 8px 8px 0 ${rgba(colorsPalettes.black[0], 0.24)};
`;

export const TabbedLoadingComponent: FC<{
    placeholderText?: React.ReactNode;
    placeholderIconName?: string;
    headerText?: React.ReactNode;
    loaderStyles?: any;
}> = ({ placeholderText, placeholderIconName, loaderStyles, headerText }) => (
    <LoadingContainer className="loading-component" {...loaderStyles}>
        <TopSection>
            <SWReactIcons iconName={placeholderIconName} />
            <TopSectionText>{placeholderText}</TopSectionText>
        </TopSection>
        <Separator />
        <TabSection>
            <TabHeader>
                <SWReactIcons iconName={"google-play"} />
                {"GOOGLE"}
            </TabHeader>
            <TabHeader>
                <SWReactIcons iconName={"i-tunes"} />
                {"APP STORE"}
            </TabHeader>
        </TabSection>
        <ListItemSeparator>{headerText}</ListItemSeparator>
        <LoaderSection>
            <CircularLoader options={loaderOptions} />
        </LoaderSection>
    </LoadingContainer>
);

TabbedLoadingComponent.defaultProps = {
    placeholderIconName: "search",
    placeholderText: "Start typing here...",
};

export interface IAppCompareItem {
    title: string;
    icon: string;
    store: string;
    id: string;
    color?: string;
}

export interface IAppsQueryBarProps {
    customClassName?: string;
    hideFavorites?: boolean;
}

interface IAppsQueryBarState {
    mainItem: IAppCompareItem;
    comparedItems: IAppCompareItem[];
    chosenItems: IAppCompareItem[];
    compareItemsToBeAdded: IAppCompareItem[];
    recents: any;
    similarApps: any;
    /* a flag for determining if the add/compare button autocomplete is open */
    isCompareButton: boolean;
    /* used to determine which item's autocomplete is currently open and to populate the autocomplete placeholder */
    activeItem: string;
    isOverlayOpen: boolean;
    /* a flag used to modify the callback when a user presses enter */
    hasEngagedAutocomplete: boolean;
    windowWidth: number;
    isFetching: boolean;
}

export class AppsQueryBar extends BaseQueryBar<IAppsQueryBarProps, IAppsQueryBarState> {
    private appId: string;
    protected services;

    constructor(props, context) {
        super(props, context);
        this.services.fetchService = DefaultFetchService.getInstance();
        this.services.chosenItems = chosenItems;
        this.services.translate = i18nFilter();
        this.appId = this.services.swNavigator.getParams().appId.replace("0_", "");
        this.state = {
            ...this.getState(),
            compareItemsToBeAdded: [],
            similarApps: [],
            recents: [],
            isCompareButton: false,
            activeItem: null,
            isOverlayOpen: false,
            hasEngagedAutocomplete: false,
            windowWidth: window.innerWidth,
            isFetching: false,
        };
    }

    public async componentDidMount() {
        super.componentDidMount();
        document.body.addEventListener("click", this.handleBodyClick, { capture: true });
        window.addEventListener(
            "resize",
            _.debounce(() => {
                this.setState({ windowWidth: window.innerWidth });
            }, 200),
            { capture: true },
        );

        this.setState({ isFetching: true });
        const recentItems = await this.getAndFilterRecentsAnalysis();
        const similarApps = await this.fetchSimilarItems(_.head(this.state.chosenItems));
        this.setState({
            recents: recentItems,
            similarApps,
            isFetching: false,
        });
    }

    public componentWillUnmount() {
        super.componentWillUnmount();
        document.body.removeEventListener("click", this.handleBodyClick, { capture: true });
        window.removeEventListener(
            "resize",
            _.debounce(() => {
                this.setState({ windowWidth: window.innerWidth });
            }, 200),
            { capture: true },
        );
    }

    public async componentDidUpdate(prevProps, prevState) {
        const currentMainItem: IAppCompareItem = _.head(this.state.chosenItems);
        const previousMainItem: IAppCompareItem = _.head(prevState.chosenItems);
        if (currentMainItem.id !== previousMainItem.id) {
            this.setState({ isFetching: true });
            const recentItems = await this.getAndFilterRecentsAnalysis();
            const similarApps = await this.fetchSimilarItems(currentMainItem);
            this.setState({
                recents: recentItems,
                similarApps,
                isFetching: false,
            });
        }
    }

    public fetchSimilarItems = async (mainItem) => {
        let similarItems = [];
        try {
            similarItems = await this.services.fetchService.get(
                `/api/MobileApps/GetSimilarApps?appId=${
                    mainItem.id
                }&store=${mainItem.store.toLowerCase()}&limit=20`,
            );
        } catch (e) {
            swLog.error(`Error fetching similarApps - AppsQueryBar - ${e}`);
            similarItems[0] = [autocompleteStates.ERROR];
        }
        if (similarItems?.length === 0) {
            similarItems[0] = autocompleteStates.NO_DATA_SIMILARAPPS;
            return similarItems;
        }

        // normalize the similar app objects.
        return similarItems.reduce((result, item) => {
            const normalizedItem = item && normalizeItem(item);
            if (normalizedItem) {
                result.push(normalizedItem);
            }
            return result;
        }, []);
    };

    private getAndFilterRecentsAnalysis = async () => {
        const mainItem = this.state.chosenItems[0];
        let recentItems = [];
        try {
            recentItems = await getRecentsAnalysis("app", true);
        } catch (e) {
            swLog.error(`Error fetching recents - AppsQueryBar - ${e}`);
            recentItems[0] = [autocompleteStates.ERROR];
        }
        if (recentItems?.length === 0) {
            recentItems[0] = autocompleteStates.NO_DATA_RECENTS;
            return recentItems;
        }

        const deduped = _.uniqBy(recentItems, (item) => item["data"]?.mainItem?.toLowerCase());
        const withoutMainSite = deduped.filter(
            (item) =>
                (item["data"].mainItem.Id ??
                    item["data"].mainItem.ID ??
                    item["data"].mainItem.id) !== mainItem.id,
        );

        // normalize the recent app objects
        return withoutMainSite.reduce((result, item) => {
            const normalizedItem =
                item?.data?.resources?.mainItem && normalizeItem(item.data.resources.mainItem);
            if (normalizedItem) {
                result.push(normalizedItem);
            }
            return result;
        }, []);
    };

    private getUrlStorePrefix = (store: string): string => {
        let prefix;
        // if there are no compare items and we are updating the mainitem, check which store the new item is in for the url prefix
        if (_.tail(this.state.chosenItems).length === 0) {
            prefix = store === "Google" ? UrlStorePrefix.GOOGLE : UrlStorePrefix.APPLE;
        } else {
            prefix = this.services.swNavigator.getParams().appId.substr(0, 2);
        }
        return prefix;
    };

    // this method is called when changing an existing compare app or the main app.
    private replaceKeyAndUpdateParams = (
        indexToReplace: number,
        replacementKey: string,
        replacementKeystore?: string,
    ): void => {
        const prefix: string = this.getUrlStorePrefix(replacementKeystore);

        // update params with new main site
        const keys = _.map(this.state.chosenItems, "id"); // .map((comparedItem) => comparedItem.title);
        // replace mainItem with new mainItem
        keys.splice(indexToReplace, 1, replacementKey);
        const keysString = `${prefix}${keys.join(",")}`;
        this.services.swNavigator.updateParams({ appId: keysString });
    };
    // this method is called when changing an existing compare app or the main app.
    private replaceItemAndUpdateState = (indexToReplace: number, replacementItem: any): void => {
        // update the new items color property render the correct color in the ui immediately.
        replacementItem.color = CHART_COLORS.compareMainColors[indexToReplace];

        const chosenItems = [...this.state.chosenItems];
        chosenItems.splice(indexToReplace, 1, replacementItem);
        this.setState({
            isCompareButton: false,
            activeItem: null,
            isOverlayOpen: false,
            hasEngagedAutocomplete: false,
            chosenItems,
        });
    };

    // this method is called when adding new apps from the compare button.
    private updateParamsWithNewSites = (
        newCompareList: IAppCompareItem[] = this.state.compareItemsToBeAdded,
    ): void => {
        const prefix = this.services.swNavigator.getParams().appId.substr(0, 2);
        const newKeys = [
            ...this.state.chosenItems.map((item) => item.id),
            ...newCompareList.map((item) => item.id),
        ].join();
        this.services.swNavigator.updateParams({ appId: `${prefix}${newKeys}` });
    };

    // this method is called when adding new apps from the compare button.
    private updateChosenItemsWithNewSites = (
        compareItemsToBeAdded: IAppCompareItem[] = this.state.compareItemsToBeAdded,
    ): void => {
        const initialColorIndex = this.state.chosenItems.length;
        compareItemsToBeAdded.map(
            (item, index) =>
                (item.color = CHART_COLORS.compareMainColors[initialColorIndex + index]),
        );

        const updatedChosenItems = [...this.state.chosenItems, ...compareItemsToBeAdded];

        this.setState({
            isCompareButton: false,
            activeItem: null,
            isOverlayOpen: false,
            compareItemsToBeAdded: [],
            chosenItems: updatedChosenItems,
            hasEngagedAutocomplete: false,
        });
    };

    private handleBodyClick = (e) => {
        if (
            !findParentByClass(e.target, "AutocompleteAppsQueryBar") &&
            !findParentByClass(e.target, "QueryBar-compare-button") &&
            !findParentByClass(e.target, "loading-component")
        ) {
            // if in the process of adding compare sites and user clicks on a compare item (current or future), don't update params or state
            if (
                this.state.isCompareButton &&
                (findParentByClass(e.target, "compare-site-to-be-added") ||
                    findParentByClass(e.target, "querybar-item"))
            ) {
                return;
            }

            // logic for updating params if user was in the process of adding compare sites and clicked on body
            if (this.state.isCompareButton) {
                this.updateParamsWithNewSites();
            }

            this.updateChosenItemsWithNewSites();
        }
    };

    public onMainItemTextClick = (name: string) => () => {
        // while the user is choosing compare sites, changing the mainItem is not allowed.
        if (this.state.isCompareButton && this.state.compareItemsToBeAdded.length > 0) {
            this.setState({ activeItem: null });
            return;
        }
        this.setActiveItem(name);
    };

    public onItemTextClick = (name: string) => () => {
        this.setActiveItem(name);
    };

    private setActiveItem = (activeItemName: string): void => {
        this.setState({
            isCompareButton: this.state.compareItemsToBeAdded.length > 0,
            activeItem: activeItemName,
            isOverlayOpen: true,
            hasEngagedAutocomplete: false,
        });
        // this.services.track.trackWithGuid("query-bar.apps", "click", {
        //     websiteName: activeItemName,
        // });
    };

    public onMainItemAutocompleteItemClick = (item) => () => {
        // update querybar items visually. (when replacing the main item for some reason the color property is
        // not immediately passed to the new main item. Therefor, we add it manually)
        item.color = _.head(this.state.chosenItems).color;

        // update params with new main site
        this.replaceKeyAndUpdateParams(0, item.id, item.store);
        this.replaceItemAndUpdateState(0, item);
    };

    public onCompareItemAutocompleteItemClick = (item) => () => {
        // get the index of the compared item whose autocomplete the user is currently engaging.
        const itemIndex = this.state.chosenItems.findIndex(
            (comparedItem) => comparedItem.title === this.state.activeItem,
        );
        // if the user is choosing compare sites and replaces an existing this.state.comparedItems item,
        // simply replace the item and wait till the user commits his choices and then update params.
        if (this.state.isCompareButton && this.state.compareItemsToBeAdded.length > 0) {
            const comparedItems = [...this.state.chosenItems];
            comparedItems.splice(itemIndex, 1, item);
            this.setState({
                activeItem: null,
                hasEngagedAutocomplete: false,
                comparedItems,
            });
            return;
        }

        this.replaceKeyAndUpdateParams(itemIndex, item.id);
        this.replaceItemAndUpdateState(itemIndex, item);
    };

    private onCompareItemAutocompleteCloseButtonClick = (e) => {
        // if the user is choosing compare sites, close the existing chosenItems autocomplete
        if (this.state.isCompareButton) {
            this.setState({ activeItem: null });
            return;
        }

        this.setState({
            activeItem: null,
            isOverlayOpen: false,
            hasEngagedAutocomplete: false,
        });
    };

    public onCompareButtonAutocompleteItemClick = (item) => () => {
        // remove chosen site from similarsites and update state to refresh the sites in the autocomplete
        const similarAppsWithoutItem: IAppCompareItem[] = this.state.similarApps.filter(
            (app) => item.id !== app.id,
        );
        this.setState({ similarApps: similarAppsWithoutItem, hasEngagedAutocomplete: false });

        const compareItemsToBeAdded: IAppCompareItem[] = [...this.state.compareItemsToBeAdded];

        compareItemsToBeAdded.push(item);
        // if we are at max # of total items, update url params.
        if (this.state.chosenItems.length + compareItemsToBeAdded.length === 5) {
            this.updateChosenItemsWithNewSites(compareItemsToBeAdded);
            this.updateParamsWithNewSites(compareItemsToBeAdded);
            return;
        }
        // this piece of state is being set here to refresh the results of the similarSites in
        // the compare autocomplete (by way of the :excludes" prop) which will remove the site
        // that was currently chosen and to update the ui of the querybar with the added site.
        this.setState({ compareItemsToBeAdded, isCompareButton: false });
        // We have a unique functionality with the compare button autocomplete that when an item is selected
        // the autocomplete stays open and shifts over to allow the selected item to appear in the querybar.
        // Because it is shifting over, the click event target was being registered as the page itself and
        // not the item. To address this, a debounce was added to the setting of the state that causes the
        // autocomplete to shift (comparedItems).
        setTimeout(() => this.setState({ isCompareButton: true }), 50);
    };

    private onCompareButtonClick = () => {
        SwTrack.all.trackEvent("Compare", "open", "Header");
        this.setState({
            isCompareButton: true,
            activeItem: null,
            isOverlayOpen: true,
            hasEngagedAutocomplete: false,
        });
    };

    private onCompareButtonAutocompleteCloseButtonClick = (e) => {
        if (this.state.compareItemsToBeAdded.length > 0) {
            this.updateChosenItemsWithNewSites();
            this.updateParamsWithNewSites();
            return;
        }

        this.setState({
            isCompareButton: false,
            activeItem: null,
            isOverlayOpen: false,
            compareItemsToBeAdded: [],
            hasEngagedAutocomplete: false,
        });
    };

    private onKeyUp = (event) => {
        this.setState({ hasEngagedAutocomplete: true });
    };
    private onArrowKeyPress = (event) => {
        this.setState({ hasEngagedAutocomplete: true });
    };

    // if user was in the process of adding compare sites and pressed enter before engaging in the autocomplete
    // ie. did not add character or arrow up/down, we update the params and state
    private onPressEnter = () => {
        this.updateParamsWithNewSites();
        this.updateChosenItemsWithNewSites();
    };

    private autocompleteRenderItemCreator = (item, onClick) => {
        return { ...item, props: { onClick: onClick(item) } };
    };

    private autocompleteListItemCreator = (item, index, selectedItemId?) => {
        const { title, icon, store } = item;
        // when the isActive prop is undefined and has a value of false, we are disabling the key usage functionality of the tabbed autocompletes.
        return (
            <ListItemApp
                isActive={(selectedItemId || selectedItemId === 0) && index === selectedItemId}
                key={`${title}_${index}`}
                img={icon}
                text={title}
                subtitle={store}
                store={store.toLowerCase()}
                onClick={item.props.onClick}
            />
        );
    };

    private getListItemsForAutocompleteMainItem = async (
        query: string,
    ): Promise<IAppCompareItem[] | autocompleteStates[]> => {
        if (query && query !== "") {
            let searchResults;
            try {
                searchResults = await getAppResults(query, AUTOCOMPLETE_SEARCH_MAX_ITEMS);
            } catch (e) {
                swLog.error(e);
                return [autocompleteStates.ERROR];
            }
            if (searchResults?.length === 0 || !searchResults) {
                return [autocompleteStates.NO_DATA_SEARCHES];
            }
            const filteredAndNormalizedSearchResults = searchResults
                .filter(
                    (searchResult) =>
                        !this.state.chosenItems.find((exclude) => exclude.id === searchResult.id),
                )
                .map((searchResult) => normalizeAutocompleteSearchesItem(searchResult))
                .filter((searchResult) => !!searchResult);

            // remove duplicates and add props.onclick property to item passing into the onClick the item object
            let dedupedSearchResults = _.uniqBy(
                filteredAndNormalizedSearchResults,
                (searchAppItem: IAppCompareItem) => searchAppItem.id,
            )
                .slice(0, AUTOCOMPLETE_ITEMS_MAX_INDEX)
                .map((dedupedItem) =>
                    this.autocompleteRenderItemCreator(
                        dedupedItem,
                        this.onMainItemAutocompleteItemClick,
                    ),
                );

            // Note: The autocomplete keeps a single array of all listItems irrespective of having tabs.
            // Therefore, we need to order array so that the arrow keys will select the correct item.

            // Add flag to last index in array to indicate what should be rendered.
            // Filtering might have cleared any initial results from the array.
            // @ts-ignore
            if (dedupedSearchResults.length > 0) {
                dedupedSearchResults = [
                    ...dedupedSearchResults.filter(
                        (item: IAppCompareItem) => item.store === "Google",
                    ),
                    ...dedupedSearchResults.filter(
                        (item: IAppCompareItem) => item.store === "Apple",
                    ),
                    ListItemsTypes.QUERY,
                ];
            } else {
                dedupedSearchResults.unshift(autocompleteStates.NO_DATA_SEARCHES);
            }
            return dedupedSearchResults;
        } else {
            // logic for recents
            if (this.state.recents[0] === autocompleteStates.NO_DATA_RECENTS) {
                return this.state.recents;
            }

            const recents = this.state.recents
                .filter(
                    (recentAppItem) =>
                        !this.state.chosenItems.find((exclude) => exclude.id === recentAppItem.id),
                )
                .slice(0, AUTOCOMPLETE_ITEMS_MAX_INDEX)
                .map((recentAppItem) =>
                    this.autocompleteRenderItemCreator(
                        recentAppItem,
                        this.onMainItemAutocompleteItemClick,
                    ),
                );
            // Add flag to last index in recents array to indicate what should be rendered.
            recents.push(ListItemsTypes.RECENT);

            return recents;
        }
    };

    private getRenderItemsForAutocompleteMainItem = ({ selectedItemId, listItems }) => {
        if (!listItems || listItems.length === 0 || listItems[0] === autocompleteStates.ERROR) {
            return null;
        }
        const containerClassName = "ListItemsContainer";
        const tabClassName = "autocomplete-tab";

        const indexOfLastElementInListItemsArray = listItems.length - 1;

        // the list items are not from a query:
        if (
            listItems[indexOfLastElementInListItemsArray] === ListItemsTypes.RECENT ||
            listItems[0] === autocompleteStates.NO_DATA_RECENTS
        ) {
            const recent = [];

            if (listItems[0] === autocompleteStates.NO_DATA_RECENTS) {
                recent.push(
                    <NoData
                        key={"no-data"}
                        text={this.services.translate("autocomplete.apps.recent.nodata")}
                    />,
                );
            } else {
                // there are recents items:
                // exclude the last entry as it contains the type-of-data flag
                listItems.slice(0, indexOfLastElementInListItemsArray).map((item, index) => {
                    recent.push(this.autocompleteListItemCreator(item, index, selectedItemId));
                });
            }

            return (
                <div className={containerClassName}>
                    <>
                        {/* recents are rendered simply as a single vertical row of items without any tabs */}

                        <ListItemSeparator key={"list-item-separator"}>
                            {this.services.translate("autocomplete.apps.seperator.text.recents")}
                        </ListItemSeparator>
                        <ScrollAreaWrap>{recent}</ScrollAreaWrap>
                    </>
                </div>
            );
        }

        // the list items are from a query:
        if (
            listItems[indexOfLastElementInListItemsArray] === ListItemsTypes.QUERY ||
            listItems[0] === autocompleteStates.NO_DATA_SEARCHES
        ) {
            const googleRenderItemsGroup: JSX.Element[] = [];
            const appleRenderItemsGroup: JSX.Element[] = [];
            let groupedResults;

            // if no app store has an app matching the query, render no-data components for both stores:
            if (listItems[0] === autocompleteStates.NO_DATA_SEARCHES) {
                googleRenderItemsGroup.push(
                    <NoData
                        key={"no-data"}
                        text={this.services.translate("autocomplete.apps.searches.nodata")}
                    />,
                );
                appleRenderItemsGroup.push(
                    <NoData
                        key={"no-data"}
                        text={this.services.translate("autocomplete.apps.searches.nodata")}
                    />,
                );
            } else {
                // at least one store has data:

                // exclude the last entry as it contains the type-of-data flag
                groupedResults = groupBy(
                    listItems.slice(0, indexOfLastElementInListItemsArray),
                    "store",
                );

                // check if a particular store has results and if so transform item objects into JSX components.
                // Otherwise render a no-data component for that store.
                groupedResults.Google?.length
                    ? groupedResults.Google.map((item, index) =>
                          googleRenderItemsGroup.push(
                              this.autocompleteListItemCreator(item, index),
                          ),
                      )
                    : googleRenderItemsGroup.push(
                          <NoData
                              key={"no-data"}
                              text={this.services.translate("autocomplete.apps.searches.nodata")}
                          />,
                      );

                groupedResults.Apple?.length
                    ? groupedResults.Apple.map((item, index) =>
                          appleRenderItemsGroup.push(this.autocompleteListItemCreator(item, index)),
                      )
                    : appleRenderItemsGroup.push(
                          <NoData
                              key={"no-data"}
                              text={this.services.translate("autocomplete.apps.searches.nodata")}
                          />,
                      );
            }

            const tabPanels = (
                <>
                    <TabPanel>
                        <ScrollAreaWrap>{googleRenderItemsGroup}</ScrollAreaWrap>
                    </TabPanel>
                    <TabPanel>
                        <ScrollAreaWrap>{appleRenderItemsGroup}</ScrollAreaWrap>
                    </TabPanel>
                </>
            );

            return (
                <div className={containerClassName}>
                    <Tabs>
                        <TabList>
                            <Tab className={tabClassName}>
                                <SWReactIcons iconName={"google-play"} />
                                {this.services.translate("autocomplete.apps.text.google")} (
                                {groupedResults?.Google?.length ?? 0})
                            </Tab>
                            <Tab className={tabClassName}>
                                <SWReactIcons iconName={"i-tunes"} />
                                {this.services.translate("autocomplete.apps.text.apple")} (
                                {groupedResults?.Apple?.length ?? 0})
                            </Tab>
                        </TabList>
                        {tabPanels}
                    </Tabs>
                </div>
            );
        }
        return null;
    };

    private getListItemsForAutocompleteCompareItem = (onClick) => async (query) => {
        let searchResults;
        const currentStore = this.state.chosenItems[0].store.toLowerCase();
        const excludes = [...this.state.chosenItems, ...this.state.compareItemsToBeAdded];
        if (query && query !== "") {
            try {
                searchResults = await getAppResults(query, 20);
            } catch (e) {
                swLog.error(e);
                return [autocompleteStates.ERROR];
            }
            if (searchResults.length === 0 || !searchResults) {
                return [autocompleteStates.NO_DATA_SEARCHES];
            }

            const transformedSearchResults = searchResults.reduce((res, searchResult) => {
                if (res.length === AUTOCOMPLETE_ITEMS_MAX_INDEX) {
                    return res;
                }
                if (
                    excludes.find((exclude) => exclude.id === searchResult.id) ||
                    searchResult.store.toLowerCase() !== currentStore
                ) {
                    return res;
                }
                const normalizedItem = normalizeAutocompleteSearchesItem(searchResult);
                if (normalizedItem) {
                    res.push(normalizedItem);
                }
                return res;
            }, []);

            // remove duplicates, add props.onclick property to the item and pass into the onClick the item object
            const dedupedSearchResults = _.uniqBy(
                transformedSearchResults,
                (searchAppItem: IAppCompareItem) => searchAppItem.id,
            ).map((dedupedItem) => this.autocompleteRenderItemCreator(dedupedItem, onClick));

            // Add flag to last index in array to indicate what should be rendered.
            // Filtering might have cleared any initial results from the array.
            // @ts-ignore
            dedupedSearchResults.length > 0
                ? dedupedSearchResults.push(ListItemsTypes.QUERY)
                : dedupedSearchResults.unshift(autocompleteStates.NO_DATA_SEARCHES);

            return dedupedSearchResults;
        } else {
            // logic for similarSites
            if (this.state.similarApps[0] === autocompleteStates.NO_DATA_SIMILARAPPS) {
                return this.state.similarApps;
            }

            const similar = this.state.similarApps
                .filter(
                    (similarAppItem) =>
                        !excludes.find((exclude) => exclude.title === similarAppItem.title),
                )
                .slice(0, AUTOCOMPLETE_ITEMS_MAX_INDEX)
                // add type and load onclick with item object
                .map((similarAppItem) =>
                    this.autocompleteRenderItemCreator(similarAppItem, onClick),
                );

            similar.push(ListItemsTypes.SIMILAR);

            // Add flag to first index in similar array to indicate what should be rendered.
            return similar;
        }
    };

    private getRenderItemsForAutocompleteCompareItem = ({ selectedItemId, listItems }) => {
        const currentStore = this.state.chosenItems[0].store;
        const defaultTabIndex = currentStore === "Google" ? 0 : 1;
        const indexOfLastElementInListItemsArray = listItems.length - 1;

        if (!listItems || listItems.length === 0 || listItems[0] === autocompleteStates.ERROR) {
            return null;
        }
        const tabClassName = "autocomplete-tab";
        const googleRenderItemsGroup: JSX.Element[] = [];
        const appleRenderItemsGroup: JSX.Element[] = [];

        // logic for resolving what components to render based on app store and type of data:
        if (
            listItems[0] === autocompleteStates.NO_DATA_SEARCHES ||
            listItems[0] === autocompleteStates.NO_DATA_SIMILARAPPS
        ) {
            currentStore === "Google"
                ? googleRenderItemsGroup.push(
                      <NoData
                          key={"no-data"}
                          text={this.services.translate(
                              listItems[0] === autocompleteStates.NO_DATA_SEARCHES
                                  ? "autocomplete.apps.searches.nodata"
                                  : "autocomplete.apps.similarapps.nodata",
                          )}
                      />,
                  )
                : appleRenderItemsGroup.push(
                      <NoData
                          key={"no-data"}
                          text={this.services.translate(
                              listItems[0] === autocompleteStates.NO_DATA_SEARCHES
                                  ? "autocomplete.apps.searches.nodata"
                                  : "autocomplete.apps.similarapps.nodata",
                          )}
                      />,
                  );
        } else {
            // the items are similar or query items ie. listItems[indexOfLastElementInListItemsArray] === ListItemsTypes.SIMILAR || listItems[indexOfLastElementInListItemsArray] === ListItemsTypes.QUERY

            if (currentStore === "Google") {
                // exclude the last entry as it contains the type-of-data flag
                listItems
                    .slice(0, indexOfLastElementInListItemsArray)
                    .map((item, index) =>
                        googleRenderItemsGroup.push(
                            this.autocompleteListItemCreator(item, index, selectedItemId),
                        ),
                    );
                // if similar items then add a header to the list
                if (listItems[indexOfLastElementInListItemsArray] === ListItemsTypes.SIMILAR) {
                    googleRenderItemsGroup.unshift(
                        <ListItemSeparator key={"list-item-separator"}>
                            {this.services.translate(
                                "autocomplete.apps.seperator.text.similarApps",
                            )}
                        </ListItemSeparator>,
                    );
                }
            } else {
                // the items are apple store similar/query items
                listItems
                    .slice(0, indexOfLastElementInListItemsArray)
                    .map((item, index) =>
                        appleRenderItemsGroup.push(
                            this.autocompleteListItemCreator(item, index, selectedItemId),
                        ),
                    );
                if (listItems[indexOfLastElementInListItemsArray] === ListItemsTypes.SIMILAR) {
                    appleRenderItemsGroup.unshift(
                        <ListItemSeparator key={"list-item-separator"}>
                            {this.services.translate(
                                "autocomplete.apps.seperator.text.similarApps",
                            )}
                        </ListItemSeparator>,
                    );
                }
            }
        }

        const tabPanels = (
            <>
                <TabPanel>
                    <ScrollAreaWrap>{googleRenderItemsGroup}</ScrollAreaWrap>
                </TabPanel>
                <TabPanel>
                    <ScrollAreaWrap>{appleRenderItemsGroup}</ScrollAreaWrap>
                </TabPanel>
            </>
        );

        return (
            <div className="ListItemsContainer">
                <Tabs defaultIndex={defaultTabIndex}>
                    <TabList>
                        <Tab disabled={currentStore !== "Google"} className={tabClassName}>
                            <SWReactIcons iconName={"google-play"} />

                            {this.services.translate("autocomplete.apps.text.google")}
                        </Tab>
                        <Tab disabled={currentStore !== "Apple"} className={tabClassName}>
                            <SWReactIcons iconName={"i-tunes"} />

                            {this.services.translate("autocomplete.apps.text.apple")}
                        </Tab>
                    </TabList>
                    {tabPanels}
                </Tabs>
            </div>
        );
    };

    public render() {
        const {
            chosenItems,
            compareItemsToBeAdded,
            activeItem,
            isCompareButton,
            hasEngagedAutocomplete,
            isOverlayOpen,
            isFetching,
        } = this.state;

        const [mainItem, ...comparedItems] = chosenItems;
        const compareList = this.compareList();

        // when choosing compareSites, the color badges (dots) should not be visible
        const showBadge = !isCompareButton && compareItemsToBeAdded.length === 0;
        const getOverrideEnterFunc = !hasEngagedAutocomplete ? this.onPressEnter : null;

        // -1 is to remove the mainItem from the count
        const numOfVisibleCompareItems = chosenItems.length - 1 + compareItemsToBeAdded.length;

        const customItemsClassnames = classNames(
            "QueryBar u-flex-row u-flex-center",
            this.props.customClassName ?? null,
        );

        const isCompareState = this.isCompare();

        return (
            <>
                <AppsQueryBarContainer className={customItemsClassnames}>
                    <div className="QueryBar-mainItem u-flex-row u-flex-center">
                        <QueryBarItem
                            id={mainItem.title}
                            isLoading={isFetching}
                            activeItem={activeItem}
                            renderComponent={
                                <AppTooltip
                                    appId={mainItem.id}
                                    store={mainItem.store}
                                    debounce={1500}
                                    placement="bottom-left"
                                    appendTo={".QueryBar"}
                                >
                                    <div>
                                        <QueryBarAppItem
                                            text={mainItem.title}
                                            secondaryText={mainItem.store}
                                            image={mainItem.icon}
                                            isCompare={comparedItems.length > 0}
                                            badgeColor={showBadge ? mainItem.color : undefined}
                                            onItemClick={this.onMainItemTextClick(mainItem.title)}
                                            onButtonClick={this.removeItem(mainItem)}
                                        />
                                    </div>
                                </AppTooltip>
                            }
                            searchComponent={
                                <AutocompleteStyled
                                    className="AutocompleteAppsQueryBar"
                                    isFocused={true}
                                    autoFocus={true}
                                    getListItems={
                                        !isCompareState
                                            ? this.getListItemsForAutocompleteMainItem
                                            : this.getListItemsForAutocompleteCompareItem(
                                                  this.onMainItemAutocompleteItemClick,
                                              )
                                    }
                                    renderItems={
                                        !isCompareState
                                            ? this.getRenderItemsForAutocompleteMainItem
                                            : this.getRenderItemsForAutocompleteCompareItem
                                    }
                                    loadingComponent={<DotsLoader />}
                                    preventTruncateUnlessForced={true}
                                    resetValueOnSelect={true}
                                    floating={true}
                                    debounce={250}
                                    maxResults={20}
                                    onKeyUp={this.onKeyUp}
                                    onArrowKeyPress={this.onArrowKeyPress}
                                    overrideEnterFunc={getOverrideEnterFunc}
                                    initialSelectedItemId={-1}
                                    placeholder={mainItem.title}
                                    left={"0"}
                                />
                            }
                            loadingComponent={
                                <LoadingComponent
                                    placeholderText={mainItem.title}
                                    headerText={this.services.translate(
                                        comparedItems.length > 0
                                            ? "autocomplete.websitesCompare.seperator.text.similarSites"
                                            : "autocomplete.websitesMain.seperator.text.recents",
                                    )}
                                    loaderStyles={{
                                        width: 408,
                                    }}
                                />
                            }
                        />
                    </div>
                    {comparedItems.length > 0 || compareItemsToBeAdded.length > 0 ? (
                        <>
                            <div key={0} className="QueryBar-vs">
                                {this.services.translate("querybar.vs")}
                            </div>
                            <QueryBarComparedItemsContainer
                                columns={numOfVisibleCompareItems}
                                key={1}
                                className="u-flex-row u-flex-center"
                            >
                                {compareList}
                            </QueryBarComparedItemsContainer>
                        </>
                    ) : (
                        <FaviconButtonStyle>
                            {!this.props.hideFavorites && (
                                <FaviconButtonContainer hoverMessages={hoverMessagesObject} />
                            )}
                        </FaviconButtonStyle>
                    )}
                    <div style={{ position: "relative" }}>
                        {!isCompareButton &&
                            chosenItems.length + compareItemsToBeAdded.length <
                                MAX_COMPARABLE_ITEMS && (
                                <IconButton
                                    className={"QueryBar-compare-button"}
                                    onClick={this.onCompareButtonClick}
                                    iconName="add"
                                >
                                    {this.getBtnText()}
                                </IconButton>
                            )}
                        {isCompareButton ? (
                            isFetching ? (
                                <TabbedLoadingComponent
                                    loaderStyles={{
                                        position: "relative",
                                        left: "0",
                                        top: 100,
                                    }}
                                    placeholderText={this.services.translate(
                                        "querybar.apps.comparebutton.autocomplete.placeholder",
                                    )}
                                    headerText={this.services.translate(
                                        "autocomplete.apps.seperator.text.similarApps",
                                    )}
                                />
                            ) : (
                                <AutocompleteStyled
                                    className="AutocompleteAppsQueryBar"
                                    isFocused={true}
                                    autoFocus={true}
                                    getListItems={this.getListItemsForAutocompleteCompareItem(
                                        this.onCompareButtonAutocompleteItemClick,
                                    )}
                                    renderItems={this.getRenderItemsForAutocompleteCompareItem}
                                    loadingComponent={<DotsLoader />}
                                    preventTruncateUnlessForced={true}
                                    resetValueOnSelect={true}
                                    floating={true}
                                    debounce={250}
                                    maxResults={20}
                                    onCloseClick={this.onCompareButtonAutocompleteCloseButtonClick}
                                    onKeyUp={this.onKeyUp}
                                    onArrowKeyPress={this.onArrowKeyPress}
                                    overrideEnterFunc={getOverrideEnterFunc}
                                    initialSelectedItemId={-1}
                                    placeholder={this.services.translate(
                                        "querybar.apps.comparebutton.autocomplete.placeholder",
                                    )}
                                    position={"relative"}
                                    left={"0"}
                                />
                            )
                        ) : null}
                    </div>
                </AppsQueryBarContainer>

                <PageOverlay isOpen={isOverlayOpen} />
            </>
        );
    }

    private compareList() {
        const {
            chosenItems,
            compareItemsToBeAdded,
            activeItem,
            isFetching,
            isCompareButton,
            hasEngagedAutocomplete,
            windowWidth,
        } = this.state;
        const comparedItems = chosenItems.slice(1);
        const showBadge = !isCompareButton && compareItemsToBeAdded.length === 0;
        const getOverrideEnterFunc = !hasEngagedAutocomplete ? this.onPressEnter : null;
        const isSmallScreen = windowWidth <= BREAK_POINT;
        const currentCompareList = comparedItems.map((item: IAppCompareItem, index) => {
            const autocompleteResponsiveStyling = !isSmallScreen
                ? {}
                : index === 2
                ? { left: "initial", right: "-80px" }
                : index === 3
                ? { left: "initial", right: "0" }
                : {};

            return (
                <QueryBarItem
                    key={item.title}
                    id={item.title}
                    isLoading={isFetching}
                    activeItem={activeItem}
                    renderComponent={
                        <AppTooltip
                            appId={item.id}
                            store={item.store}
                            placement="bottom-left"
                            debounce={1500}
                            appendTo={".QueryBar"}
                        >
                            <div>
                                <QueryBarAppItem
                                    text={item.title}
                                    secondaryText={item.store}
                                    image={item.icon}
                                    isCompare={chosenItems.length > 1}
                                    badgeColor={showBadge ? item.color : undefined}
                                    onItemClick={this.onItemTextClick(item.title)}
                                    onButtonClick={this.removeItem(item)}
                                />
                            </div>
                        </AppTooltip>
                    }
                    searchComponent={
                        <AutocompleteStyled
                            className="AutocompleteAppsQueryBar"
                            isFocused={true}
                            autoFocus={true}
                            getListItems={this.getListItemsForAutocompleteCompareItem(
                                this.onCompareItemAutocompleteItemClick,
                            )}
                            renderItems={this.getRenderItemsForAutocompleteCompareItem}
                            loadingComponent={<DotsLoader />}
                            preventTruncateUnlessForced={true}
                            onCloseClick={this.onCompareItemAutocompleteCloseButtonClick}
                            resetValueOnSelect={true}
                            floating={true}
                            debounce={250}
                            maxResults={20}
                            onKeyUp={this.onKeyUp}
                            onArrowKeyPress={this.onArrowKeyPress}
                            overrideEnterFunc={getOverrideEnterFunc}
                            initialSelectedItemId={-1}
                            placeholder={`${activeItem ? activeItem : ""}`}
                            top={0}
                            {...autocompleteResponsiveStyling}
                        />
                    }
                    loadingComponent={
                        <TabbedLoadingComponent
                            loaderStyles={autocompleteResponsiveStyling}
                            placeholderText={item.title}
                            headerText={this.services.translate(
                                "autocomplete.apps.seperator.text.similarApps",
                            )}
                        />
                    }
                />
            );
        });
        /*autocompleteProps={{

                                ...(isSmallScreen && index === 2
                                    ? { left: "initial", right: "-80px" }
                                    : {}),
                                ...(isSmallScreen && index === 3
                                    ? { left: "initial", right: "0" }
                                    : {}),

                            }}*/
        const newCompareList = compareItemsToBeAdded.map((item: IAppCompareItem) => {
            //_.map(compareItemsToBeAdded, (item: IAppCompareItem) => {
            return (
                <QueryBarItem
                    customClassName="compare-site-to-be-added"
                    key={item.title}
                    id={item.title}
                    renderComponent={
                        <QueryBarAppItem
                            text={item.title}
                            secondaryText={item.store}
                            image={item.icon}
                            onItemClick={() => null}
                            onButtonClick={this.removeItemFromItemsToBeAddedList(item.title)}
                            isCompare={true}
                        />
                    }
                />
            );
        });
        return [...currentCompareList, ...newCompareList];
    }

    protected getState() {
        return {
            chosenItems: [
                normalizeItem(this.getMainItem()),
                ...this.getComparedItems().map((item) => normalizeItem(item)),
            ],
            mainItem: normalizeItem(this.getMainItem()),
            comparedItems: this.getComparedItems().map((item) => normalizeItem(item)),
        };
    }

    private getMainItem() {
        return _.clone(this.services.chosenItems[0]);
    }

    private getComparedItems() {
        return this.services.chosenItems.slice(1);
    }

    private getBtnText() {
        if (this.services.chosenItems.length > 0) {
            return i18nFilter()("analysis.header.btn.add");
        } else {
            return i18nFilter()("analysis.header.btn");
        }
    }

    private removeItem = (item) => () => {
        const [mainItem, ...comparedItems] = this.state.chosenItems;
        let updatedItems;
        // get store prefix for url params
        const prefix = this.services.swNavigator.getParams().appId.substr(0, 2);
        this.services.chosenItems.$remove(item);
        // Clear chosenItems in tableGrid
        this.services.chosenItems.keywords = "";

        // remove the item from the querybar visually. This logic is to have a quick
        // smooth instant replacement of the item while we wait for the params to update.
        if (item.id === mainItem.id) {
            // the new list of chosenItems will be all items except the current main item.
            updatedItems = comparedItems;
        } else {
            updatedItems = [
                mainItem,
                ...comparedItems.filter((comparedItem) => comparedItem.id !== item.id),
            ];
        }
        // add the current items color property values for quick badge color update
        updatedItems.forEach((item, index) => (item.color = CHART_COLORS.compareMainColors[index]));
        this.setState({ chosenItems: updatedItems, activeItem: null });

        // update the params with a new item list after removal of item
        const newKey = updatedItems.map((updatedItem) => updatedItem.id).join(",");
        this.services.swNavigator.updateParams({ appId: `${prefix}${newKey}` });
    };

    private removeItemFromItemsToBeAddedList = (itemTitle: string) => () => {
        const items = this.state.compareItemsToBeAdded.filter(
            (compareItem) => compareItem.title !== itemTitle,
        );
        this.setState({ compareItemsToBeAdded: items });
    };

    private isCompare() {
        return this.services.chosenItems.length > 1;
    }
}

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(AppsQueryBar),
    "AppsQueryBar",
);
