import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import swLog from "@similarweb/sw-log";
import { Bubble } from "@similarweb/ui-components/dist/bubble";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { ListItemSeparator } from "@similarweb/ui-components/dist/list-item";
import { QueryBarWebsiteItem } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItems/QueryBarWebsiteItem";
import { findParentByClass } from "@similarweb/ui-components/dist/utils/index";
import autobind from "autobind-decorator";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { AutocompleteWebsitesCompareItem } from "components/AutocompleteWebsites/AutocompleteWebsitesCompareItem";
import { IAutocompleteStyledProps } from "components/AutocompleteWebsites/types";
import { AutocompleteWebsitesMainItem } from "components/AutocompleteWebsites/AutocompleteWebsitesMainItem";
import { QueryBarItem } from "components/compare/QueryBarItem";
import {
    FaviconButtonStyle,
    LoaderSection,
    OverlayMain,
    OverlaySidenav,
    Separator,
    TopSection,
    TopSectionText,
} from "components/compare/StyledComponent";
import InvalidDomainModal from "components/InvalidDomainModal/src/InvalidDomainModal";
import { CircularLoader } from "components/React/CircularLoader";
import { FaviconButtonContainer } from "components/React/FavIcon/FaviconButtonContainer";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import * as _ from "lodash";
import * as React from "react";
import { FC } from "react";
import { connect } from "react-redux";
import {
    ProductTours,
    ProductToursLocalStorageKeys,
    showIntercomTour,
} from "services/IntercomProductTourService";
import { getRecentsAnalysis } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { IChosenItem } from "../../@types/chosenItems";
import { i18nFilter } from "../../filters/ngFilters";
import { DefaultFetchService } from "../../services/fetchService";
import { BaseQueryBar, mapDispatchToProps, mapStateToProps } from "./BaseQueryBar";
import "./QueryBar.scss";
import { STATE_COMPARE_PREFIX } from "./QueryBarUtils";
import { FavoritesService } from "services/favorites/favoritesService";
import { SwTrack } from "services/SwTrack";

declare const window;

export enum DOMAIN_DATA_STATUS {
    Valid = 0,
    Invalid = 1,
    Blacklist = 2,
}

export enum autocompleteStates {
    NO_DATA_RECENTS = -3,
    NO_DATA_SIMILARSITES,
    NO_DATA_SIMILARAPPS = -2,
    NO_DATA_SEARCHES = -1,
    LOADING = 1,
    ERROR = 2,
}

const MAX_COMPARABLE_ITEMS = 5;
const BREAK_POINT = 1410;

const hoverMessagesObject = {
    hoverTitleFavoriteAdd: "solutions2.tooltip.favorites.title.website.add",
    hoverTitleFavoriteRemove: "solutions2.tooltip.favorites.title.website.remove",
    addSuccessToastMessage: "tooltip.favorites.website.add.confirmation",
    addErrorToastMessage: "tooltip.favorites.add.error",
    removeSuccessToastMessage: "tooltip.favorites.website.remove.confirmation",
    removeErrorToastMessage: "tooltip.favorites.remove.error",
};

const WebsiteQueryBarContainer = styled.div.attrs(() => ({
    className: "QueryBar u-flex-row u-flex-center",
}))`
    .Popup-Container-infoCard {
        top: 60px !important;
    }
`;

const QueryBarComparedItemsContainer = styled.div<{ columns: number }>`
    display: grid;
    grid-template-columns: ${({ columns }) => `repeat(${columns}, minmax(128px, auto))`};
    min-width: 0;
    > div {
        margin-right: 16px;
    }
`;

const LoadingContainer = styled.div<IAutocompleteStyledProps>`
    width: ${({ width }) => (width ? `${width}px` : "248px")};
    max-height: 380px;
    position: ${({ position }) => (position ? position : "absolute")};
    z-index: 1030;
    left: 0;
    top: ${({ top }) => (top ? `${top}px` : "-8px")};
    border: 1px solid ${colorsPalettes.carbon[50]};
    background-color: ${colorsPalettes.carbon[0]};
    border-radius: 4px;
    box-shadow: 0 8px 8px 0 ${rgba(colorsPalettes.black[0], 0.24)};
`;

