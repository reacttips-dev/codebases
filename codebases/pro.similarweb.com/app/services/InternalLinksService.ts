/**
 * Created by olegg on 04-Apr-17.
 */
import angular from "angular";

type ParamsType = {
    country: string;
    category: string;
    duration: string;
    state: string;
};

export class InternalLinksService {
    static $inject = ["swNavigator"];

    constructor(private swNavigator) {}

    getTopSitesLink = function (params?: ParamsType) {
        const {
            country = "999",
            category = "All",
            duration = "1m",
            state = "industryAnalysis-topSites",
        } = params || {};

        return this.swNavigator.href(state, { country, duration, category });
    };
}

angular.module("sw.common").service("internalLinksService", InternalLinksService);
