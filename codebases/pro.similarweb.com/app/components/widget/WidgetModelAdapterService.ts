import angular from "angular";
import * as _ from "lodash";
import {
    IWidget,
    IWidgetWebsiteKey,
    IWidgetMobileKey,
    IWidgetModelTypesType,
    IWidgetModelTypesWebSource,
    IWidgetModel,
} from "./widget-types/Widget";
import { Injector } from "common/ioc/Injector";
import widgetSettings from "components/dashboard/WidgetSettings";
import { chosenItems } from "common/services/chosenItems";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";
/**
 * Until all the PRO will use widgets, this service will be here to help normalize IWidgetModel
 */

class WidgetModelAdapterService {
    static $inject = ["swNavigator", "chosenSites"];

    constructor(private _swNavigator, private _chosenSites) {}

    private _getPageFiltersByMetric = {
        OutgoingReferrals: () => {
            const pageFilters = this._swNavigator.getParams()["outagoing_filters"];
            if (pageFilters) {
                let widgetFilters = ``;
                pageFilters.split("+").forEach((filter, i) => {
                    if (i > 0) {
                        widgetFilters += `,`;
                    }
                    if (filter.split(";")[0] == "domain") {
                        widgetFilters += `domain;contains;"${filter.split(";")[2]}"`;
                    }
                    if (filter.split(";")[0] == "category") {
                        widgetFilters += `category;category;"${filter.split(";")[2]}"`;
                    }
                });
                return widgetFilters;
            }
            return {};
        },
    };

    /**
     * Creates key from 'chosenSites' service
     *
     * @returns Array<IWidgetWebsiteKey>
     */
    private _getKeysFromSiteInfo(): Array<IWidgetWebsiteKey> {
        return this._chosenSites.map(function (site, siteInfo) {
            return {
                name: siteInfo.isVirtual ? site.replace("*", "") : site, //when virtual name added one more * added
                isVirtual: siteInfo.isVirtual,
                /**
                 * P: save space in DB and reduce widget footprint
                 * S: remove image from the key and make widget in dashboard dynamically create image every time
                 * P: each widget creates ajax request in order to get an image(hash generated on back end)
                 * S: leave as it is now. Save image path in DB
                 * todo: Danny has solution commented on backend. Make new branch and integrate with him, then remove two lines below
                 */
                image: siteInfo.icon,
            };
        });
    }

    /*** Create key from 'selectedSite' query param.
     *
     * @returns Array<IWidgetWebsiteKey>
     */
    private _getKeyFromPrimarySite(): Array<any> {
        let _selectedSite = this._swNavigator.getParams().selectedSite;
        let _primarySite;
        if (_selectedSite) {
            _primarySite = this._chosenSites.getInfo(_selectedSite);
        } else {
            _primarySite = this._chosenSites.getPrimarySite();
        }
        return [
            {
                name: _primarySite.name,
                isVirtual: _primarySite.isVirtual,
                image: _primarySite.icon,
            },
        ];
    }

    /*** Create key from keyword
     *
     * @returns Array<IWidgetKeywordsKey>
     */
    private _getKeyFromKeyword(): Array<any> {
        let _keyword = this._swNavigator.getParams().keyword;
        let name = _keyword;
        if (_keyword.startsWith("*")) {
            _keyword = _keyword.substring(1);
            name = keywordsGroupsService.findGroupById(_keyword).Name;
        }
        return [
            {
                name: name,
                id: _keyword,
            },
        ];
    }

    /**
     * Creates key from 'choosenItems' service
     *
     * @returns Array<IWidgetMobileKey>
     */
    private _getKeysFromChosenItems(): Array<IWidgetMobileKey> {
        return chosenItems.$all().map(function (item) {
            return {
                name: item.Title,
                id: item.Id,
                store: item.AppStore.toLowerCase(),
                appkey: (item.AppStore === "Google" ? 0 : 1) + "_" + item.Id,
            };
        });
    }

    /**
     * Receives metric string and returns proper one from the SimilarWebPro.Website/app/components/widget/widget-config/metrics/*
     *
     * @param metric
     * @returns {string}
     */
    public normalizeMetric(metric): string {
        switch (metric) {
            case "AppEngagementCategoryRank":
                return "AppIndexes";
            default:
                return metric;
        }
    }

    /**
     * Creates IWidgetModel from the params, creates keys from the _getKeysFromChosenItems
     *
     * @param metric
     * @param type
     * @param webSource
     * @returns IWidgetModel
     */
    public fromMobile(
        metric: string,
        type: IWidgetModelTypesType,
        webSource: IWidgetModelTypesWebSource,
        filters?,
    ): IWidgetModel {
        return {
            country: this._swNavigator.getParams().country,
            duration: this._swNavigator.getParams().duration,
            family: widgetSettings.getMetricProperties(metric).family,
            type: type,
            webSource: webSource,
            metric: metric,
            key: this._getKeysFromChosenItems(),
            filters,
        };
    }

    /**
     * Checks if the current view shows main domain only or include sub-domains.
     * @returns {object}
     */
    public getIncludeSubDomains() {
        let includeSubDomains = this._swNavigator.getParams().isWWW === "*";
        return { includeSubDomains };
    }

    public getUrlFilters(metric) {
        if (this._getPageFiltersByMetric[metric]) {
            return { filter: this._getPageFiltersByMetric[metric]() };
        }
        return {};
    }

    /**
     * Creates IWidgetModel from the params, creates keys from the _getKeysFromSiteInfo
     *
     * @param metric
     * @param type
     * @param webSource
     * @returns IWidgetModel
     */
    public fromWebsite(
        metric: string,
        type: IWidgetModelTypesType,
        webSource: IWidgetModelTypesWebSource,
        selectedSite?: boolean,
        filters?,
    ): IWidgetModel {
        let _key = selectedSite ? this._getKeyFromPrimarySite() : this._getKeysFromSiteInfo();
        let _isCompare = _key.length > 1;
        let _filters = Object.assign(
            widgetSettings.getMetricWidgetFilters(metric, type, _isCompare, true),
            this.getIncludeSubDomains(),
            this.getUrlFilters(metric),
            filters,
        );
        return {
            country: this._swNavigator.getParams().country,
            duration: this._swNavigator.getParams().duration,
            comparedDuration: this._swNavigator.getParams().comparedDuration,
            family: widgetSettings.getMetricProperties(metric).family,
            type: type,
            webSource: webSource,
            metric: metric,
            key: _key,
            filters: _filters,
        };
    }

    /**
     * Creates IWidgetModel for keyword from the params
     *
     * @param metric
     * @param type
     * @param webSource
     * @returns IWidgetModel
     */
    public fromKeyword(
        metric: string,
        type: IWidgetModelTypesType,
        webSource: IWidgetModelTypesWebSource,
        filters?,
    ): IWidgetModel {
        let _key = this._getKeyFromKeyword();
        let _filters = Object.assign(
            widgetSettings.getMetricWidgetFilters(metric, type, false, true),
            this.getIncludeSubDomains(),
            this.getUrlFilters(metric),
            filters,
        );
        return {
            country: this._swNavigator.getParams().country,
            duration: this._swNavigator.getParams().duration,
            family: widgetSettings.getMetricProperties(metric).family,
            type: type,
            webSource: webSource,
            metric: metric,
            key: _key,
            filters: _filters,
        };
    }
}

angular.module("sw.common").service("widgetModelAdapterService", WidgetModelAdapterService);
