import swLog from "@similarweb/sw-log";
import _ from "lodash";
import dayjs from "dayjs";
import { trackPageViewWithCustomUrl } from "services/track/track";
import { Injector } from "../common/ioc/Injector";

export const trafficSources = {
    Direct: {
        title: "utils.direct",
        priority: 0,
        primaryKey: "Direct",
    },
    Mail: {
        title: "utils.mail",
        priority: 1,
        primaryKey: "Mail",
    },
    Email: {
        title: "utils.mail",
        priority: 1,
        primaryKey: "Mail",
    },
    Referrals: {
        title: "utils.referrals",
        directory: "referrals",
        state: "websites-trafficReferrals",
        priority: 2,
        primaryKey: "Referrals",
    },
    Social: {
        title: "utils.social",
        directory: "social",
        state: "websites-trafficSocial",
        priority: 3,
        primaryKey: "Social",
    },
    OrganicSearch: {
        title: "utils.organicSearch",
        directory: "search",
        state: "websites-trafficSearch-overview",
        queryParams: "Keywords_filters=OP;%3D%3D;0",
        priority: 4,
        icon: "search",
        isDesktopOnly: true,
        primaryKey: "Organic Search",
    },
    "Organic Search": {
        title: "utils.organicSearch",
        directory: "search",
        state: "websites-trafficSearch-overview",
        queryParams: "Keywords_filters=OP;%3D%3D;0",
        priority: 4,
        icon: "search",
        isDesktopOnly: true,
        primaryKey: "Organic Search",
    },
    "Organic search": {
        title: "utils.organicSearch",
        directory: "search",
        state: "websites-trafficSearch-overview",
        queryParams: "Keywords_filters=OP;%3D%3D;0",
        priority: 4,
        icon: "search",
        isDesktopOnly: true,
        primaryKey: "Organic Search",
    },
    PaidSearch: {
        title: "utils.paidSearch",
        directory: "search",
        state: "websites-trafficSearch-overview",
        queryParams: "Keywords_filters=OP;%3D%3D;1",
        priority: 5,
        icon: "paid-search",
        isDesktopOnly: true,
        primaryKey: "Paid Search",
    },
    "Paid Search": {
        title: "utils.paidSearch",
        directory: "search",
        state: "websites-trafficSearch-overview",
        queryParams: "Keywords_filters=OP;%3D%3D;1",
        priority: 5,
        icon: "paid-search",
        isDesktopOnly: true,
        primaryKey: "Paid Search",
    },
    "Paid search": {
        title: "utils.paidSearch",
        directory: "search",
        state: "websites-trafficSearch-overview",
        queryParams: "Keywords_filters=OP;%3D%3D;1",
        priority: 5,
        isDesktopOnly: true,
        icon: "paid-search",
    },
    Search: {
        title: "utils.Search",
        directory: "search",
        state: "websites-trafficSearch-overview",
        queryParams: "selectedTab=overview",
        priority: 6,
        icon: "search",
        isMobileWebOnly: true, //Used In mmx mobile web
        primaryKey: "Search",
    },
    DisplayAds: {
        title: "utils.displayads",
        directory: "display",
        state: "websites-trafficDisplay-overview",
        icon: "display-ads",
        priority: 7,
        primaryKey: "Paid Referrals",
    },
    "Display Ads": {
        title: "utils.displayads",
        directory: "display",
        state: "websites-trafficDisplay-overview",
        icon: "display-ads",
        priority: 7,
        primaryKey: "Paid Referrals",
    },
    "Display ads": {
        title: "utils.displayads",
        directory: "display",
        state: "websites-trafficDisplay-overview",
        icon: "display-ads",
        priority: 7,
        primaryKey: "Paid Referrals",
    },
    "Paid Referrals": {
        title: "utils.displayads",
        directory: "display",
        state: "websites-trafficDisplay-overview",
        icon: "display-ads",
        priority: 7,
        primaryKey: "Paid Referrals",
    },
};

export const orderedTrafficSources = Object.entries(trafficSources)
    .sort(([source1Name, source1Object], [source2Name, source2Object]) => {
        return source1Object.priority - source2Object.priority;
    })
    .map(([sourceName]) => sourceName);

