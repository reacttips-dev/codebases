import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as qs from "query-string";
import * as React from "react";
import { PureComponent } from "react";
import * as _ from "lodash";
import { DefaultFetchService } from "../../../services/fetchService";
import IndustryAnalysisOutgoingLinks from "./IndustryAnalysisOutgoingLinks";
import { categoryLinkFilter } from "filters/ngFilters";
import categoryService from "common/services/categoryService";

const METRIC = "OutgoingReferrals";
const PAGE_SIZE = 100;
const TIME_GRANULARITY = "Monthly";

@SWReactRootComponent
export class IndustryAnalysisOutgoingLinksContainer extends PureComponent<any, any> {
    public swSettings: any;
    public fetchService: any;
    public pageFilters: any;
    public swNavigator: any;
    public data: any;
    public excelLink: string;

    constructor(props, context) {
        super(props, context);
        this.swSettings = swSettings;
        this.fetchService = DefaultFetchService.getInstance();
        this.swNavigator = Injector.get<any>("swNavigator");
        this.pageFilters = this.swNavigator.getApiParams();
        this.excelLink = this.buildExcelLink();
        this.state = {
            loading: true,
        };
    }

    public componentDidMount() {
        if (!this.swSettings.current.isAllowed) {
            return;
        }

        this.fetchOutgoingLinks();
    }

    private buildExcelLink = (filters?) => {
        const qstring = qs.stringify(this.buildParams(filters));
        return `/widgetApi/IndustryAnalysis/OutgoingReferrals/Excel?${qstring}`;
    };

    public render() {
        if (!this.swSettings.current.isAllowed) {
            return null;
        }

        const { orderby } = this.pageFilters;
        const orderBySplitted = orderby && orderby.split(" ");
        const sortedColumn = orderBySplitted && {
            field: orderBySplitted[0],
            sortDirection: orderBySplitted[1],
        };

        return (
            <IndustryAnalysisOutgoingLinks
                loading={this.state.loading}
                data={this.data}
                metric={METRIC}
                excelLink={this.excelLink}
                sortedColumn={sortedColumn}
                onFilter={this.fetchOutgoingLinks}
                getLink={this.swNavigator.href.bind(this.swNavigator)}
            />
        );
    }

    private buildParams = (filters?) => {
        const {
            country,
            from,
            category,
            orderby,
            webSource,
            to,
            outgoing_filters,
            page,
            isWindow,
        } = this.swNavigator.getApiParams();
        const filter =
            filters && filters["filter"]
                ? filters["filter"]
                : // we expect just 1 filter, so we can make this assumption
                  outgoing_filters &&
                  outgoing_filters
                      .split(";")
                      .map((key, index, arr) => {
                          return index === arr.length - 1 ? `"${key}"` : key;
                      })
                      .join(";");
        const orderBy = _.get(filters, "orderby", orderby);

        const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);

        return _.pickBy(
            {
                country,
                from,
                includeSubDomains: true,
                keys: categoryObject?.forApi,
                category: categoryObject?.forDisplayApi,
                timeGranularity: TIME_GRANULARITY,
                pageSize: PAGE_SIZE,
                isWindow,
                page,
                webSource,
                to,
                filter,
                orderby: orderBy,
            },
            (v) => !_.isUndefined(v),
        );
    };

    public fetchOutgoingLinks = async (filters?) => {
        this.setState({ loading: true });

        const params = this.swNavigator.getParams();
        const url = `/widgetApi/IndustryAnalysis/${METRIC}/Table`;
        let response;
        try {
            response = await this.fetchService.get(url, this.buildParams(filters));
        } catch (e) {
            this.setState({ loading: false });
        }
        if (response) {
            this.excelLink = this.buildExcelLink(filters);
            this.data = {
                ...response,
                Data:
                    response.Data &&
                    response.Data.map((row) => {
                        const updatedRow = { ...row };

                        updatedRow.url = this.swNavigator.href(
                            "websites-worldwideOverview",
                            {
                                key: updatedRow.Domain,
                                duration: params.duration,
                                country: params.country,
                                isWWW: params.isWWW ?? "*",
                            },
                            {},
                        );
                        updatedRow.href = categoryLinkFilter(this.swNavigator)(
                            updatedRow.Category,
                            row.updatedRow,
                            true,
                        );
                        if (updatedRow.Children) {
                            updatedRow.Children = updatedRow.Children.map((child) => {
                                return {
                                    ...child,
                                    url: this.swNavigator.href(
                                        "websites-worldwideOverview",
                                        {
                                            key: child.Domain,
                                            duration: params.duration,
                                            country: params.country,
                                            isWWW: params.isWWW,
                                        },
                                        {},
                                    ),
                                };
                            });
                        }

                        return updatedRow;
                    }),
            };
            this.setState({ loading: false });
        }
    };
}
