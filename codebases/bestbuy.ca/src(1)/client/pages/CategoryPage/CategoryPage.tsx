import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {RoutingState} from "reducers";
import {bindActionCreators} from "redux";
import {IBrowser as ScreenSize} from "redux-responsive";
import {scroller} from "react-scroll";
import {
    adActionCreators,
    AdActionCreators,
    productLoadActionCreators,
    ProductLoadActionCreators,
    routingActionCreators,
    RoutingActionCreators,
    searchActionCreators,
    SearchActionCreators,
} from "actions";
import ProductsSortDropdown from "components/FilterBar/SortDropdown";
import HeadTags from "components/HeadTags";
import Link from "components/Link";
import ProductListing from "components/ProductListing";
import EndOfResults from "components/ProductListing/EndOfResults";
import LoadMore from "components/ProductListing/LoadMore";
import ProductListPlaceholder from "components/ProductListing/ProductListPlaceHolder";
import {SearchState, ProductSort, Facet, GlobalCMSContextMap} from "models";
import {State} from "store";
import routeManager from "utils/routeManager";
import Facets from "pages/SearchPage/components/Facets";
import SearchResultHeader from "pages/SearchPage/components/ResultHeader";
import {facetSystemNames, facetSimpleNames} from "../../constants";
import Categories from "./components/Categories";
import * as styles from "./style.css";
import {TopSellers} from "components/recommendations/TopSellers";
import FilterBar from "components/FilterBar";
import {AdLoader, AdItem} from "components/Advertisement";
import {buildAdItemsFromSectionData} from "components/Advertisement/AdSlotUtils";
import {sendCriteoImagePixel} from "utils/criteo";
import PillList from "components/PillList";
import PLPHeader from "../ProductListingPage/components/Header";
import PLPFooter from "../ProductListingPage/components/Footer";
import HeaderDynamicContent from "pages/ProductListingPage/components/HeaderDynamicContent";
import {PLPPageProps} from "../ProductListingPage";
import {FacetFilterRemovePayload} from "models/Analytics";
import {CategoryAdTargetingProps} from "components/Advertisement/GooglePublisherTag";
import {SingleColumn} from "pages/PageLayouts";
import ContactUs from "components/ContactUs";
import messages from "../SearchPage/translations/messages";
import {FeatureToggles} from "config";
import {GlobalInfoMessage} from "@bbyca/bbyca-components";
import {getPricePill, getFilteredProducts} from "../../utils/search";
import {AvailableAdFormats} from "components/Advertisement";
import {TestPencilAdIds} from "config";
import {getScreenSize} from "store/selectors";

export interface StateProps extends SearchState {
    appEnv: string;
    language: Language;
    regionName: string;
    routing: RoutingState;
    geekSquadSubscriptionSKU: string;
    isPlpAvailabilityEnabled: boolean;
    globalContent: GlobalCMSContextMap;
    screenSize: ScreenSize;
    locale: Locale;
    user: any;
    minPrice: string;
    maxPrice: string;
    appliedRangeQuery: boolean;
    rangeQueryHasResults: boolean;
    features: FeatureToggles;
    testPencilAdIds: TestPencilAdIds;
}

export interface DispatchProps {
    actions: SearchActionCreators;
    adActions: AdActionCreators;
    productLoadActions: ProductLoadActionCreators;
    routingActions: RoutingActionCreators;
}

interface OwnState {
    showStaticAdSlot: boolean;
    rpuToggleFilter: boolean;
    categoryFacetClicked: boolean;
}

export type CategoryProps = StateProps & DispatchProps & InjectedIntlProps & PLPPageProps;

export class Category extends React.Component<CategoryProps, OwnState> {
    private filterBar: FilterBar;

    constructor(props) {
        super(props);
        this.state = {
            showStaticAdSlot: true,
            rpuToggleFilter: false,
            categoryFacetClicked: false,
        };
    }