export const utils = {
    emptyFn: (item) => item,

    isEmpty: (value, allowEmptyString) =>
        value === null ||
        value === undefined ||
        (!allowEmptyString ? value === "" : false) ||
        (_.isArray(value) && value.length === 0),

    charts: {
        intervals: {
            daily: 24 * 3600 * 1000,
            weekly: 24 * 3600 * 1000 * 7,
            monthly: 24 * 3600 * 1000 * 31,
        },
        formatter: ($filter) => ({
            integer: (value) => $filter("number")(value, 0),
            number: (value, decimals) => {
                decimals = parseInt(decimals);
                if (isNaN(decimals)) {
                    const isNumberWithFraction = value % 1 !== 0;
                    if (isNumberWithFraction) {
                        decimals = 2;
                    } else {
                        decimals = 0;
                    }
                }

                return $filter("number")(value, decimals);
            },
            timeOnSite: (value) => utils.date.secondsToTime(value),
            percentage: (value) => Math.round(value * 100) + "%",
        }),
    },

    date: {
        secondsToTime: (seconds) => {
            const days = Math.floor(seconds / (60 * 60 * 24));
            const rest = dayjs().startOf("day").second(seconds).format("HH:mm:ss");
            const hours = Number(rest.substr(0, 2)) + 24 * days;
            return (hours < 10 ? "0" + hours : hours) + rest.substr(2);
        },
    },

    getValidSearchTerm: (searchTerm) => {
        try {
            if (!searchTerm) {
                return "";
            }

            searchTerm = searchTerm.trim().toLowerCase();

            const q = searchTerm.indexOf("?");
            if (q !== -1) {
                searchTerm = searchTerm.substr(0, q);
            }

            if (searchTerm.indexOf("http://") === 0) {
                searchTerm = searchTerm.substr(7);
            }

            if (searchTerm.indexOf("https://") === 0) {
                searchTerm = searchTerm.substr(8);
            }

            const directories = searchTerm.indexOf("/");
            if (directories !== -1) {
                searchTerm = searchTerm.substr(0, directories);
            }

            if (searchTerm.indexOf(".") === -1) {
                searchTerm += ".com";
            }

            if (utils.startsWithWWW(searchTerm)) {
                searchTerm = searchTerm.replace("www.", "");
            }
        } catch (e) {}
        return searchTerm;
    },

    startsWithWWW: (url) => url && url.toLowerCase().indexOf("www.") === 0,

    manipulateCategories: (categories) => {
        const parents = {};
        let cats = [];
        _.forEach(categories, (category) => {
            if (!category.Name) {
                return;
            }
            const fs = category.Name.split("/");
            const parent = fs[0];
            const son = fs[1];
            parents[parent] = parents[parent] || {
                Name: parent,
                id: parent,
                Count: 0,
            };

            parents[parent].Count += category.Count;
            parents[parent].Sons = parents[parent].Sons || {};
            if (son) {
                parents[parent].Sons[son] = { id: son, Name: son, Count: category.Count };
            }
        });

        _.forEach(parents, (value) => {
            cats.push(value);
        });

        cats = _.sortBy(cats, (category) => category.Count * -1);

        _.forEach(cats, (category) => {
            if (category.Sons) {
                category.Sons = _.sortBy(
                    category.Sons,
                    (category: { Count: number }) => category.Count * -1,
                );
            }
        });

        return cats;
    },

    populateCategories: (data, loadData, $filter, parentClickable) => {
        const i18nCategory = $filter("i18nCategory"),
            isChildReq = true;

        _.forEach(data, (item) => {
            const parent = {
                id: item.id || item.Name,
                text: i18nCategory(item.Name),
                count: item.Count,
                children: [],
                name:
                    '<span class="category-root">' +
                    '<i data-id="' +
                    item.Name +
                    '" class="sprite-category ' +
                    item.Name +
                    '"></i>' +
                    "<strong>" +
                    i18nCategory(item.Name) +
                    "</strong>" +
                    "</span>",
            };

            _.forEach(item.Sons, (son) => {
                const name = son.Name;
                parent.children.push({
                    id: parent.id + "~" + (son.id || name),
                    text: i18nCategory(item.Name + "/" + name),
                    parent: item.Name,
                    name: i18nCategory(item.Name + "/" + name, isChildReq),
                    count: son.Count,
                });
            });

            if (!parentClickable) {
                delete parent.id;
            }

            loadData.push(parent);
        });
    },

    getClassBySign: (val) => (val > 0 ? " c-positive" : val < 0 ? " c-negative" : ""),

    formatCountries: ($filter) => {
        const textById = $filter("countryTextById"),
            codeById = $filter("countryCodeById"),
            i18nFilter = $filter("i18n");
        return (item) => {
            if (item.children) {
                return item.text;
            }
            if (item.id === -2) {
                return (
                    '<a href="#" class="sw-link">' + i18nFilter("demo.dropdown.message") + "</a>"
                );
            }
            if (item.id === 999) {
                return "<i class=\"sw-icon-geography\"></i>WorldWide";
            }
            if (item.parent) {
                return textById(item.id);
            }
            return '<i class="flag flag-' + codeById(item.id) + '"></i>' + textById(item.id);
        };
    },

    getGeoData: (records, $filter) => {
        const countries = [["Country", "Share"]];
        _.forEach(records, (item) => {
            countries.push([
                $filter("countryTextById")(item.Country),
                parseFloat((item.Share * 100).toFixed(2)),
            ]);
        });

        return countries;
    },

    tabSelect: ($location, $rootScope, $scope) => {
        const swNavigator: any = Injector.get("swNavigator");
        let currentTab =
            $scope.tabs &&
            _.findKey($scope.tabs, (tabValue) => {
                switch (typeof tabValue) {
                    case "boolean":
                        return tabValue;
                    case "object":
                        return tabValue["selected"];
                }
            });
        const checkNewTab = (evt, currentState, params) => {
            const newTab = params.selectedTab;
            if (newTab !== currentTab && newTab in $scope.tabs) {
                if (_.isObject($scope.tabs[newTab])) {
                    $scope.tabs[newTab].selected = true;
                    if (currentTab && _.isObject($scope.tabs[currentTab])) {
                        $scope.tabs[currentTab].selected = false;
                        $scope.tabs[currentTab].rendered = false;
                    }
                } else {
                    $scope.tabs[newTab] = true;
                    if (currentTab && currentTab in $scope.tabs) {
                        $scope.tabs[currentTab] = false;
                    }
                }
                currentTab = newTab;
                if (!currentState.data.trackPageViewOnSearchUpdate) {
                    // do nothing
                } else {
                    trackPageViewWithCustomUrl(swNavigator.current(), swNavigator.getParams());
                }
                $scope.$broadcast("tabActivate", newTab);
            }
        };
        $scope.$on("navUpdate", checkNewTab);
        //checkNewTab();
        return (tabName) => {
            $location.search("selectedTab", tabName);
            return false;
        };
    },

    processTopics: (response, $scope) => {
        if (!response || !response.TotalCount) {
            $scope.leadingTopics = [];
            return;
        }

        $scope.leadingTopics = response.Topics;
    },

    bindCategories: (data, $scope, $filter, name?) => {
        name = name || "categories";
        const categories = [];

        utils.populateCategories(utils.manipulateCategories(data), categories, $filter, true);
        $scope.filters = $scope.filters || {};
        $scope.filters.options = $scope.filters.options || {};
        $scope.filters.options[name] = {
            placeholder: $filter("i18n")("forms.category.all"),
            formatResult: (item) =>
                item.name + (item.count ? " (" + $filter("number")(item.count) + ")" : ""),
            data: categories,
        };
    },

    bigNumber: (val) => {
        if (val < 250) {
            return val;
        }

        /*
         Round the value to make it look more aesthetic
         The chooses what to round(hundreds/thousands etc) based on the number of digits of the number
         */
        const p = Math.floor(Math.log(val) / Math.log(10));
        const r = p % 2 === 1 ? Math.pow(10, (p + 3) / 2) : 5 * Math.pow(10, (p + 2) / 2);
        return Math.round(val / r) * r;
    },

    /**
     * Formating ordered array of items
     *
     * @param {Object[]} array - reversed (desc) sorted items as array
     * @param {Number} maxRows - maximum items to include in result array
     * @param {Object} [options] - optional configuration (see available attributes in function body)
     *
     * @returns {Array} - containing the first items from array and summarizing the rest (others) as last item
     *
     */
    formatTopList: (array, maxRows, options) => {
        // input sanity checks
        if (!array || !array.length || !maxRows) {
            return [];
        }

        array = array.concat([]);

        options = Object.assign(
            {
                nameAttr: "Name",
                valueAttr: "Value",
                imgAttr: "ImageUrl",
                filterUnknown: true,
                othersLabel: "others",
                transformFunction: utils.emptyFn,
            },
            options,
        );

        // omit null and "unknown" values from array if options.filterUnknown is true
        if (options.filterUnknown) {
            array = _.filter(array, (item) => {
                if (item[options.nameAttr] && !item[options.nameAttr]) {
                    item[options.nameAttr] = "unknown";
                }
                if (typeof item[options.nameAttr] === "string") {
                    return (
                        item[options.nameAttr] &&
                        item[options.nameAttr].toLowerCase() !== "unknown" &&
                        item[options.nameAttr].toLowerCase() !== "other" &&
                        item[options.nameAttr].toLowerCase() !== "others"
                    );
                } else if (typeof item[options.nameAttr] === "number") {
                    return item[options.nameAttr] && item[options.nameAttr] > 0;
                }

                return false;
            });
        }

        if (!array.length) {
            return [];
        }

        const total =
            Math.round(_.reduce(array, (memo, el) => memo + el[options.valueAttr], 0) * 1000) /
            1000;
        let length;

        if (array.length < maxRows || (array.length == maxRows && total === 1)) {
            length = array.length;
        } else if (array.length == maxRows) {
            length = array.length - 1;
        } else {
            length = maxRows - 1;
        }

        const othersSum =
            1 - _.reduce(_.take(array, length), (memo, el) => memo + el[options.valueAttr], 0);

        if (othersSum > 0) {
            const item = {};
            item[options.nameAttr] = options.othersLabel;
            item[options.valueAttr] = othersSum;
            item[options.imgAttr] = "";
            array.splice(length, array.length - length, item);
        }

        _.forEach(array, (item) => {
            options.transformFunction(item, options.filter);
        });

        return array;
    },

    setTotals: ($scope, $filter, organicPaidService, data, dates) => {
        const stats = organicPaidService.calculateOrganicVsPaid(data);
        const monthly = _.map(data, (item) => item[0] + item[1]);
        $scope.totalVisits = stats.total;
        $scope.totalOrganicVisits = stats.organicTotal;
        $scope.totalOrganicShare = stats.organic;
        $scope.totalPaidVisits = stats.paidTotal;
        $scope.totalPaidShare = stats.paid;
        $scope.change = utils.calcChange(monthly);

        $scope.TrafficOrganicVisits = {
            data: organicPaidService.mapSumOrganic(data),
            dates: dates,
            options: { tickInterval: "monthly" },
        };

        $scope.TrafficPaidVisits = {
            data: organicPaidService.mapSumPaid(data),
            dates: dates,
            options: { tickInterval: "monthly" },
        };
        $scope.TrafficOrganicPaidVisits = {
            data: organicPaidService.mapSum(data),
            dates: dates,
            options: { tickInterval: "monthly" },
        };

        return stats;
    },

    volumesAndShares: {
        //    color: '#4485B1',
        order: {
            Direct: {
                title: "utils.direct",
                color: "#069",
                priority: 0,
            },
            Mail: {
                title: "utils.mail",
                color: "#8E70E0",
                priority: 1,
            },
            Referrals: {
                title: "utils.referrals",
                state: "websites-trafficReferrals",
                color: "#71CA2F",
                priority: 2,
            },
            Search: {
                title: "utils.search",
                state: "websites-trafficSearch",
                color: "#F60",
                priority: 3,
            },
            Social: {
                title: "utils.social",
                state: "websites-trafficSocial",
                color: "#00B5F0",
                priority: 4,
            },
            DisplayAds: {
                title: "utils.displayads",
                state: "websites-trafficDisplay-overview",
                icon: "display-ads",
                color: "#F3C",
                priority: 5,
            },
            "Paid Referrals": {
                title: "utils.displayads",
                state: "websites-trafficDisplay-overview",
                icon: "display-ads",
                color: "#F3C",
                priority: 5,
            },
        },
        sort: (source) => {
            const reservedLength = (utils.volumesAndShares.reservedPrioritiesLength =
                utils.volumesAndShares.reservedPrioritiesLength ||
                _.keys(utils.volumesAndShares.order).length);
            return (utils.volumesAndShares.order[source.key] || { priority: reservedLength })
                .priority;
        },
        reservedPrioritiesLength: 0,
    },
    volumesAndSharesSplited: {
        //    color: '#4485B1',
        order: trafficSources,
        sort: (source) => {
            const reservedLength = (utils.volumesAndSharesSplited.reservedPrioritiesLength =
                    utils.volumesAndSharesSplited.reservedPrioritiesLength ||
                    _.keys(utils.volumesAndSharesSplited.order).length),
                order = utils.volumesAndSharesSplited.order,
                key = order[source.key] || order[source.name];
            return (key || { priority: reservedLength }).priority;
        },
        reservedPrioritiesLength: 0,
    },

    appTrafficSources: {
        color: "#DB4A89",
        order: {
            "In-Store Search": {
                title: "utils.apps.trafficSources.inStoreSearch",
                priority: 0,
            },
            "Referring Apps": {
                title: "utils.apps.trafficSources.referringApps",
                priority: 1,
            },
            Charts: {
                title: "utils.apps.trafficSources.charts",
                directory: "referrals",
                priority: 2,
            },
            Featured: {
                title: "utils.apps.trafficSources.featured",
                directory: "search",
                priority: 3,
            },
            "Developer Pages": {
                title: "utils.apps.trafficSources.developerPages",
                directory: "social",
                priority: 4,
            },
            "My Apps": {
                title: "utils.apps.trafficSources.myApps",
                directory: "advertising",
                priority: 5,
            },
            Wishlist: {
                title: "utils.apps.trafficSources.wishlist",
                directory: "advertising",
                priority: 6,
            },
            "Playstore (Misc)": {
                title: "utils.apps.trafficSources.playstoreMisc",
                directory: "advertising",
                priority: 7,
            },
        },
        sort: (source) => {
            const reservedLength = (utils.appTrafficSources.reservedPrioritiesLength =
                utils.appTrafficSources.reservedPrioritiesLength ||
                _.keys(utils.appTrafficSources.order).length);
            return (utils.appTrafficSources.order[source.key] || { priority: reservedLength })
                .priority;
        },
        reservedPrioritiesLength: 0,
    },

    calcChange: (visits) => {
        if (visits && visits.length > 1) {
            return (
                (visits[visits.length - 1] - visits[visits.length - 2]) / visits[visits.length - 2]
            );
        }
        return 0;
    },

    registerTotalsCompare: ($scope, organicPaidService, chosenSites, data) => {
        const total = chosenSites.calcTotal(data, "Volumes");
        $scope.Visits = {
            data: chosenSites.map((site) => {
                const siteData = data[site];
                if (!siteData || !siteData.hasOwnProperty("Volumes")) {
                    swLog.error("registerTotalsCompare() missing data for '%s'", site);
                    return {
                        name: site,
                        color: chosenSites.getSiteColor(site),
                        y: 0,
                        percent: 0,
                    };
                }
                const sum = organicPaidService.reduce(siteData.Volumes);
                return {
                    name: site,
                    color: chosenSites.getSiteColor(site),
                    y: sum,
                    percent: total > 0 ? sum / total : 0,
                };
            }),
            options: {
                multi: true,
            },
        };
    },

    addCategoryIdFromName: (item, filter) => {
        const id = item.Name.replace("/", "~");
        if (id === filter) {
            delete item.Id;
            return;
        }
        item.Id = id;
    },

    formatKeyValue: (arr) =>
        _.map(arr, (item: { Name: string; Value: string }) => [item.Name, item.Value]),

    /**
     * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
     *
     * @param {String} text The text to be rendered.
     * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
     *
     * @see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
     */
    getTextWidth: function (text, font) {
        // re-use canvas object for better performance
        const canvas = this.canvas || (this.canvas = document.createElement("canvas"));
        const context = canvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    },

    /**
     * Uses canvas to convert from URL to Base64 image
     *
     * @see http://stackoverflow.com/questions/22172604/convert-image-url-to-base64
     * @param imageElement
     *
     *  */
    getBase64Image: (imageElement) => {
        const canvas = document.createElement("canvas");
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imageElement, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        return dataURL;
    },

    fillMissingTrafficSources: (data, isMobile) => {
        const modifiedData = { ...data };
        // preparing desktop OR mobile trafficSources array
        const trafficSourcesDictionary = Object.keys(trafficSources)
            .filter((trafficSourceKey) => {
                const prop = isMobile ? "isDesktopOnly" : "isMobileWebOnly";
                return !trafficSources[trafficSourceKey][prop];
            })
            .reduce(
                (res, trafficSourceKey) => (
                    (res[trafficSourceKey] = trafficSources[trafficSourceKey]), res
                ),
                {},
            );
        // iterating over the response traffic-sources
        Object.entries(modifiedData).forEach(([domain, value]) => {
            const domainTrafficSources = value["trafficSources"];
            if (domain !== "category") {
                const modifiedTrafficSources = {};
                // iterating over the available traffic-sources and copy each traffic-source from server to modifiedTrafficSources object
                for (const trafficSourceKey in trafficSourcesDictionary) {
                    const primaryTrafficSourceKey =
                        trafficSourcesDictionary[trafficSourceKey]["primaryKey"];
                    // in case the response contains the trafficSource
                    if (domainTrafficSources[trafficSourceKey]) {
                        // add the trafficSource to modifiedTrafficSources object
                        modifiedTrafficSources[primaryTrafficSourceKey] =
                            domainTrafficSources[trafficSourceKey];
                    } else if (!modifiedTrafficSources.hasOwnProperty(primaryTrafficSourceKey)) {
                        modifiedTrafficSources[primaryTrafficSourceKey] = 0;
                    }
                }
                modifiedData[domain].trafficSources = { ...modifiedTrafficSources };
            }
        });
        return modifiedData;
    },
};

export default utils;

const sw = (window["similarweb"] = window["similarweb"] || {});
sw.utils = utils;
