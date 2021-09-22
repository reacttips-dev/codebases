import DurationService from "services/DurationService";
import { TableWidget } from "./TableWidget";
import KeywordsTableDashboardDataFetcher from "pages/website-analysis/traffic-sources/search/KeywordsTableDashboardDataFetcher";
import { TableSearchKeywordsDashboardWidgetFilters } from "components/widget/widget-types/TableSearchKeywordsDashboardWidgetFilters";
import { DOMAINS } from "constants/domains";
import { DefaultCellHeaderRightAlign } from "../../React/Table/headerCells/DefaultCellHeaderRightAlign";
import { DefaultCellRightAlign } from "../../React/Table/cells/DefaultCellRightAlign";
import CountryService from "services/CountryService";
import { TrafficShareWithVisits } from "components/React/Table/cells";

export class TableSearchKeywordsDashboardWidget extends TableWidget {
    static $inject = ["$filter", "swNavigator"];
    protected _$filter;
    public _swNavigator;

    constructor() {
        super();
    }

    protected getSearchKey() {
        return "SearchTerm";
    }

    runWidget() {
        if (this._autoFetchData) {
            this.getData();
        }
        this.setMetadata();
        this.getLegendImage();
    }

    static getWidgetMetadataType() {
        return "TableSearchKeywordsDashboard";
    }