    public render() {
        const {
            availabilities,
            searchResult,
            category,
            searching,
            dynamicContent,
            screenSize,
            sort,
            regionName,
            geekSquadSubscriptionSKU,
            loadingMore,
            wasFacetFilterSelected,
            pageBottomGlobalContent,
            pageFooterGlobalContent,
            ads,
            path,
        } = this.props;
        const hasSearchResult = !!searchResult;

        const searchResultHeader = hasSearchResult && (
            <SearchResultHeader
                className={styles.searchResultHeader}
                searchResult={searchResult}
                onToggle={this.handleOnToggle}
                onRpuFilterToggle={this.handleRpuFilterToggle}
                rpuToggleFilter={this.state.rpuToggleFilter}
                isSearching={searching}
                sort={
                    screenSize.greaterThan.small && (
                        <ProductsSortDropdown sort={sort} handleChange={this.handleSortChange} />
                    )
                }
            />
        );

        const facets = this.buildFilterFacets();
        const hasValidSearchReturned = !searching && searchResult && searchResult.total > 0;
        const pills = (searchResult && this.getPills(searchResult.selectedFacets)) || [];
        const filteredProducts = getFilteredProducts(
            this.props.searchResult,
            this.props.availabilities,
            this.state.rpuToggleFilter,
        );
        const {seo} = (dynamicContent || {}) as Partial<NonNullable<typeof dynamicContent>>;
        const {overviewTitle, overview} = (seo || {}) as Partial<NonNullable<typeof seo>>;
        const adItems = this.getAdItems();
        const adProps = (!!ads && (ads.adTargeting as CategoryAdTargetingProps)) || {};

        const noPriceSearchResultMsgBox = this.getNoPriceSearchResultMsgBox();

        const plpBannerContent =
            !wasFacetFilterSelected &&
            !path &&
            (searchResult?.totalSelectedFilterCount ?? 0) === 0 &&
            dynamicContent;

        return (
            <SingleColumn.Container>
                <div className={styles.container}>
                    <HeadTags
                        title={this.props.headTags && this.props.headTags.metaTitle}
                        metaTags={this.getMetaTags()}
                        links={this.getMetaLinks()}
                    />
                    <SingleColumn.Main>
                        {!!adItems && !!adItems.length && (
                            <AdLoader
                                items={adItems}
                                adTargetingProps={{
                                    lang: this.props.locale,
                                    environment: this.props.appEnv,
                                    ...adProps,
                                }}
                                callbackOnAdRendered={this.props.adActions.adLoaded}
                            />
                        )}
                        <div>
                            <PLPHeader title={this.props.title} breadcrumbList={this.props.breadcrumbList} />
                            <HeaderDynamicContent
                                wasFacetFilterSelected={wasFacetFilterSelected}
                                screenSize={screenSize}
                                sectionList={dynamicContent ? dynamicContent.sections : []}
                                regionName={regionName}
                                language={this.props.language}
                                isLoading={searching}
                            />
                            {this.renderStaticTopSellers()}
                            {category && screenSize.lessThan.medium && searchResultHeader}
                            {screenSize.lessThan.medium && (
                                <FilterBar
                                    ref={(ref) => (this.filterBar = ref)}
                                    sort={sort}
                                    handleSortChange={this.handleSortChange}
                                    content={facets}
                                    selectedFilterCount={searchResult && this.getSelectedFilterCount()}
                                    screenSize={screenSize}
                                    className={!hasValidSearchReturned ? styles.hide : ""}
                                />
                            )}
                            <div className={styles.productsContainer}>
                                {searchResult && screenSize.greaterThan.small && facets}
                                <div className={styles.productListingContainer}>
                                    {screenSize.greaterThan.small && searchResultHeader}
                                    {noPriceSearchResultMsgBox}
                                    <PillList
                                        className={styles.pillList}
                                        pills={pills}
                                        onClear={this.clearAllFilterPill}
                                        language={this.props.language}
                                    />
                                    {searching || !searchResult ? (
                                        <ProductListPlaceholder />
                                    ) : (
                                        <ProductListing
                                            products={filteredProducts}
                                            geekSquadSubscriptionSKU={geekSquadSubscriptionSKU}
                                            availabilities={availabilities}
                                            regionName={regionName}
                                            onProductItemClick={this.onProductItemClick}
                                            onProductItemScrollIntoView={this.fireCriteoViewProductBeacon}
                                            screenSize={screenSize}
                                            rpuToggleFilter={this.state.rpuToggleFilter}
                                            dynamicContent={plpBannerContent}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        {category &&
                            searchResult &&
                            (this.props.page === searchResult.totalPages ? (
                                <EndOfResults />
                            ) : (
                                <Link
                                    to="category"
                                    params={[category.seoText, category.id]}
                                    query={{page: this.props.page + 1}}
                                    className={styles.buttonLoadMoreLink}>
                                    <LoadMore
                                        className={styles.loadMoreButtonContainer}
                                        shouldRender={searchResult && searchResult.products.length !== 0}
                                        isLoading={loadingMore}
                                        screenSize={screenSize}
                                        onLoadMoreButtonTap={this.loadMoreResults}
                                    />
                                </Link>
                            ))}
                        <PLPFooter
                            seoBlock={{
                                title: overviewTitle,
                                content: overview,
                            }}
                            pageBottomGlobalContent={pageBottomGlobalContent}
                            pageFooterGlobalContent={pageFooterGlobalContent}
                        />
                        {dynamicContent && dynamicContent.displayContactUs && <ContactUs />}
                    </SingleColumn.Main>
                </div>
            </SingleColumn.Container>
        );
    }

    public async componentDidMount() {
        // Handle case when flag is set, then navigating away from a category page, then back to a category page
        this.props.actions.resetWasFacetFilterSelected();

        await this.getCategorySearchResults();

        this.props.actions.trackProductListPageLoad(this.props.routing.pageKey);
    }

    public async componentDidUpdate(prevProps) {
        if (prevProps.routing.locationBeforeTransitions !== this.props.routing.locationBeforeTransitions) {
            await this.getCategorySearchResults();

            if (
                prevProps.routing.locationBeforeTransitions.pathname !==
                this.props.routing.locationBeforeTransitions.pathname
            ) {
                // Handle case when flag is set, then navigating between category pages
                this.props.actions.resetWasFacetFilterSelected();
                this.props.actions.trackProductListPageLoad(this.props.routing.pageKey);
                if (!this.state.categoryFacetClicked) {
                    this.setState({rpuToggleFilter: false});
                }
                this.setState({categoryFacetClicked: false});
            }
        }
        /** If there is no availability and isPlpAvailabilityEnabled becomes true, should get availabilities
         */
        if (
            Object.keys(this.props.availabilities).length === 0 &&
            !prevProps.isPlpAvailabilityEnabled &&
            this.props.isPlpAvailabilityEnabled
        ) {
            this.props.actions.getAvailabilities();
        }
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
        // TODO: Exactly the same as searchpage - combine when ready
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

    private getAdItems = (): AdItem[] | false => {
        const pencilAdABCtestItems = !!this.props.testPencilAdIds ? [
            {
                format: AvailableAdFormats.pencilAd,
                id: this.props.testPencilAdIds.category,
            },
        ]: [];
        const customAdItems = (this.props.ads && this.props.ads.adItems) || [];
        const dynamicAdItems =
            (this.props.dynamicContent &&
                this.props.dynamicContent.sections &&
                buildAdItemsFromSectionData(this.props.dynamicContent.sections)) ||
            [];
        return !this.props.searching ? [...pencilAdABCtestItems, ...dynamicAdItems, ...customAdItems] : false;
    };

    private getCategorySearchResults = async () => {
        await this.syncStateWithLocation(this.props);
        await this.props.actions.getAvailabilities();
    };

    private renderStaticTopSellers = () => {
        const {category} = this.props;

        if (category && category.dynamicContent && category.dynamicContent.hasDynamicTopSellers) {
            return null;
        }

        return <TopSellers noCrawl={true} titleAlign="center" />;
    };

    private async syncStateWithLocation(props) {
        await this.props.actions.syncCategoryStateWithLocation(props.routing.locationBeforeTransitions);
    }

    private handleSortChange = async (sort: ProductSort, payload: any) => {
        const pageSize = this.state.rpuToggleFilter ? 96 : 24;
        await this.props.actions.sort(sort, payload, pageSize);
    };

    private loadMoreResults = () => {
        this.props.actions.loadMore();
    };

    private trackCategoryFacetClick = (categoryId: string) => {
        const clickedCategory = this.props.category.subCategories.filter((subCategory) => {
            return subCategory.categoryId === categoryId;
        })[0];

        const payload = {
            label: "Categories",
            link: clickedCategory.name,
        };

        adobeLaunch.pushEventToDataLayer({
            event: "ANALYTICS_CATEGORY_FACET",
            payload,
        });
    };

    private handleCategoryClick = (categoryId: string) => {
        scroller.scrollTo("root", {});
        if (this.filterBar) {
            this.filterBar.handleToggle();
        }
        this.setState({categoryFacetClicked: true});
        this.trackCategoryFacetClick(categoryId);
        this.props.actions.searchByCategory(categoryId);
    };

    private onProductItemClick = (sku: string, seoText: string) => {
        this.props.productLoadActions.loadProduct(sku, seoText);
    };

    private handleOnToggle = (facetSystemName: string, filterName: string, payload: FacetFilterRemovePayload) => {
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

    private buildFilterFacets = () => {
        let content = null;
        if (this.props.category && this.props.searchResult) {
            const categories = (
                <Categories
                    loading={this.props.searching}
                    selectedCategoryId={this.props.category.id}
                    subCategories={this.props.category.subCategories}
                    onCategoryClick={this.handleCategoryClick}
                />
            );
            const facets = (
                <Facets
                    facets={this.props.searchResult.facets}
                    facetsToExclude={[facetSystemNames.soldAndShippedBy, facetSystemNames.categories]}
                    loading={this.props.searching}
                />
            );
            content = (
                <div className={styles.facetContainer}>
                    {categories}
                    {facets}
                </div>
            );
        }

        return content;
    };

    private getSelectedFilterCount = (): number => {
        return this.isFacetSelected(facetSystemNames.soldAndShippedBy)
            ? this.props.searchResult.totalSelectedFilterCount - 1
            : this.props.searchResult.totalSelectedFilterCount;
    };

    private isFacetSelected = (facetSystemName: string): boolean => {
        return !!this.props.searchResult.facets.find(
            (filter) => filter.systemName === facetSystemName && filter.selectedFilterCount > 0,
        );
    };

    private fireCriteoViewProductBeacon = (sku: string) => {
        const criteoProduct = this.props.searchResult.products.find(
            (product) => product.sku === sku && product.isSponsored,
        );
        if (criteoProduct) {
            const criteoViewBeaconUrl = criteoProduct.criteoData.OnViewBeacon;
            sendCriteoImagePixel(criteoViewBeaconUrl);
        }
    };

    private getNoPriceSearchResultMsgBox = () => {
        let noPriceSearchResultMsgBox = null;
        if (
            this.props.features.minMaxPriceFacetEnabled &&
            (this.props.minPrice || this.props.maxPrice) &&
            this.props.appliedRangeQuery &&
            !this.props.rangeQueryHasResults
        ) {
            const localizedMessage = this.props.intl.formatMessage(messages.noResultsMinMaxPriceFacet);
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
            (facet.filters || []).forEach((filter) => {
                if (!facetSystemNames.soldAndShippedBy.includes(facet.systemName)) {
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
        });

        return pills;
    };
}

const mapStateToProps = (state: State, ownProps: PLPPageProps): StateProps & PLPPageProps => ({
    geekSquadSubscriptionSKU: state.config.checkout.geekSquadSubscriptionSKU,
    isPlpAvailabilityEnabled: state.config.remoteConfig.isPlpAvailabilityEnabled,
    language: state.intl.language,
    regionName: state.user.shippingLocation.regionName,
    routing: state.routing,
    globalContent: state.app.globalContent.content,
    screenSize: getScreenSize(state),
    user: state.user,
    locale: state.intl.locale,
    appEnv: state.app.environment.appEnv,
    minPrice: state.search.minPrice,
    maxPrice: state.search.maxPrice,
    appliedRangeQuery: state.search.appliedRangeQuery,
    rangeQueryHasResults: state.search.rangeQueryHasResults,
    features: state.config.features,
    testPencilAdIds: state.config.testPencilAdIds,
    ...state.search,
    ...ownProps,
});

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(searchActionCreators, dispatch),
        adActions: bindActionCreators(adActionCreators, dispatch),
        productLoadActions: bindActionCreators(productLoadActionCreators, dispatch),
        routingActions: bindActionCreators(routingActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps, PLPPageProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(Category));
