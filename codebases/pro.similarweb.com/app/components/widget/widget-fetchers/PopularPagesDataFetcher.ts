import * as _ from "lodash";
import angular from "angular";
import { IWidget } from "../widget-types/Widget";
import { IDataFetcherFactory } from "./IDataFetcher";
import { ReduxStateAwareDataFetcher } from "./ReduxStateAwareDataFetcher";
import {
    defaultPopularPagesRadioFilter,
    radioItems,
} from "../../React/PopularPagesFilters/popularPagesFilters.config";

export const popularPagesFiltersState = "popularPages.popularPagesFiltersState";
export class PopularPagesDataFetcher<T> extends ReduxStateAwareDataFetcher<T> {
    constructor(widgetResource, widget, statePath) {
        super(widgetResource, widget, statePath);
    }

    fetch(params = this.widget.apiParams) {
        const { checkboxIsSelected, selectedFilter } = this.$swNgRedux.getStatePath(this.statePath);
        const paramsToClear: any = _.map(radioItems, "value");
        const apiRadioFilter =
            _.filter(Object.keys(params), (param) => {
                return paramsToClear.indexOf(param) !== -1;
            })[0] || defaultPopularPagesRadioFilter;

        paramsToClear.push("isUtm");

        this.widget.clearApiParams(paramsToClear);
        params = this.widget.apiParams;

        if (apiRadioFilter !== selectedFilter) {
            // the filter changed
            if (selectedFilter === "isTrending") {
                params = {
                    ...params,
                    orderBy: "ChangeInShare desc",
                };
            } else {
                params = {
                    ...params,
                    orderBy: "Share desc", // back to default
                };
            }
        }

        params = {
            ...params,
            [selectedFilter]: true,
        };
        if (checkboxIsSelected) {
            params = {
                ...params,
                isUtm: true,
            };
        }

        this.widget.updateApiParams(params);
        return super.fetch(params);
    }
}

angular.module("sw.common").factory("PopularPagesDataFetcherFactory", function (widgetResource) {
    let factory: IDataFetcherFactory<any> = {
        create: function (widget: IWidget<any>, statePath) {
            return new PopularPagesDataFetcher<any>(widgetResource, widget, statePath);
        },
    };
    return factory;
});
