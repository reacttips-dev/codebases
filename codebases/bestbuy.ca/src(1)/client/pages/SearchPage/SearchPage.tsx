import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {IBrowser as ScreenSize} from "redux-responsive";
import {
    productLoadActionCreators,
    ProductLoadActionCreators,
    routingActionCreators,
    RoutingActionCreators,
    searchActionCreators,
    SearchActionCreators,
    adActionCreators,
    AdActionCreators,
} from "actions";
import ProductsSortDropdown from "components/FilterBar/SortDropdown";
import HeadTags from "components/HeadTags";
import Link from "components/Link";
import PageContent from "components/PageContent";
import ProductListing from "components/ProductListing";
import LoadMore from "components/ProductListing/LoadMore";
import ProductListPlaceholder from "components/ProductListing/ProductListPlaceHolder";
import {facetSystemNames, facetSimpleNames} from "../../constants";
import {
    SearchState,
    ProductSort,
    Ssc,
    Brand,
    GlobalCMSContexts,
    GlobalCMSContext,
    GlobalContentState,
    Facet,
} from "models";
import {RoutingState} from "reducers";
import {State} from "store";
import routeManager from "utils/routeManager";
import Facets from "./components/Facets";
import SearchResultHeader from "./components/ResultHeader";
import * as styles from "./style.css";
import messages from "./translations/messages";
import PromoBanner from "components/PromoBanner";
import ShopByCategory from "pages/CategoryPage/components/ShopByCategory";
import {sendCriteoImagePixel} from "utils/criteo";
import FilterBar from "components/FilterBar";
import {AdLoader, AdItem, AvailableAdFormats} from "components/Advertisement";
import {buildAdItemsFromSectionData, buildAdItemsFromGlobalContentContexts} from "components/Advertisement/AdSlotUtils";
import {
    SearchCollectionAdTargetingProps,
    AdTargetingProps,
    SearchQueryAdTargetingProps,
    SearchBrandAdTargetingProps,
} from "components/Advertisement/GooglePublisherTag";
import {FeatureToggles, TestPencilAdIds} from "config";
import {getHelpTopicsId} from "@bbyca/apex-components/dist/utils/helpTopics";
import PillList from "components/PillList";
import {AdLoaderProps} from "components/Advertisement/AdLoader";
import {Key} from "@bbyca/apex-components";
import PLPHeader from "../ProductListingPage/components/Header";
import HeaderDynamicContent from "pages/ProductListingPage/components/HeaderDynamicContent";
import {ProductListingPageProps as PLPPageProps} from "pages/ProductListingPage";
import PLPFooter from "pages/ProductListingPage/components/Footer";
import {FacetFilterRemovePayload} from "models/Analytics";
import {SingleColumn} from "pages/PageLayouts";
import ContactUs from "components/ContactUs";
import {getGlobalContentContexts} from "utils/globalContent";
import {GlobalInfoMessage} from "@bbyca/bbyca-components";
import enMessages from "./translations/en.json";
import frMessages from "./translations/fr.json";
import {getPricePill, getFilteredProducts} from "../../utils/search";
import {getScreenSize} from "store/selectors";

export interface SearchPageProps extends SearchState {
    features: FeatureToggles;
    env: string;
    appEnv: string;
    language: Language;
    locale: Locale;
    regionName: string;
    routing: RoutingState;
    isPlpAvailabilityEnabled: boolean;
    geekSquadSubscriptionSKU: string;
    screenSize: ScreenSize;
    brand: Brand;
    ssc: Ssc;
    globalContent: GlobalContentState;
    cellphonePlansCategoryId: string;
    minPrice: string;
    maxPrice: string;
    appliedRangeQuery: boolean;
    rangeQueryHasResults: boolean;
    showListings?: boolean;
    testPencilAdIds: TestPencilAdIds;
    path: string;
}

export interface DispatchProps {
    actions: SearchActionCreators;
    adActions: AdActionCreators;
    productLoadActions: ProductLoadActionCreators;
    routingActions: RoutingActionCreators;
}

interface AdTargetingPropsPageData {
    collectionId?: string;
    brandName?: string;
    query?: string;
}

