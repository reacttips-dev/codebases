import angular from "angular";
import CountryService from "../../../app/services/CountryService";
import { swSettings } from "common/services/swSettings";

angular.module("sw.common").factory("sitesResource", function ($resource, $filter, swNavigator) {
    return $resource(
        "",
        {},
        {
            getSiteInfo: {
                url: "/api/WebsiteOverview/getheader",
                method: "GET",
                params: {
                    keys: "",
                    mainDomainOnly: false,
                    includeCrossData: true,
                },
                timeout: 30000,
                isArray: false,
                cache: true,
                interceptor: {
                    response: function (response) {
                        var validateRedirect = function (value) {
                            return value && value.indexOf("m.") !== 0 && value;
                        };
                        var result = {};
                        angular.forEach(response.data, function (val, key) {
                            val.description = val.description.replace(/\uFFFD/g, "");
                            val.el_description = $filter("ellipsis")(val.description, 196);
                            val.category = $filter("prettifyCategory")(val.category);
                            val.highestTrafficCountry =
                                CountryService.countriesById[val.highestTrafficCountry];
                            val.displayName = val.IsVGroup ? key.substr(1) : key;
                            result[key] = val;
                        });
                        return result;
                    },
                },
            },

            GetSubDomainsTable: {
                url: "/api/websiteAnalysis/GetSubDomainsTable",
                method: "GET",
                params: {
                    page: 1,
                    pagesize: 100,
                    orderby: "Share desc",
                },
                timeout: 30000,
                isArray: false,
                cache: false,
                interceptor: {
                    response: function (response) {
                        var result = response.resource;
                        result.upgradeUrl = swSettings.swurls.UpgradeAccountURL;

                        angular.forEach(response.resource.Records, function (record) {
                            if (record.Domain) {
                                record.url = swNavigator.href(
                                    "websites-worldwideOverview",
                                    Object.assign({}, swNavigator.getParams(), {
                                        key: record.Domain,
                                    }),
                                );
                            }
                        });
                        return result;
                    },
                },
            },
            GetSubDomainsTableMobile: {
                url: "/api/websiteAnalysis/GetSubDomainsMobileTable",
                method: "GET",
                params: {
                    page: 1,
                    pagesize: 100,
                    orderby: "Share desc",
                },
                timeout: 30000,
                isArray: false,
                cache: false,
                interceptor: {
                    response: function (response) {
                        var result = response.resource;
                        result.upgradeUrl = swSettings.swurls.UpgradeAccountURL;

                        angular.forEach(response.resource.Records, function (record) {
                            if (record.Domain) {
                                record.url = swNavigator.href(
                                    "websites-worldwideOverview",
                                    Object.assign({}, swNavigator.getParams(), {
                                        key: record.Domain,
                                    }),
                                );
                            }
                        });
                        return result;
                    },
                },
            },

            GetWebsiteImage: {
                url: "/api/WebsiteOverview/GetImageUrl",
                method: "GET",
                params: {
                    website: "",
                    type: "icon",
                },
                timeout: 30000,
                isArray: false,
                cache: true,
            },
            GetWebsitesFaviconsPost: {
                url: "/api/images/favicons",
                method: "POST",
                timeout: 30000,
                isArray: false,
                cache: true,
            },
        },
    );
});
