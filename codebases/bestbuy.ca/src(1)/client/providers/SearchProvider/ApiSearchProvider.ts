import * as Moment from "moment";
import * as url from "url";
import getLogger from "../../../common/logging/getLogger";
import {HttpRequestError, HttpRequestType, StatusCode} from "../../errors";
import {facetSystemNames} from "../../constants";
import {
    Facet,
    FacetFilter,
    Region,
    SearchResult,
    SimpleProduct as Product,
    SimpleProductProps,
    ProductSort,
    Ssc,
    SearchPath,
} from "../../models";
import fetch from "../../utils/fetch";
import {SearchProvider, SearchProviderProps} from "./";
import en from "./translations/en";
import fr from "./translations/fr";
export class ApiSearchProvider implements SearchProvider {
    private messages = en;

    constructor(private baseUrl: string, private locale: Locale, private regionCode: Region) {
        if (this.locale.startsWith("fr")) {
            this.messages = fr;
        }
    }

    public async search(props: SearchProviderProps): Promise<SearchResult> {
        const emptyQuery =
            (props.query === "*" || !props.query) &&
            !props.path &&
            !props.categoryId &&
            !props.sscId &&
            !props.brandName;
        if (emptyQuery) {
            return {
                facets: [],
                paths: [],
                products: [],
                total: 0,
                totalPages: 0,
            };
        }

        const products: Product[] = [];

        const searchUrl = props.sscId ? url.parse(url.resolve(this.baseUrl, props.sscId)) : url.parse(this.baseUrl);
        searchUrl.query = {
            categoryid: props.categoryId,
            currentRegion: this.regionCode,
            include: "facets, redirects",
            lang: this.locale,
            page: props.page,
            pageSize: props.pageSize,
            path: decodeURIComponent(props.path.replace(/\+/g, "%20")),
            query: props.query,
            exp: props.exp,
            ...this.getSortQuery(props.sort),
        };

        const formattedUrl = url.format(searchUrl);
        const response = await fetch(formattedUrl, HttpRequestType.SearchApi);
        const json = await response.json();
        for (const jsonProduct of json.products) {
            const productProps: SimpleProductProps = {
                customerRating: jsonProduct.customerRating,
                customerRatingCount: jsonProduct.customerRatingCount,
                ehf: jsonProduct.ehf,
                hideSaving: jsonProduct.hideSavings,
                isMarketplace: jsonProduct.isMarketplace,
                name: jsonProduct.name,
                productUrl: jsonProduct.productUrl,
                regularPrice: jsonProduct.regularPrice,
                saleEndDate: jsonProduct.saleEndDate,
                salePrice: jsonProduct.salePrice,
                sku: jsonProduct.sku,
                thumbnailImage: jsonProduct.thumbnailImage,
                categoryIds: jsonProduct.categoryIds,
            };

            products.push(new Product(productProps));
        }

        const unselectedFacets: Facet[] = [...(json.facets || [])];
        const selectedFacets: Facet[] = (json.selectedFacets || ([] as Facet[])).map((facet) => ({
            ...facet,
            selectedFilterCount: facet.filters.filter((filter) => filter.isSelected).length,
        }));

        let facets: Facet[] = [...unselectedFacets, ...selectedFacets];
        // sort facets by ascending order
        facets = facets.filter((facet) => facet.filters && facet.filters.length);
        facets.sort((facet1, facet2) => facet1.order - facet2.order);

        facets = this.insertAvailabilityFacet(facets, json);

        const categoryFacets = facets.find((facet) => facet.systemName === "category");

        if (!props.categoryId) {
            facets = [
                this.buildCategoryFacet(categoryFacets),
                ...facets.filter((facet) => facet.systemName !== "category"),
            ];
        }

        if (props.sscId) {
            this.appendParentCategories(facets, json);
        }

        const totalSelectedFilterCount = facets
            .map((f) => f.selectedFilterCount || 0)
            .reduce((total, num) => total + num, 0);

        const searchResult: SearchResult = {
            facets,
            paths: json.paths,
            products,
            redirectUrl: json.redirectUrl,
            ssc: this.getSsc(json),
            total: json.total,
            totalPages: json.totalPages,
            totalSelectedFilterCount,
            pageSize: json.pageSize,
            selectedFacets,
        };

        let errorMessage = null;
        if (props.sscId && !this.isValidCollection(searchResult)) {
            errorMessage = "Collection not found";
        }

        if (errorMessage) {
            const httpRequestError = new HttpRequestError(
                HttpRequestType.SearchApi,
                formattedUrl,
                errorMessage,
                null,
                StatusCode.NotFound,
                response.headers,
                null,
            );
            getLogger().error(httpRequestError);
            return Promise.reject(httpRequestError);
        }

        return searchResult;
    }