interface OwnState {
    rpuToggleFilter?: boolean;
}

/**
 * This container is used to display search, brand, and collection pages
 */
export class Search extends React.Component<
    SearchPageProps & DispatchProps & InjectedIntlProps & PLPPageProps,
    OwnState
> {
    public static displayName: string = "Search";
    private facetSystemNamesToExclude: {brand: string[]; search: string[]; collection: string[]};

    constructor(props) {
        super(props);
        this.state = {
            rpuToggleFilter: false,
        };
        this.facetSystemNamesToExclude = {
            brand: [facetSystemNames.brandName, facetSystemNames.soldAndShippedBy],
            collection: [facetSystemNames.soldAndShippedBy],
            search: [facetSystemNames.soldAndShippedBy],
        };
        this.fireCriteoViewProductBeacon = this.fireCriteoViewProductBeacon.bind(this);
    }

    public render() {
        const {
            screenSize,
            searching,
            searchResult,
            ssc,
            brand,
            wasFacetFilterSelected,
            dynamicContent,
            features,
            breadcrumbList,
            pageBottomGlobalContent,
            pageFooterGlobalContent,
            cellphonePlansCategoryId,
            showListings = true,
            path,
        } = this.props;
        let facets = null;
        if (searchResult) {
            facets = (
                <Facets
                    facets={searchResult.facets}
                    facetsToExclude={this.facetSystemNamesToExclude[this.props.routing && this.props.routing.pageKey]}
                    loading={searching}
                />
            );
        }

        const searchResultHeader = searchResult && (
            <SearchResultHeader
                className={styles.searchResultHeader}
                searchResult={searchResult}
                onToggle={this.handleOnToggle}
                onRpuFilterToggle={this.handleRpuFilterToggle}
                rpuToggleFilter={this.state.rpuToggleFilter}
                isSearching={searching}
                sort={
                    screenSize.greaterThan.small && (
                        <ProductsSortDropdown sort={this.props.sort} handleChange={this.handleSortChange} />
                    )
                }
            />
        );

        const hasPromo = ssc && ssc.promoBanner && Object.keys(ssc.promoBanner).length > 0 && ssc.promoBanner.image;
        const hasShopByCategory = ssc && ssc.shopByCategory && Object.keys(ssc.shopByCategory).length > 0;
        const merchandisedContentEnabled = !(wasFacetFilterSelected && this.props.routing.pageKey === "collection");
        const hasValidSearchReturned = !searching && searchResult && searchResult.total > 0;
        const noResultsFeature = features.noSearchResults;
        const noResults = searchResult && searchResult.total <= 0;

        const searchPageAdLoaderProps: AdLoaderProps = this.buildAdLoaderProps();
        const isCollectionAndBrandPageAdsReadyToLoad =
            (this.isPage("collection") || this.isPage("brand")) && dynamicContent;
        const isSearchPageAdsReadyToLoad = this.isPage("search");
        const canRenderAdLoader = isSearchPageAdsReadyToLoad || isCollectionAndBrandPageAdsReadyToLoad;

        const filteredProducts = getFilteredProducts(
            this.props.searchResult,
            this.props.availabilities,
            this.state.rpuToggleFilter,
        );

        const {overviewTitle, overview} = (!!dynamicContent && dynamicContent.seo) || {};

        const noPriceSearchResultMsgBox = this.getNoPriceSearchResultMsgBox();
        const plpBannerContent =
            !ssc &&
            !brand &&
            !wasFacetFilterSelected &&
            !path &&
            (searchResult?.totalSelectedFilterCount ?? 0) === 0 &&
            dynamicContent;

        return (
            <SingleColumn.Container>
                <div className={`${styles.container} x-search-page`}>
                    <HeadTags
                        title={this.props.headTags && this.props.headTags.metaTitle}
                        metaTags={this.getMetaTags()}
                        links={this.getMetaLinks()}
                    />
                    <SingleColumn.Main>
                        {!searching && noResultsFeature && noResults ? (
                            this.renderNoResults()
                        ) : (
                            <>
                                {!!canRenderAdLoader && <AdLoader {...searchPageAdLoaderProps} />}
                                <div>
                                    <PLPHeader
                                        title={this.props.title}
                                        breadcrumbList={breadcrumbList}
                                        desktopOnlyTitle={this.props.desktopTitleOnly}
                                    />
                                    <HeaderDynamicContent
                                        wasFacetFilterSelected={wasFacetFilterSelected}
                                        isLoading={searching}
                                        language={this.props.language}
                                        regionName={this.props.regionName}
                                        sectionList={dynamicContent ? dynamicContent.sections : []}
                                        screenSize={screenSize}
                                    />
                                    {merchandisedContentEnabled &&
                                        screenSize.lessThan.medium &&
                                        (hasPromo || hasShopByCategory) && (
                                            <div className={styles.promoContainer}>
                                                {hasPromo && this.renderPromoBanner()}
                                                {hasShopByCategory && this.renderShopByCategory()}
                                            </div>
                                        )}
                                    {showListings && (
                                        <>
                                            {screenSize.lessThan.medium && searchResultHeader}
                                            {screenSize.lessThan.medium && (
                                                <FilterBar
                                                    sort={this.props.sort}
                                                    handleSortChange={this.handleSortChange}
                                                    content={facets}
                                                    selectedFilterCount={searchResult && this.getSelectedFilterCount()}
                                                    screenSize={screenSize}
                                                    className={!hasValidSearchReturned ? styles.hide : ""}
                                                />
                                            )}
                                        </>
                                    )}
                                    {showListings && (
                                        <div className={styles.productsContainer}>
                                            {searchResult && screenSize.greaterThan.small && (
                                                <div className={styles.facetContainer}>{facets}</div>
                                            )}
                                            <div className={styles.productListingContainer}>
                                                {screenSize.greaterThan.small && (
                                                    <React.Fragment>
                                                        {merchandisedContentEnabled &&
                                                            hasPromo &&
                                                            this.renderPromoBanner()}
                                                        {merchandisedContentEnabled &&
                                                            hasShopByCategory &&
                                                            this.renderShopByCategory()}
                                                        {searchResultHeader}
                                                    </React.Fragment>
                                                )}
                                                {noPriceSearchResultMsgBox}
                                                <PillList
                                                    className={styles.pillList}
                                                    pills={this.getPills(
                                                        searchResult ? searchResult.selectedFacets : [],
                                                    )}
                                                    onClear={this.clearAllFilterPill}
                                                    language={this.props.language}
                                                />
                                                {searching || !searchResult ? (
                                                    <ProductListPlaceholder />
                                                ) : (
                                                    <ProductListing
                                                        products={filteredProducts}
                                                        availabilities={this.props.availabilities}
                                                        geekSquadSubscriptionSKU={this.props.geekSquadSubscriptionSKU}
                                                        regionName={this.props.regionName}
                                                        onProductItemClick={this.onProductItemClick}
                                                        screenSize={screenSize}
                                                        onProductItemScrollIntoView={this.fireCriteoViewProductBeacon}
                                                        rpuToggleFilter={this.state.rpuToggleFilter}
                                                        cellphonePlansCategoryId={cellphonePlansCategoryId}
                                                        dynamicContent={plpBannerContent}
                                                        language={this.props.language}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {showListings && (
                                    <>
                                        {brand ? (
                                            <Link
                                                to="brand"
                                                params={[brand.name.toLowerCase()]}
                                                query={{page: this.props.page + 1}}
                                                className={styles.buttonLoadMoreLink}>
                                                {this.renderLoadMore()}
                                            </Link>
                                        ) : (
                                            this.renderLoadMore()
                                        )}
                                    </>
                                )}
                                <PLPFooter
                                    seoBlock={{
                                        title: overviewTitle,
                                        content: overview,
                                        screenSize,
                                    }}
                                    pageBottomGlobalContent={pageBottomGlobalContent}
                                    pageFooterGlobalContent={pageFooterGlobalContent}
                                />
                                {dynamicContent && dynamicContent.displayContactUs && <ContactUs />}
                            </>
                        )}
                    </SingleColumn.Main>
                </div>
            </SingleColumn.Container>
        );
    }

    public async componentDidMount() {
        // Handle case when flag is set, then navigating away from a search page, then back to a search page
        this.props.actions.resetWasFacetFilterSelected();
        const pageKey = this.props.routing.pageKey;
        await this.getSearchResults(!this.props.searchResult);
        // pageKey can be changed by brand, collection redirectUrl, which will lead to incorrect adobe analytics tracking!
        if (pageKey === this.props.routing.pageKey) {
            this.props.actions.trackProductListPageLoad(this.props.routing.pageKey);
        }
    }

    public async componentDidUpdate(prevProps: SearchPageProps) {
        if (
            this.props.routing.pageKey !== prevProps.routing.pageKey ||
            (this.props.sscId && this.props.sscId !== prevProps.sscId)
        ) {
            this.props.actions.clearDynamicContent();
        }
        if (this.props.routing.locationBeforeTransitions !== prevProps.routing.locationBeforeTransitions) {
            const pageKey = this.props.routing.pageKey;
            await this.getSearchResults(!this.props.searchResult);
            if (
                pageKey === this.props.routing.pageKey &&
                (prevProps.routing.locationBeforeTransitions.query.search !==
                    this.props.routing.locationBeforeTransitions.query.search ||
                    prevProps.routing.locationBeforeTransitions.pathname !==
                        this.props.routing.locationBeforeTransitions.pathname)
            ) {
                this.props.actions.trackProductListPageLoad(this.props.routing.pageKey);
                this.setState({rpuToggleFilter: false});
            }
            if (
                this.props.routing.locationBeforeTransitions?.query?.search !==
                prevProps?.routing?.locationBeforeTransitions?.query?.search
            ) {
                this.props.actions.resetWasFacetFilterSelected();
            }
        }

        // If there is no availability and isPlpAvailabilityEnabled becomes true, should get availabilities
        if (
            Object.keys(this.props.availabilities).length === 0 &&
            !prevProps.isPlpAvailabilityEnabled &&
            this.props.isPlpAvailabilityEnabled
        ) {
            await this.props.actions.getAvailabilities();
        }
    }

    public componentWillUnmount() {
        this.props.actions.setInitialSearchState();
    }

    public shouldComponentUpdate(nextProps: SearchPageProps, nextState) {
        if (this.props.isPlpAvailabilityEnabled === undefined && nextProps.isPlpAvailabilityEnabled === false) {
            return false;
        }
        return true;
    }

    private clearAllFilterPill = () => {
        this.setState({rpuToggleFilter: false});
        this.props.actions.removeAllFilters();
    };

    private getMetaTags = () => {
        // TODO: Exactly the same as categorypage - combine when ready
        const metaTags = [];
        if (
            this.props.dynamicContent &&
            this.props.dynamicContent.seo &&
            this.props.dynamicContent.seo.metaDescription
        ) {
            metaTags.push({name: "description", content: this.props.dynamicContent.seo.metaDescription});
        }
        if (this.props.headTags && this.props.headTags.metaRobots) {
            metaTags.push(this.props.headTags.metaRobots);
        }
        return metaTags;
    };

    private getMetaLinks = () => {
        // TODO: Exactly the same as categorypage - combine when ready
        if (!!this.props.dynamicUrlParams && this.props.dynamicUrlParams.length > 0) {
            const canonicalUrl = routeManager.getCanonicalUrlByKey(
                this.props.language,
                this.props.routing.pageKey,
                ...this.props.dynamicUrlParams,
            );

            const isLastPage = !!this.props.searchResult && this.props.page === this.props.searchResult.totalPages;
            const isFirstPage = this.props.page === 1;
            const getPageUrl = (relType, pageNum) =>
                routeManager.getRelLinksByKey(
                    this.props.language,
                    this.props.routing.pageKey,
                    relType,
                    pageNum,
                    ...this.props.dynamicUrlParams,
                );
            const relationNextUrl =
                !!this.props.searchResult && !isLastPage ? getPageUrl("next", this.props.page + 1) : "";
            const relationPrevUrl = !isFirstPage ? getPageUrl("prev", this.props.page - 1) : "";

            return [
                canonicalUrl && {rel: "canonical", href: canonicalUrl},
                relationNextUrl && {rel: "next", href: relationNextUrl},
                relationPrevUrl && {rel: "prev", href: relationPrevUrl},
            ];
        }

        return [];
    };

    private getSearchResults = async (forceUpdate: boolean) => {
        await this.props.actions.syncStateWithLocation(this.props.routing.locationBeforeTransitions, forceUpdate);
        await this.props.actions.getAvailabilities();
    };

    private renderNoResults = () => {
        return (
            <PageContent>
                <div className={styles.noSearchResults}>
                    <h1 data-automation="no-result-title">
                        {" "}
                        <FormattedMessage {...messages.noResultsTitle} values={{keyword: this.props.query}} />
                    </h1>
                    <h3>
                        {" "}
                        <FormattedMessage {...messages.noResultsTips0} />{" "}
                    </h3>
                    <ul>
                        <li>
                            <FormattedMessage {...messages.noResultsTips1} />{" "}
                        </li>
                        <li>
                            <FormattedMessage {...messages.noResultsTips2} />{" "}
                        </li>
                        <li>
                            <FormattedMessage {...messages.noResultsTips3} />{" "}
                        </li>
                    </ul>
                    <p className={styles.noSearchResultsContact}>
                        <FormattedMessage {...messages.noResultsCantFind} />{" "}
                        <Link
                            to="help"
                            params={this.props.env && getHelpTopicsId(this.props.env).contactUs}
                            extraAttrs={{"data-automation": "no-result-contact-us"}}>
                            {" "}
                            <FormattedMessage {...messages.noResultsContact} />
                        </Link>
                    </p>
                </div>
            </PageContent>
        );
    };

    private handleOnToggle = (facetSystemName: string, filterName: string, payload: any) => {
        this.props.actions.selectFilter(facetSystemName, filterName, payload);
    };

    private handleRpuFilterToggle = (
        isFilterEnabled: boolean,
        facetSystemName: string,
        filterName: string,
        payload: any,
        pageSize: number,
    ) => {
        this.setState({rpuToggleFilter: isFilterEnabled});
        this.props.actions.selectFilter(facetSystemName, filterName, payload, pageSize, isFilterEnabled);
    };

    private handleSortChange = async (sort: ProductSort, payload: any) => {
        const pageSize = this.state.rpuToggleFilter ? 96 : 24;
        await this.props.actions.sort(sort, payload, pageSize);
    };

    private loadMoreResults = () => {
        this.props.actions.loadMore();
    };

    private onProductItemClick = (sku: string, seoText: string) => {
        this.props.productLoadActions.loadProduct(sku, seoText);
    };

    private getSelectedFilterCount = (): number => {
        const totalSelectedFilterCount = this.props.searchResult.totalSelectedFilterCount;
        let totalHiddenFilterCount = 0;

        if (totalSelectedFilterCount > 0) {
            if (this.isFacetSelected(facetSystemNames.soldAndShippedBy)) {
                totalHiddenFilterCount += 1;
            }
            if (this.isPage("brand") && this.isFacetSelected(facetSystemNames.brandName)) {
                totalHiddenFilterCount += 1;
            }
        }

        return totalSelectedFilterCount - totalHiddenFilterCount;
    };

    private isPage = (pageKey: string): boolean => {
        return this.props.routing.pageKey === pageKey;
    };

    private isFacetSelected = (facetSystemName: string): boolean => {
        return !!this.props.searchResult.facets.find(
            (filter) => filter.systemName === facetSystemName && filter.selectedFilterCount > 0,
        );
    };

    private renderPromoBanner = () => {
        const {screenSize, ssc} = this.props;
        return <PromoBanner merchItem={ssc.promoBanner} screenSize={screenSize} />;
    };

    private renderShopByCategory = () => {
        const {screenSize, ssc} = this.props;
        const {items, title} = ssc.shopByCategory;
        return <ShopByCategory screenSize={screenSize} items={items} title={title} />;
    };

    private renderLoadMore = () => {
        const {screenSize, searchResult} = this.props;
        const isEndOfResults = searchResult && this.props.page === searchResult.totalPages;
        return (
            <LoadMore
                className={styles.loadMoreButtonContainer}
                shouldRender={searchResult && searchResult.products.length !== 0}
                isLoading={this.props.loadingMore}
                isEndOfResults={isEndOfResults}
                onLoadMoreButtonTap={this.loadMoreResults}
                screenSize={screenSize}
            />
        );
    };

    private fireCriteoViewProductBeacon(sku: string) {
        const criteoProduct = this.props.searchResult.products.find(
            (product) => product.sku === sku && product.isSponsored,
        );
        if (criteoProduct) {
            const criteoViewBeaconUrl = criteoProduct.criteoData.OnViewBeacon;
            sendCriteoImagePixel(criteoViewBeaconUrl);
        }
    }

    private getNoPriceSearchResultMsgBox = () => {
        let noPriceSearchResultMsgBox = null;
        if (
            this.props.features.minMaxPriceFacetEnabled &&
            (this.props.minPrice || this.props.maxPrice) &&
            this.props.appliedRangeQuery &&
            !this.props.rangeQueryHasResults
        ) {
            const localizedMessage =
                this.props.language === "fr"
                    ? frMessages[messages.noResultsMinMaxPriceFacet.id]
                    : enMessages[messages.noResultsMinMaxPriceFacet.id];
            const priceRangeIndex = localizedMessage.indexOf("{priceRange}");
            const messagePart1 = localizedMessage.substring(0, priceRangeIndex);
            const messagePart2 = localizedMessage.substring(priceRangeIndex + 12);
            const displayMessage =
                this.props.language === "fr"
                    ? `${this.props.minPrice} à ${this.props.maxPrice} $`
                    : `$${this.props.minPrice} - $${this.props.maxPrice}`;
            noPriceSearchResultMsgBox = (
                <div className={styles.noResultMessageContainer}>
                    <GlobalInfoMessage>
                        {messagePart1}
                        <b>{displayMessage}</b>
                        {messagePart2}
                    </GlobalInfoMessage>
                </div>
            );
        }
        return noPriceSearchResultMsgBox;
    };

    private getPills = (facets: Facet[]) => {
        let pills = [];
        const minPrice = this.props.minPrice;
        const maxPrice = this.props.maxPrice;
        (facets || []).forEach((facet) => {
            if (!(this.facetSystemNamesToExclude[this.props.routing.pageKey] || []).includes(facet.systemName)) {
                (facet.filters || []).forEach((filter) => {
                    if (filter.isSelected) {
                        const filterName = filter.name;
                        const systemName = facet.systemName;
                        const payload: FacetFilterRemovePayload = {
                            action: "remove",
                            facetName: facet.name,
                            facetType: "pill",
                            link: filterName,
                        };
                        pills = [
                            ...pills,
                            {
                                name: filterName,
                                onClose: () => this.props.actions.selectFilter(systemName, filterName, payload),
                            },
                        ];
                    }
                });

                if (
                    this.props.features.minMaxPriceFacetEnabled &&
                    facet.name === facetSimpleNames.price[this.props.language] &&
                    (minPrice || maxPrice) &&
                    this.props.rangeQueryHasResults
                ) {
                    pills = getPricePill(
                        this.props.language,
                        minPrice,
                        maxPrice,
                        pills,
                        this.props.actions.applyPriceRangeQuery,
                    );
                }
            }
        });
        return pills;
    };

    private buildAdLoaderProps = () => {
        const {
            globalContent,
            brand,
            dynamicContent,
            sscId,
            query,
            routing,
            searching,
            adActions,
            appEnv,
            locale,
        } = this.props;
        const baseAdTargetingProps: AdTargetingProps = {
            environment: appEnv,
            lang: locale,
        };
        const getGlobalContentFromKey = (key: GlobalCMSContexts): GlobalCMSContext =>
            globalContent && globalContent.content && (globalContent.content[key] as GlobalCMSContext);
        const brandName = brand && brand.name;
        const globalContentContexts: GlobalCMSContext[] = [];
        const pencilAdABCtestItems = (this.isPage("search") || this.isPage("collection")) && !!this.props.testPencilAdIds ?
            [
                {
                    format: AvailableAdFormats.pencilAd,
                    id: this.isPage("search")
                        ? this.props.testPencilAdIds.search
                        : this.props.testPencilAdIds.collection,
                },
            ] : [];
        if (this.isPage("search")) {
            globalContentContexts.push(getGlobalContentFromKey(GlobalCMSContexts.searchBottom));
        } else if (this.isPage("collection") && getGlobalContentFromKey(GlobalCMSContexts.collectionFooter)) {
            const globalCollectionContexts = [GlobalCMSContexts.collectionBottom, GlobalCMSContexts.collectionFooter];
            globalContentContexts.push(
                ...getGlobalContentContexts(globalContent && globalContent.content, globalCollectionContexts),
            );
        } else if (this.isPage("brand") && getGlobalContentFromKey(GlobalCMSContexts.brandFooter)) {
            globalContentContexts.push(getGlobalContentFromKey(GlobalCMSContexts.brandFooter));
        }
        const dynamicContentAdItems =
            (!this.isPage("search") &&
                buildAdItemsFromSectionData((dynamicContent && dynamicContent.sections) || [])) ||
            [];
        const globalContentAdItems =
            (globalContentContexts.length && buildAdItemsFromGlobalContentContexts(globalContentContexts)) || [];
        const adItems: AdItem[] = [...pencilAdABCtestItems, ...dynamicContentAdItems, ...globalContentAdItems];
        const searchPageAdLoaderProps: AdLoaderProps = {
            items: adItems,
            adTargetingProps: this.buildAdTargetingPropsByPageKey(
                routing && routing.pageKey,
                {collectionId: sscId, brandName, query},
                baseAdTargetingProps,
            ),
            callbackOnAdRendered: adActions.adLoaded,
            isReady: this.isPage("collection") || searching,
        };
        return searchPageAdLoaderProps;
    };

    private buildAdTargetingPropsByPageKey(
        pageKey: Key,
        {collectionId, brandName, query}: AdTargetingPropsPageData,
        baseAdTargetingProps: AdTargetingProps,
    ) {
        switch (pageKey) {
            case "search":
                return {...baseAdTargetingProps, query} as SearchQueryAdTargetingProps;
            case "collection":
                return {...baseAdTargetingProps, collectionId} as SearchCollectionAdTargetingProps;
            case "brand":
                return {...baseAdTargetingProps, brandName} as SearchBrandAdTargetingProps;
        }
    }
}

const mapStateToProps = (state: State, ownProps: PLPPageProps): SearchPageProps & PLPPageProps => {
    return {
        env: state.app.environment.nodeEnv,
        appEnv: state.app.environment.appEnv,
        geekSquadSubscriptionSKU: state.config.checkout.geekSquadSubscriptionSKU,
        isPlpAvailabilityEnabled: state.config.remoteConfig.isPlpAvailabilityEnabled,
        language: state.intl.language,
        locale: state.intl.locale,
        regionName: state.user.shippingLocation.regionName,
        router: ownProps.router,
        routing: state.routing,
        screenSize: getScreenSize(state),
        ssc: state.search.searchResult && state.search.searchResult.ssc,
        features: state.config.features,
        globalContent: state.app.globalContent,
        minPrice: state.search.minPrice,
        maxPrice: state.search.maxPrice,
        appliedRangeQuery: state.search.appliedRangeQuery,
        rangeQueryHasResults: state.search.rangeQueryHasResults,
        testPencilAdIds: state.config.testPencilAdIds,
        ...state.search,
        ...ownProps,
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        actions: bindActionCreators(searchActionCreators, dispatch),
        adActions: bindActionCreators(adActionCreators, dispatch),
        productLoadActions: bindActionCreators(productLoadActionCreators, dispatch),
        routingActions: bindActionCreators(routingActionCreators, dispatch),
    };
};

export default connect<SearchPageProps, DispatchProps, PLPPageProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(Search));