export const PageOverlay = ({ isOpen }) => {
    return isOpen ? (
        <>
            <OverlayMain />
            <OverlaySidenav />
        </>
    ) : null;
};

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

export const LoadingComponent: FC<{
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
        <ListItemSeparator>{headerText}</ListItemSeparator>
        <LoaderSection>
            <CircularLoader options={loaderOptions} />
        </LoaderSection>
    </LoadingContainer>
);

LoadingComponent.defaultProps = {
    placeholderIconName: "search",
    placeholderText: "Start typing here...",
};

export interface ISimilarSite {
    Domain: string;
    DomainWithoutSub: string;
    Favicon: string;
}

export interface IWebsiteQueryBarProps {
    onUserDidCompare?: () => void;
    onStateCompare?: (stateId: string) => void;
    userDidCompare?: boolean;
    pageChanged?: boolean;
    statesDidCompare?: string[];
    chosenItems?: IChosenItem[];
    renderFavoriteButton?(domain: string): React.ReactNode;
}

interface IWebsiteQueryBarState {
    chosenItemsState: IChosenItem[];
    compareSitesToBeAdded: IChosenItem[];
    promoteCompareForState: boolean;
    invalidDomains?: string[];
    invalidDomainModalOpen?: boolean;
    recents: any;
    similarSites: any;
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

class WebsiteQueryBar extends BaseQueryBar<IWebsiteQueryBarProps, IWebsiteQueryBarState> {
    constructor(props, context) {
        super(props, context);
        this.services.chosenSites = Injector.get<any>("chosenSites");
        this.services.swNavigator = Injector.get<SwNavigator>("swNavigator");
        this.services.swSettings = swSettings;
        this.services.translate = i18nFilter();
        this.services.fetchService = DefaultFetchService.getInstance();
        this.services.track = TrackWithGuidService;
        this.state = {
            promoteCompareForState: !this.didCurrentStateCompare(),
            chosenItemsState: this.props.chosenItems,
            compareSitesToBeAdded: [],
            similarSites: [],
            recents: [],
            isCompareButton: false,
            activeItem: null,
            isOverlayOpen: false,
            hasEngagedAutocomplete: false,
            windowWidth: window.innerWidth,
            isFetching: false,
        };
        this.checkWebsiteVaildity(props.chosenItems);
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
        const similarSites = await this.fetchSimilarSites(this.state.chosenItemsState[0]);
        this.setState({
            recents: recentItems,
            similarSites,
            isFetching: false,
        });
        this.runIntercomTour(
            ProductTours.NewQueryBar,
            ProductToursLocalStorageKeys.NewQueryBarTour,
        );
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
        const currentMainDomain = this.services.chosenSites.getPrimarySite();
        const previousMainDomain = prevProps.chosenItems[0];
        if (currentMainDomain.name !== previousMainDomain.name) {
            const recentItems = await this.getAndFilterRecentsAnalysis();
            const similarSites = await this.fetchSimilarSites(currentMainDomain);
            this.setState({
                recents: recentItems,
                similarSites,
            });
            setTimeout(() => {
                this.runIntercomTour(
                    ProductTours.NewQueryBar_Compare,
                    ProductToursLocalStorageKeys.NewQueryBar_CompareTour,
                );
            }, 10000);
        }
        const currentDomains = this.props.chosenItems.map((item) => item.name);
        const prevDomains = prevProps.chosenItems.map((item) => item.name);
        if (prevDomains.join() !== currentDomains.join()) {
            this.checkWebsiteVaildity(this.props.chosenItems);
        }
        // we check if every item's icon property is defined because it takes redux some time to update the item's
        // properties with their values and we don't want a broken image displayed in the interim.
        if (
            !_.isEqual(this.props.chosenItems, prevProps.chosenItems) &&
            _.every(this.props.chosenItems, "icon")
        ) {
            this.setState({ chosenItemsState: this.props.chosenItems });
        }
        if (prevProps.statesDidCompare !== this.props.statesDidCompare) {
            this.setState({ promoteCompareForState: !this.didCurrentStateCompare() });
        }
    }