    private isValidCollection(searchResult: SearchResult) {
        if (searchResult.total === 0) {
            return false;
        }
        // would expect ssc not to be null/undefined but, not the case for page 2+ of collection response
        // need to discuss with search team on why api doesn't return ssc on page 2+
        if (searchResult.ssc && searchResult.ssc.endDate) {
            const unixTimeSeconds = Moment.utc(searchResult.ssc.endDate).unix();
            if (unixTimeSeconds > 0 && Moment.now() > unixTimeSeconds * 1000) {
                return false; // expired
            }
        }
        return true;
    }

    private getSsc(json: any): Ssc {
        let ssc: Ssc = null;
        if (json.sscs && json.sscs.length) {
            const collection = json.sscs[0];
            ssc = {
                altLangSeoUrlText: collection.AltLangSeoUrlText,
                endDate: collection.SscEndDate,
                id: collection.SscId,
                name: collection.SscName,
                seoUrlText: collection.SeoUrlText,
                title: collection.SscTitle,
            };
        }

        return ssc;
    }

    private getSortQuery(sort: ProductSort) {
        switch (sort) {
            case ProductSort.highestRated:
                return {sortBy: "rating", sortDir: "desc"};
            case ProductSort.priceHighToLow:
                return {sortBy: "price", sortDir: "desc"};
            case ProductSort.priceLowToHigh:
                return {sortBy: "price", sortDir: "asc"};
            default:
                return {sortBy: "relevance", sortDir: "desc"};
        }
    }

    private buildCategoryFacet(facet: Facet): Facet {
        if (!facet) {
            facet = {
                filters: [],
                isMultiSelect: false,
                name: this.messages.categoryFacetName,
                order: 0,
                selectedFilterCount: 0,
                systemName: "category",
            };
        }
        return facet;
    }

    private appendParentCategories(facets: Facet[], json) {
        if (!json.breadcrumb || !json.breadcrumb.length || !facets.length) {
            return;
        }
        const parentsCategories: Array<{CategoryName: string; CategoryId: string}> = json.breadcrumb.filter(
            ({CategoryId}) => CategoryId !== "",
        );
        const parentsCategoryNames: string[] = parentsCategories.map(({CategoryName}) =>
            encodeURIComponent(CategoryName).replace(/%20/g, "+"),
        );
        const facetCategory: Facet = facets.find(({systemName}) => systemName === facetSystemNames.categories);
        if (facetCategory) {
            facetCategory.filters = facetCategory.filters.map((facetFilter) => {
                const facetSeperator = encodeURIComponent(";").toLowerCase();
                const categoryPrefix = encodeURIComponent("category:").toLowerCase();
                let facetPath: string[] = facetFilter.path.split(facetSeperator);
                facetPath = facetPath.filter(
                    (category) =>
                        !parentsCategoryNames.some(
                            (name) =>
                                name.toLowerCase().indexOf(category.toLowerCase().replace(categoryPrefix, "")) > -1,
                        ),
                );
                let cleanPath: string = facetPath.join(facetSeperator);
                cleanPath = parentsCategoryNames.length ? facetSeperator + cleanPath : cleanPath;
                // combine parent categories and the clean category facet path
                facetFilter.path = parentsCategoryNames.join(facetSeperator + categoryPrefix) + cleanPath;
                facetFilter.path = parentsCategoryNames.length ? categoryPrefix + facetFilter.path : facetFilter.path;
                return facetFilter;
            });
        }
    }

    private insertAvailabilityFacet(facets: Facet[], json: SearchResult) {
        const indexStatus = facets.findIndex((facet) => facet.systemName === facetSystemNames.status);
        if (indexStatus >= 0) {
            const paths: SearchPath[] = json?.paths || [];
            const availableStock: FacetFilter = {
                isSelected: false,
                name: this.messages.availableStockFilter,
                // First entry could be the search term. The last entry is the most recent facet selected.
                path: paths.length > 0 ? paths[paths.length - 1].selectPath : "",
            };
            const availability: Facet = {
                name: this.messages.availabilityFacetName,
                systemName: facetSystemNames.availability,
                filters: [availableStock],
                order: 100,
                isMultiSelect: true,
            };
            return indexStatus === 0
                ? [availability, ...facets.slice(indexStatus)]
                : [...facets.slice(0, indexStatus), availability, ...facets.slice(indexStatus)];
        } else {
            return facets;
        }
    }
}

export default ApiSearchProvider;
