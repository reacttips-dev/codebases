import {
    SponsoredProductsProvider,
    SponsoredProductsApiProps,
    SponsoredProductsFilter,
    SponsoredProductsFilterName,
} from "./";
import {SponsoredProductList} from "models";
import fetch from "utils/fetch";
import getLogger from "../../../common/logging/getLogger";
import {HttpRequestType} from "errors";

export class ApiSponsoredProductsProvider implements SponsoredProductsProvider {
    public async getSponsoredProducts(props: SponsoredProductsApiProps): Promise<SponsoredProductList | null> {
        const url = this.buildUrl(props);
        try {
            const response = await fetch(url, HttpRequestType.SponsoredProductApi);
            const json = await response.json();
            return json as SponsoredProductList;
        } catch (error) {
            getLogger().error(new Error("Error getting sponsored products. Error is: " + error));
            return null;
        }
    }

    private buildUrl(props: SponsoredProductsApiProps): string {
        const {
            url,
            accountId,
            pageId,
            retailerVisitorId,
            customerId,
            environment,
            keywords,
            pageNumber,
            category,
            filters = [],
            item,
        } = props;
        const queryCharToAppend = url.indexOf("?") === -1 ? "?" : "&";
        const environmentFilter: SponsoredProductsFilter = {
            filterName: SponsoredProductsFilterName.lowerenvironment,
            operator: "eq",
            value: [`${environment !== "production"}`],
        };
        const filtersWithEnvironment = [...filters, environmentFilter];
        const queryMap = {
            account: accountId,
            "page-id": pageId,
            "retailer-visitor-id": retailerVisitorId,
            "customer-id": customerId || "",
            filters: this.buildFilters(filtersWithEnvironment),
            "page-number": pageNumber,
            keywords,
            category,
            item,
            nolog: environment !== "production" ? "1" : "0",
        };

        const queryParameters = (Object.keys(queryMap) as Array<keyof typeof queryMap>).reduce((acc, key) => {
            if (queryMap[key] || key === "customer-id") {
                return [...acc, `${key}=${queryMap[key]}`];
            } else {
                return [...acc];
            }
        }, [] as string[]);
        return `${url}${queryCharToAppend}${queryParameters.join("&")}`;
    }

    private buildFilters(filters: SponsoredProductsFilter[]): string {
        return filters
            .map(({filterName, operator, value}) => {
                const filterValues = value.join(",");
                return `(${filterName},${operator},${filterValues})`;
            })
            .join(",");
    }
}

export default ApiSponsoredProductsProvider;