    public runIntercomTour = (
        productTourId: ProductTours,
        storageKey: ProductToursLocalStorageKeys,
    ): void => {
        const isTourAlreadySeen = localStorage.getItem(storageKey);

        if (isTourAlreadySeen === "true") {
            return;
        }

        showIntercomTour(productTourId);
        localStorage.setItem(storageKey, "true");
    };

    public fetchSimilarSites = async ({ name }) => {
        let similarSites;
        try {
            similarSites = await this.services.fetchService.get(
                `/api/WebsiteOverview/getsimilarsites?key=${name}&limit=20`,
            );
        } catch (e) {
            swLog.error(`Error fetching similarSites - WebsiteQueryBar - ${e}`);
            return [autocompleteStates.ERROR];
        }
        if (similarSites.length === 0) {
            similarSites[0] = autocompleteStates.NO_DATA_SIMILARSITES;
        }
        return similarSites;
    };

    private getAndFilterRecentsAnalysis = async () => {
        let recentItems;
        try {
            recentItems = await getRecentsAnalysis("website", true);
        } catch (e) {
            swLog.error(`Error fetching recents - WebsiteQueryBar - ${e}`);
            return [autocompleteStates.ERROR];
        }
        if (recentItems.length === 0) {
            recentItems[0] = autocompleteStates.NO_DATA_RECENTS;
            return recentItems;
        }

        const deduped = _.uniqBy(recentItems, (value) => value["data"]?.mainItem?.toLowerCase());
        const withoutMainSite = deduped.filter(
            (item) => item["data"].mainItem !== this.state.chosenItemsState[0].name,
        );
        return withoutMainSite;
    };

    // this method is called when adding new sites from the compare button.
    private updateParamsWithNewSites = (newCompareList = this.state.compareSitesToBeAdded) => {
        const newKeys = [
            ...this.state.chosenItemsState.map((item) => item.name),
            ...newCompareList.map((item) => item.name),
        ].join();
        this.services.swNavigator.updateParams({ key: newKeys });
    };
    // this method is called when adding new sites from the compare button.
    private updateChosenItemsStateWithNewSites = (
        compareSitesToBeAdded = this.state.compareSitesToBeAdded,
    ) => {
        const updatedChosenItemsState = [...this.state.chosenItemsState, ...compareSitesToBeAdded];

        this.setState({
            isCompareButton: false,
            activeItem: null,
            isOverlayOpen: false,
            compareSitesToBeAdded: [],
            chosenItemsState: updatedChosenItemsState,
            hasEngagedAutocomplete: false,
        });
    };
    // this method is called when changing an existing compare site or the main site.
    private replaceKeyAndUpdateParams = (indexToReplace, replacementKey) => {
        // update params with new main site
        const keys = this.state.chosenItemsState.map((chosenItem) => chosenItem.name);
        // replace mainItem with new mainItem
        keys.splice(indexToReplace, 1, replacementKey);
        const keysString = keys.join(",");

        // sim-31888: reset params when changing main site
        const currentState = this.services.swNavigator.current();
        const params = { key: keysString, ...(currentState.reset ?? {}) };
        this.services.swNavigator.updateParams(params);
    };
    // this method is called when changing an existing compare site or the main site.
    private replaceItemAndUpdateState = (indexToReplace, replacementItem) => {
        const chosenItemsState = this.state.chosenItemsState.map((chosenItem) => chosenItem);
        chosenItemsState.splice(indexToReplace, 1, replacementItem);
        this.setState({
            isCompareButton: false,
            activeItem: null,
            isOverlayOpen: false,
            hasEngagedAutocomplete: false,
            chosenItemsState,
        });
    };

    private handleBodyClick = (e) => {
        if (
            !findParentByClass(e.target, "AutocompleteWebsitesQueryBar") &&
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

            this.updateChosenItemsStateWithNewSites();
        }
    };

    // if user was in the process of adding compare sites and pressed enter before engaging in the autocomplete
    // ie. did not add character or arrow up/down, we update the params and state
    private onPressEnter = () => {
        this.updateParamsWithNewSites();
        this.updateChosenItemsStateWithNewSites();
    };