    static getWidgetDashboardType() {
        return "Table";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    static getFiltersComponent() {
        return TableSearchKeywordsDashboardWidgetFilters;
    }

    get templateUrl() {
        return this.isCompare()
            ? `/app/components/widget/widget-templates/search-table-with-header-compare.html`
            : `/app/components/widget/widget-templates/search-table-with-header-single.html`;
    }

    private getSearchMode() {
        let searchMode = "Organic";
        const { IncludeOrganic, IncludePaid } = this.apiParams;
        if (IncludePaid && !IncludeOrganic) {
            searchMode = "Paid";
        }
        return searchMode;
    }

    getCompareBarsItems() {
        return [
            {
                bars: (this.getWidgetModel().key as any).map((website, i) => {
                    return {
                        color: this.tableColors._available[i],
                        valueText:
                            this.subtitleData &&
                            this.subtitleData.breakdown.search_visits[website.name] &&
                            `${(
                                this.subtitleData.breakdown.search_visits[website.name].percentage *
                                100
                            ).toFixed(2)}%`,
                        width:
                            this.subtitleData &&
                            this.subtitleData.breakdown.search_visits[website.name] &&
                            this.subtitleData.breakdown.search_visits[website.name].percentage *
                                100,
                        name: website.name,
                    };
                }),
                metric: "analysis.source.search.keywords.header.metrics.searchVisits",
            },
        ];
    }

    getSingleHeader = () => this.subtitleData;

    getSingleHeaderItem = (attr) => this.subtitleData && this.subtitleData.total[attr];

    getAbbrNumberVisitsFilter = () => this._$filter("abbrNumberVisits");

    getMinVisitsAbbrFilter = () => this._$filter("minVisitsAbbr");

    getPercentagesignFilter = () => this._$filter("percentagesign");

    getI18nFilter = () => this._$filter("i18n");

    getColumnsConfig() {
        const compare = this.isCompare();
        const i18n = (p) => this._$filter("i18n")(p);
        const { country, IncludeOrganic, IncludePaid, webSource } = this.apiParams;
        const isUsState = CountryService.isUSState(country);
        const COLUMNS_I18N_KEY = isUsState
            ? "analysis.source.search.all.table.columns.us"
            : "analysis.source.search.all.table.columns";
        const OrganicPaidFilter = this.getSearchMode();
        const includeOrganicPaidColumn =
            webSource === "Desktop" &&
            ((IncludeOrganic && IncludePaid) || (!IncludeOrganic && !IncludePaid));

        const columns = [
            {
                name: "SearchTerm",
                title: "Search Term",
                cellTemp: "cell-keyword-dashboard",
                width: "150px",
            },
            {
                name: "TotalShare",
                title: i18n("analysis.source.search.all.table.columns.share.title"),
                cellComponent: TrafficShareWithVisits,
                width: "120px",
                format: "percentagesign",
                ppt: {
                    overrideFormat: "smallNumbersPercentage:2",
                },
            },
            compare
                ? {
                      name: "SiteOrigins",
                      title: i18n("analysis.source.search.all.table.columns.shareCompare.title"),
                      cellTemp: "group-traffic-share-dashboard",
                      width: "185px",
                      ppt: {
                          // Indicates that we want to split this column into sub-columns
                          // where each sub-column will be a table entity (table item - a website/app/category.
                          // such as ynet.co.il, whatsapp, all industries etc.)
                          splitColumnToEntities: true,

                          // override the table column format when rendered in ppt
                          overrideFormat: "smallNumbersPercentage:1",

                          // Override default value when no value is present in a table roe
                          defaultValue: "0%",
                      },
                  }
                : {
                      name: "Change",
                      title: i18n("analysis.source.search.all.table.columns.change.title"),
                      cellTemp: "change-percentage",
                      headerComponent: DefaultCellHeaderRightAlign,
                      format: "percentagesign",
                      width: "100px",
                      ppt: {
                          overrideFormat: "smallNumbersPercentage:2",
                      },
                  },
            {
                name: "KwVolume",
                title: `${COLUMNS_I18N_KEY}.volume.title`,
                format: "swPosition",
                headerComponent: DefaultCellHeaderRightAlign,
                cellComponent: DefaultCellRightAlign,
                width: "100px",
            },
            {
                name: "CPC",
                title: `${COLUMNS_I18N_KEY}.cpc.title`,
                cellComponent: DefaultCellRightAlign,
                headerComponent: DefaultCellHeaderRightAlign,
                format: "CPC",
                width: "60px",
            },
            {
                name: `Position${OrganicPaidFilter}`,
                title: `${i18n(
                    `${COLUMNS_I18N_KEY}.position${OrganicPaidFilter.toLowerCase()}.title`,
                )} (${OrganicPaidFilter})`,
                cellTemp: compare ? "wa-keyword-position-compare" : "wa-keyword-position",
                headerComponent: DefaultCellHeaderRightAlign,
                format: "avgKeywordPosition",
                width: "130px",
                ppt: {
                    // hide this column since it's impossible to format its data
                    hideColumn: true,
                },
            },
            {
                name: `DestUrl${OrganicPaidFilter}`,
                trackingName: `URL ${OrganicPaidFilter}`,
                title: `${i18n(
                    `${COLUMNS_I18N_KEY}.destination${OrganicPaidFilter.toLowerCase()}.title`,
                )} (${OrganicPaidFilter})`,
                cellTemp: compare ? "wa-search-keyword-url-compare" : "wa-search-keyword-url",
                minWidth: 200,
                ppt: {
                    // hide this column since it's impossible to format its data
                    hideColumn: true,
                },
            },
        ];

        if (includeOrganicPaidColumn) {
            const columnDetails: any = {
                name: "Organic",
                title: "analysis.source.search.all.table.columns.vs.title",
                cellTemp: "organic-paid",
                width: "190px",
                ppt: {
                    // Indicates that we want to replace this column with two other columns
                    // (show the specified columns instead of the current column)
                    // this is done mainly in cases of Vs. columns, where we want to split
                    // the column into two ppt columns (such as: "Organic Vs Paid" >>> "Organic", "Paid")
                    replaceWithColumns: ["Organic", "Paid"],

                    // override the table column format when rendered in ppt
                    overrideFormat: "smallNumbersPercentage:2",
                },
            };
            columns.splice(3, 0, columnDetails);
        }

        return columns;
    }

    public getProUrl(rowParams) {
        //creating url for title of the widget
        let proUrl = "";
        if (this.apiParams.webSource === "MobileWeb") {
            delete this.apiParams.filter;
        }
        let limitsString = this.apiParams.limits;
        let familyValue;
        let sourceValue;
        let cpcFromValue;
        let cpcToValue;
        let volumeFromValue;
        let volumeToValue;
        let IncludeTermsArray;
        const {
            country,
            webSource,
            isWindow,
            from,
            to,
            keys,
            includeSubDomains,
            IncludeBranded,
            IncludeNewKeywords,
            IncludeNoneBranded,
            IncludeOrganic,
            IncludePaid,
            IncludeQuestions,
            IncludeTrendingKeywords,
            limits,
            ExcludeTerms,
            IncludeTerms,
            filter,
            rangefilter,
            serp,
            selectedPhrase,
        } = this.apiParams;
        IncludeTermsArray = IncludeTerms;
        if (limits) {
            const limitsSize = limits.split(";").length;
            const keysSize = keys.split(",").length;
            if (limitsSize < keys.length) {
                for (let k = 0; k < keysSize - limitsSize; k++) {
                    limitsString += ";0-1";
                }
            }
        }
        if (filter) {
            const filters = filter.split(",");
            const names = filters.map((filter) => filter.split(";")[0]);
            const familyIndex = names.indexOf("family");
            const sourceIndex = names.indexOf("source");
            const familyFilter = filters[familyIndex]?.split(";");
            const sourceFilter = filters[sourceIndex]?.split(";");
            familyIndex !== -1 ? (familyValue = familyFilter[2]) : null;
            sourceIndex !== -1 ? (sourceValue = sourceFilter[2]) : null;
        }
        if (rangefilter) {
            const filters = rangefilter.split("|");
            const names = filters.map((filter) => filter.split(",")[0]);
            const cpcIndex = names.indexOf("cpc");
            const volumeIndex = names.indexOf("kwvolume");
            const cpcFilter = filters[cpcIndex]?.split(",");
            const volumeFilter = filters[volumeIndex]?.split(",");
            cpcFromValue = cpcFilter && cpcFilter[1];
            cpcToValue = cpcFilter && cpcFilter[2];
            volumeFromValue = volumeFilter && volumeFilter[1];
            volumeToValue = volumeFilter && volumeFilter[2];
        }
        if (selectedPhrase && IncludeTerms) {
            IncludeTermsArray = IncludeTerms.split(",");
            const indexOfPhrase = IncludeTermsArray.indexOf(selectedPhrase);
            IncludeTermsArray = [
                ...IncludeTermsArray.slice(0, indexOfPhrase),
                ...IncludeTermsArray.slice(indexOfPhrase + 1),
            ].join(",");
        }
        const duration = DurationService.getDiffSymbol(from, to, isWindow ? "days" : "months");
        let isWWW = /true/.test(includeSubDomains)
            ? DOMAINS.find((item) => item.id === "includeSubdomains").urlSymbol
            : DOMAINS.find((item) => item.id === "mainDomainOnly").urlSymbol;
        if (webSource === "MobileWeb")
            isWWW = DOMAINS.find((item) => item.id === "includeSubdomains").urlSymbol;
        const organicOrPaid = this.getSearchMode().toLowerCase();

        if (rowParams) {
            proUrl = this._swNavigator.getStateUrl(`keywordAnalysis.${organicOrPaid}`, {
                isWWW,
                country,
                duration,
                keyword: rowParams.keyword,
            });
        } else {
            proUrl = this._swNavigator.getStateUrl("competitiveanalysis_website_search_keyword", {
                country,
                duration,
                webSource,
                key: keys,
                isWWW,
                IncludeBranded,
                IncludeNewKeywords,
                IncludeNoneBranded,
                IncludeOrganic,
                IncludePaid,
                IncludeQuestions,
                IncludeTrendingKeywords,
                limits: limitsString,
                ExcludeTerms,
                IncludeTerms: IncludeTermsArray,
                // rangefilter,
                family: familyValue,
                source: sourceValue,
                cpcFromValue,
                cpcToValue,
                volumeFromValue,
                volumeToValue,
                serp,
                selectedPhrase,
            });
        }
        return proUrl;
    }

    public getFetcherFactory() {
        return new KeywordsTableDashboardDataFetcher();
    }
}

TableSearchKeywordsDashboardWidget.register();
