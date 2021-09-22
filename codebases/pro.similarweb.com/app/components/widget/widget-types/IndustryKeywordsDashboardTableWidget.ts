import * as _ from "lodash";
import {
    booleanSearchApiParamsToChipsObject,
    booleanSearchToString,
} from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import DurationService from "services/DurationService";
import { TableWidget } from "./TableWidget";
import { IndustryKeywordsDashboardTableWidgetFilters } from "components/widget/widget-filters/IndustryKeywordsDashboardTableWidgetFilters";
import { getChannelValue } from "pages/industry-analysis/top-keywords/topKeywordsUtils";

export class IndustryKeywordsDashboardTableWidget extends TableWidget {
    static getWidgetDashboardType() {
        return "Table";
    }

    static getWidgetMetadataType() {
        return "IndustryKeywordsDashboardTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getFiltersComponent() {
        return IndustryKeywordsDashboardTableWidgetFilters;
    }

    constructor() {
        super();
    }
    protected getSearchKey() {
        return "SearchTerm";
    }

    getProperties() {
        const props = super.getProperties();
        return props;
    }

    parseFilters(filter) {
        return filter.split(/\s*,\s*/).reduce((parsedFilters, currentFilter) => {
            const parsed = /(\w+);(?:==|contains);(.+)/.exec(currentFilter);
            if (parsed) {
                let [, key, value] = parsed;
                let name;
                switch (key) {
                    case "Source":
                        name = "channel";
                        value = getChannelValue(
                            value,
                            this._widgetConfig.properties.filters.channelText,
                        );
                        break;
                    case "OP":
                        name = "tab";
                        switch (value) {
                            case "0":
                                value = "organic";
                                break;
                            case "1":
                                value = "paid";
                                break;
                            default:
                                value = "all";
                                break;
                        }
                        break;
                    case "SearchTerm":
                        name = "search";
                        value = value.replace(/'|"/g, "");
                        break;
                }
                return {
                    ...parsedFilters,
                    [name]: value,
                };
            }
            return parsedFilters;
        }, {});
    }

    getProUrl() {
        const {
            filter = "",
            includeBranded = "true",
            orderBy,
            IncludeTerms,
            ExcludeTerms,
        } = this.apiParams;
        const parsedFilters = this.parseFilters(filter);
        const BooleanSearchTerms = booleanSearchToString(
            booleanSearchApiParamsToChipsObject({ ExcludeTerms, IncludeTerms }),
        );
        const topKeywordsUrlParams = {
            tab: "all",
            ...this._getProUrlParams(),
            excludeBranded: /false|true/.test(includeBranded) ? !JSON.parse(includeBranded) : false,
            ...parsedFilters,
            orderBy,
            BooleanSearchTerms,
        };
        return this._swNavigator.getStateUrl(
            this.getWidgetModel().metric === "SearchTrends"
                ? "marketresearch_webmarketanalysis_searchtrends"
                : "findkeywords_byindustry_TopKeywords",
            topKeywordsUrlParams,
        );
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    protected rowReducer(row) {
        const requestParams = this._params;
        const stateParams = {
            isWWW: "*", //for now - until fix for subdomains-domains
            duration: DurationService.getDiffSymbol(
                requestParams.from,
                requestParams.to,
                requestParams.isWindow ? "days" : "months",
            ),
            country: requestParams.country,
        };
        const rowParams = _.clone(stateParams);

        if (requestParams.metric.toLowerCase().indexOf("paid") > -1) {
            row.Paid = 1;
        }
        _.extend(rowParams, { keyword: row.SearchTerm });
        if (this.getWidgetModel().metric === "SearchTrends") {
            row.url = this._swNavigator.href(
                "marketresearch_keywordmarketanalysis_total",
                rowParams,
            );
        } else {
            if (row.OrganicPaid || row.Paid == 1) {
                row.url = this._swNavigator.href("keywordAnalysis-paid", rowParams);
            } else {
                row.url = this._swNavigator.href("keywordAnalysis-organic", rowParams);
            }
        }
        return { ...row };
    }
}

IndustryKeywordsDashboardTableWidget.register();