    private setActiveItem = (activeItemName) => {
        this.setState({
            isCompareButton: this.state.compareSitesToBeAdded.length > 0,
            activeItem: activeItemName,
            isOverlayOpen: true,
            hasEngagedAutocomplete: false,
        });
        this.services.track.trackWithGuid("query-bar.website", "click", {
            websiteName: activeItemName,
        });
    };

    public onMainItemTextClick = (name) => () => {
        // while the user is choosing compare sites, changing the mainItem is not allowed.
        if (this.state.isCompareButton && this.state.compareSitesToBeAdded.length > 0) {
            this.setState({ activeItem: null });
            return;
        }
        this.setActiveItem(name);
    };

    public onItemTextClick = (name) => () => {
        this.setActiveItem(name);
    };

    public onMainItemAutocompleteItemClick = (item) => {
        // update querybar items visually. (when replacing the main item for some reason the color property is
        // not immediately passed to the new main item. Therefor, we add it manually)
        item.color = this.state.chosenItemsState[0].color;

        // update params with new main site
        this.replaceKeyAndUpdateParams(0, item.name);
        this.replaceItemAndUpdateState(0, item);
    };

    public onCompareItemAutocompleteItemClick = (item) => {
        const itemIndex = this.state.chosenItemsState.findIndex(
            (chosenItem) => chosenItem.name === this.state.activeItem,
        );
        // if the user is choosing compare sites and replaces an existing this.state.chosenItemState item,
        // simply replace the item and wait till the user commits his choices and then update params.
        if (this.state.isCompareButton && this.state.compareSitesToBeAdded.length > 0) {
            const chosenItemsState = this.state.chosenItemsState.map((chosenItem) => chosenItem);
            chosenItemsState.splice(itemIndex, 1, item);
            this.setState({
                activeItem: null,
                hasEngagedAutocomplete: false,
                chosenItemsState,
            });
            return;
        }

        this.replaceKeyAndUpdateParams(itemIndex, item.name);
        this.replaceItemAndUpdateState(itemIndex, item);
    };

    public onCompareButtonAutocompleteItemClick = (item) => {
        // remove chosen site from similarsites and update state to refresh the sites in the autocomplete
        const similarSitesWithoutItem: ISimilarSite[] = this.state.similarSites.filter(
            (x) => item.name !== x.Domain,
        );
        this.setState({ similarSites: similarSitesWithoutItem, hasEngagedAutocomplete: false });

        const compareSitesToBeAdded: IChosenItem[] = this.state.compareSitesToBeAdded.map(
            (compareSite) => compareSite,
        );
        item.displayName = item.name;
        compareSitesToBeAdded.push(item as IChosenItem);
        // if we are at max # of total items, update url params.
        if (this.state.chosenItemsState.length + compareSitesToBeAdded.length === 5) {
            this.updateChosenItemsStateWithNewSites(compareSitesToBeAdded);
            this.updateParamsWithNewSites(compareSitesToBeAdded);
            return;
        }
        // this piece of state is being set here to refresh the results of the similarSites in
        // the compare autocomplete (by way of the :excludes" prop) which will remove the site
        // that was currently chosen and to update the ui of the querybar with the added site.
        this.setState({ compareSitesToBeAdded, isCompareButton: false });
        // We have a unique functionality with the compare button autocomplete that when an item is selected
        // the autocomplete stays open and shifts over to allow the selected item to appear in the querybar.
        // Because it is shifting over, the click event target was being registered as the page itself and
        // not the item. To address this, a debounce was added to the setting of the state that causes the
        // autocomplete to shift (comparedItems).
        setTimeout(() => this.setState({ isCompareButton: true }), 50);
    };

    private onCompareButtonClick = () => {
        this.setDidCompareForCurrentState();
        SwTrack.all.trackEvent("Compare", "open", "Header");
        this.props.onUserDidCompare();
        this.setState({
            isCompareButton: true,
            activeItem: null,
            isOverlayOpen: true,
            hasEngagedAutocomplete: false,
        });
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

    private onCompareButtonAutocompleteCloseButtonClick = (e) => {
        if (this.state.compareSitesToBeAdded.length > 0) {
            this.updateChosenItemsStateWithNewSites();
            this.updateParamsWithNewSites();
            return;
        }

        this.setState({
            isCompareButton: false,
            activeItem: null,
            isOverlayOpen: false,
            compareSitesToBeAdded: [],
            hasEngagedAutocomplete: false,
        });
    };

    private onKeyUp = (event) => {
        this.setState({ hasEngagedAutocomplete: true });
    };
    private onArrowKeyPress = (event) => {
        this.setState({ hasEngagedAutocomplete: true });
    };

    renderFavoriteButton() {
        if (typeof this.props.renderFavoriteButton !== "function") {
            return (
                <FaviconButtonStyle>
                    <FaviconButtonContainer
                        hoverMessages={hoverMessagesObject}
                        isPageFavorite={FavoritesService.isCurrentPageFavorite()}
                    />
                </FaviconButtonStyle>
            );
        }

        return this.props.renderFavoriteButton(this.state.chosenItemsState[0]?.name);
    }

    public render() {
        const {
            chosenItemsState,
            compareSitesToBeAdded,
            activeItem,
            similarSites,
            recents,
            isCompareButton,
            hasEngagedAutocomplete,
            isOverlayOpen,
            windowWidth,
            isFetching,
        } = this.state;
        const mainItem = chosenItemsState[0];
        const compareList = this.compareList();
        const stateParams = this.services.swNavigator.current();
        const isFroUser = this.services.swSettings.user.isFro;
        const isNotificationOpen =
            !this.isCompare() &&
            this.state.promoteCompareForState &&
            stateParams.promoteCompareForStateTitle &&
            !isFroUser;
        const showBadge = !isCompareButton && compareSitesToBeAdded.length === 0;
        const getOverrideEnterFunc = !hasEngagedAutocomplete ? this.onPressEnter : null;
        const getMainItemSearchComponent = () => {
            return !this.isCompare() ? (
                <AutocompleteWebsitesMainItem
                    className="AutocompleteWebsitesQueryBar"
                    onClick={this.onMainItemAutocompleteItemClick}
                    recentSearches={recents}
                    onKeyUp={this.onKeyUp}
                    onArrowKeyPress={this.onArrowKeyPress}
                    overrideEnterFunc={getOverrideEnterFunc}
                    autocompleteProps={{
                        placeholder: mainItem.name,
                    }}
                    excludes={[...chosenItemsState]}
                />
            ) : (
                <AutocompleteWebsitesCompareItem
                    className="AutocompleteWebsitesQueryBar"
                    onClick={this.onMainItemAutocompleteItemClick}
                    similarSites={similarSites}
                    excludes={[...chosenItemsState]}
                    onKeyUp={this.onKeyUp}
                    onArrowKeyPress={this.onArrowKeyPress}
                    overrideEnterFunc={getOverrideEnterFunc}
                    autocompleteProps={{
                        placeholder: mainItem.name,
                    }}
                />
            );
        };
        // -1 is to remove the mainItem from the count
        const numOfVisibleCompareItems = chosenItemsState.length - 1 + compareSitesToBeAdded.length;
        const isSmallScreen = windowWidth <= BREAK_POINT;
        return (
            <>
                <WebsiteQueryBarContainer>
                    <div
                        className="QueryBar-mainItem u-flex-row u-flex-center"
                        style={{ flex: "0 0 auto" }}
                    >
                        <QueryBarItem
                            id={mainItem.name}
                            isLoading={isFetching}
                            activeItem={activeItem}
                            renderComponent={
                                <WebsiteTooltip
                                    domain={mainItem.name}
                                    placement="bottom-left"
                                    debounce={1500}
                                    appendTo={".QueryBar"}
                                >
                                    <div>
                                        <QueryBarWebsiteItem
                                            text={mainItem.name}
                                            image={mainItem.icon ? mainItem.icon : mainItem.image}
                                            onItemClick={this.onMainItemTextClick(mainItem.name)}
                                            onButtonClick={this.removeItem(mainItem)}
                                            badgeColor={showBadge ? mainItem.color : undefined}
                                            isCompare={chosenItemsState.length > 1}
                                        />
                                    </div>
                                </WebsiteTooltip>
                            }
                            searchComponent={getMainItemSearchComponent()}
                            loadingComponent={
                                <LoadingComponent
                                    placeholderText={mainItem.name}
                                    headerText={this.services.translate(
                                        chosenItemsState.length > 1
                                            ? "autocomplete.websitesCompare.seperator.text.similarSites"
                                            : "autocomplete.websitesMain.seperator.text.recents",
                                    )}
                                />
                            }
                        />
                    </div>
                    {this.isCompare() || compareSitesToBeAdded.length > 0 ? (
                        <>
                            <span key={0} className="QueryBar-vs" style={{ flex: "0 0 auto" }}>
                                vs.
                            </span>
                            <QueryBarComparedItemsContainer
                                columns={numOfVisibleCompareItems}
                                key={1}
                                className="u-flex-row u-flex-center"
                            >
                                {compareList}
                            </QueryBarComparedItemsContainer>
                        </>
                    ) : (
                        this.renderFavoriteButton()
                    )}
                    <div style={{ position: "relative" }}>
                        {!isCompareButton &&
                            chosenItemsState.length + compareSitesToBeAdded.length <
                                MAX_COMPARABLE_ITEMS && (
                                <Bubble
                                    isOpen={isNotificationOpen}
                                    onClose={this.setDidCompareForCurrentState}
                                    title={i18nFilter()(stateParams.promoteCompareForStateTitle)}
                                    text={i18nFilter()(stateParams.promoteCompareForStateSubtitle)}
                                    cssClass={"Bubble-element QueryBar-compare-bubble"}
                                    placement={"bottom-left"}
                                >
                                    <div>
                                        <IconButton
                                            className={"QueryBar-compare-button"}
                                            onClick={this.onCompareButtonClick}
                                            iconName="add"
                                        >
                                            {this.getBtnText()}
                                        </IconButton>
                                    </div>
                                </Bubble>
                            )}
                        {isCompareButton ? (
                            isFetching ? (
                                <LoadingComponent
                                    loaderStyles={{
                                        ...(isSmallScreen && numOfVisibleCompareItems + 1 >= 4
                                            ? { width: 208, position: "relative", top: 80 }
                                            : { top: "-24" }),
                                    }}
                                    placeholderText={"Enter a website..."}
                                    headerText={this.services.translate(
                                        "autocomplete.websitesCompare.seperator.text.similarSites",
                                    )}
                                />
                            ) : (
                                <AutocompleteWebsitesCompareItem
                                    className="AutocompleteWebsitesQueryBar"
                                    similarSites={similarSites}
                                    autocompleteProps={{
                                        placeholder: this.services.translate(
                                            "querybar.websites.comparebutton.autocomplete.placeholder",
                                        ),
                                        ...(isSmallScreen && numOfVisibleCompareItems + 1 >= 4
                                            ? { width: 208, position: "relative", top: 4 }
                                            : { top: "-16" }),
                                    }}
                                    onClick={this.onCompareButtonAutocompleteItemClick}
                                    onCloseButtonClick={
                                        this.onCompareButtonAutocompleteCloseButtonClick
                                    }
                                    excludes={[...chosenItemsState, ...compareSitesToBeAdded]}
                                    onKeyUp={this.onKeyUp}
                                    onArrowKeyPress={this.onArrowKeyPress}
                                    overrideEnterFunc={getOverrideEnterFunc}
                                />
                            )
                        ) : null}
                    </div>
                    <InvalidDomainModal
                        onChangeWebsiteClick={this.onChangeWebsiteClickInvalidDomainModalClick}
                        onContinue={this.onContinueInvalidDomainModalClick}
                        isOpen={
                            this.state.invalidDomainModalOpen &&
                            this.state.invalidDomains &&
                            this.state.invalidDomains.length > 0
                        }
                        domains={this.state.invalidDomains}
                        isCompare={this.isCompare()}
                    />
                </WebsiteQueryBarContainer>
                <PageOverlay isOpen={isOverlayOpen} />
            </>
        );
    }

    protected getState() {
        return {
            promoteCompareForState: !this.didCurrentStateCompare(),
        };
    }

    private didCurrentStateCompare() {
        const stateParams = this.services.swNavigator.current();
        return (
            this.props.statesDidCompare.indexOf(`${STATE_COMPARE_PREFIX}_${stateParams.name}`) > -1
        );
    }

    private isCompare() {
        return this.services.chosenSites.isCompare();
    }

    @autobind
    private compareList() {
        const showBadge =
            !this.state.isCompareButton && this.state.compareSitesToBeAdded.length === 0;
        const getOverrideEnterFunc = !this.state.hasEngagedAutocomplete ? this.onPressEnter : null;
        const isSmallScreen = this.state.windowWidth <= BREAK_POINT;
        const currentCompareList = _.map(
            this.state.chosenItemsState.slice(1),
            (item: IChosenItem, index) => {
                return (
                    <QueryBarItem
                        key={item.name}
                        id={item.name}
                        isLoading={this.state.isFetching}
                        activeItem={this.state.activeItem}
                        renderComponent={
                            <WebsiteTooltip
                                domain={item.name}
                                placement="bottom-left"
                                debounce={1500}
                                appendTo={".QueryBar"}
                            >
                                <div>
                                    <QueryBarWebsiteItem
                                        text={item.name}
                                        image={item.icon ? item.icon : item.image}
                                        onItemClick={this.onItemTextClick(item.name)}
                                        onButtonClick={this.removeItem(item)}
                                        badgeColor={
                                            showBadge
                                                ? this.services.chosenSites.getSiteColor(item.name)
                                                : undefined
                                        }
                                        isCompare={true}
                                    />
                                </div>
                            </WebsiteTooltip>
                        }
                        searchComponent={
                            <AutocompleteWebsitesCompareItem
                                className="AutocompleteWebsitesQueryBar"
                                onClick={this.onCompareItemAutocompleteItemClick}
                                similarSites={this.state.similarSites}
                                excludes={[...this.state.chosenItemsState]}
                                onCloseButtonClick={this.onCompareItemAutocompleteCloseButtonClick}
                                onKeyUp={this.onKeyUp}
                                onArrowKeyPress={this.onArrowKeyPress}
                                overrideEnterFunc={getOverrideEnterFunc}
                                autocompleteProps={{
                                    placeholder: `${
                                        this.state.activeItem ? this.state.activeItem : ""
                                    }`,
                                    ...(isSmallScreen && index === 3 ? { width: 208 } : {}),
                                }}
                            />
                        }
                        loadingComponent={
                            <LoadingComponent
                                loaderStyles={{
                                    ...(isSmallScreen && index === 3 ? { width: 208 } : {}),
                                }}
                                placeholderText={item.name}
                                headerText={this.services.translate(
                                    "autocomplete.websitesCompare.seperator.text.similarSites",
                                )}
                            />
                        }
                    />
                );
            },
        );
        const newCompareList = _.map(this.state.compareSitesToBeAdded, (item: IChosenItem) => {
            return (
                <QueryBarItem
                    key={item.name}
                    customClassName="compare-site-to-be-added"
                    id={item.name}
                    renderComponent={
                        <QueryBarWebsiteItem
                            text={item.name}
                            image={item.icon}
                            onItemClick={() => null}
                            onButtonClick={this.removeItemFromSitesToBeAddedList(item.name)}
                            isCompare={true}
                        />
                    }
                />
            );
        });
        return [...currentCompareList, ...newCompareList];
    }

    private removeItemFromSitesToBeAddedList = (item) => () => {
        const items = this.state.compareSitesToBeAdded.filter(
            (compareSite) => compareSite.name !== item,
        );
        this.setState({ compareSitesToBeAdded: items });
    };

    private debouncedUpdateChosenItemsParams = _.debounce((isMainSite) => {
        const key = this.state.chosenItemsState.map(({ name }) => name).join();
        const currentState = this.services.swNavigator.current();
        const params = {
            key,
            ...(isMainSite && currentState.resetOnMainSiteChange ? currentState.reset : {}),
        };
        this.services.swNavigator.updateParams(params);
    }, 800);

    private removeItem = (item) => () => {
        // remove the item from the querybar visually. This logic is to have a quick
        // smooth instant replacement of the item while we wait for the params to update.
        // remove the item from the querybar visually. This logic is to have a quick
        // smooth instant replacement of the item while we wait for the params to update.
        let itemsWithoutRemovedItem;
        const isMainSite = item.name === this.state.chosenItemsState[0].name;
        if (isMainSite) {
            // if item was main item then replace it with the first item in comparedItems
            // state array and remove that compared item from the comparedItems.
            const currentComparedItemsArray = this.state.chosenItemsState.map(
                (comparedItem) => comparedItem,
            );
            // shift removes the first item and returns that item
            currentComparedItemsArray.shift();
            // add the current main items color value to the newMainItem for quick badge color update
            // (when replacing the main item for some reason the color property is
            // not immediately passed to the new main item. Therefor, we add it manually)
            currentComparedItemsArray[0].color = this.state.chosenItemsState[0].color;
            itemsWithoutRemovedItem = currentComparedItemsArray;
        } else {
            itemsWithoutRemovedItem = this.state.chosenItemsState.filter(
                (comparedItem) => comparedItem.name !== item.name,
            );
        }
        this.setState({ chosenItemsState: itemsWithoutRemovedItem, activeItem: null }, () => {
            this.debouncedUpdateChosenItemsParams(isMainSite);
        });
    };

    private getBtnText() {
        if (this.services.rootScope.global.compare.list.length > 0) {
            return i18nFilter()("analysis.header.btn.add");
        } else {
            return i18nFilter()("analysis.header.btn");
        }
    }

    private setDidCompareForCurrentState = () => {
        const stateParams = this.services.swNavigator.current();
        if (stateParams.promoteCompareForStateTitle && !this.didCurrentStateCompare()) {
            this.setState({ promoteCompareForState: false });
            this.props.onStateCompare(`${STATE_COMPARE_PREFIX}_${stateParams.name}`);
        }
    };

    private onChangeWebsiteClickInvalidDomainModalClick = () => {
        SwTrack.all.trackEvent(
            "Small website notification",
            "change query",
            `${this.state.invalidDomains.join(",")}`,
        );
        this.setState({ invalidDomainModalOpen: false });
        if (this.isCompare()) {
            this.setState({ isCompareButton: true, isOverlayOpen: true });
        } else {
            const pageStateObj = this.services.swNavigator.current();
            this.services.swNavigator.go(pageStateObj.homeState);
        }
    };

    private onContinueInvalidDomainModalClick = () => {
        SwTrack.all.trackEvent(
            "Small website notification",
            "close",
            `${this.state.invalidDomains.join(",")}`,
        );
        if (this.isCompare()) {
            const validDomains = this.services.swNavigator
                .getParams()
                .key.split(",")
                .filter((domain) => !this.state.invalidDomains.includes(domain));
            this.setState({ invalidDomainModalOpen: false });
            this.services.swNavigator.applyUpdateParams({
                key: validDomains.join(","),
            });
        } else {
            this.setState({ invalidDomainModalOpen: false });
        }
    };

    private checkWebsiteVaildity(chosenItems) {
        const isFroUser = this.services.swSettings.user.isFro;
        if (isFroUser) {
            const stateParams = this.services.swNavigator.getParams();
            // tslint:disable-next-line:max-line-length
            const websiteValidyUrl = `/api/websiteValidity?keys=${chosenItems
                .map((item) => item.name)
                .join(",")}&webSource=${stateParams.webSource || "Desktop"}&country=${
                stateParams.country
            }`;
            this.services.fetchService
                .get(websiteValidyUrl)
                .then((res) => {
                    const invalidDomains = chosenItems
                        .filter((itm) => res[itm.name] === DOMAIN_DATA_STATUS.Invalid)
                        .map((itm) => itm.name);
                    this.setState({ invalidDomains, invalidDomainModalOpen: true });
                })
                .catch((err) => swLog.error(`Error verifyling website validity: ${err}`));
        } else {
            return;
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WebsiteQueryBar);
