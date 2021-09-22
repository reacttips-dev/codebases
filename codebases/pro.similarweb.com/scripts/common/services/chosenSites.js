import angular from "angular";
import * as _ from "lodash";
import swLog from "@similarweb/sw-log";
import { chosenItemsChange } from "../../../app/actions/routingActions";
import organicPaidService from "./organicPaid";
import { CHART_COLORS } from "../../../app/constants/ChartColors";
import { sitesResourceService } from "../../../app/services/sitesResource/sitesResourceService";

angular
    .module("sw.common")
    .factory("chosenSites", function (
        $rootScope,
        $filter,
        $http,
        $q,
        $timeout,
        swNavigator,
        $ngRedux,
    ) {
        function notify() {
            $timeout(() => {
                $rootScope.$broadcast("chosenItemsChanged", get());
                // update redux store with change
                $ngRedux.dispatch(chosenItemsChange(sitelistForLegend()));
            });
        }

        function onChange() {
            localVars.isFavorite = false;
            var allSites = get().join(",");
            notify();
        }

        var localVars = {
            listByColors: {},
        };
        var _similarSites = [];
        var _similarSitesData = [];

        Object.defineProperties(localVars, {
            site: {
                set: (value) => {
                    value = value.toLowerCase();
                    var isVirtual = value[0] == "*";
                    if ($rootScope.global && $rootScope.global.site) {
                        $rootScope.global.site.name = value;
                        $rootScope.global.site.isVirtual = isVirtual;
                        $rootScope.global.site.displayName = isVirtual ? value.substring(1) : value;
                    }
                    onChange();
                },
                get: () => ($rootScope.global && $rootScope.global.site) || {},
            },
            list: {
                set: function (value) {
                    $rootScope.global &&
                        $rootScope.global.compare &&
                        ($rootScope.global.compare.list = value);
                    localVars.listByColors[this.site.name] = CHART_COLORS.compareMainColors[0]; //similarweb.config.compareMainColors[0];
                    value.forEach((item, index) => {
                        localVars.listByColors[item] = CHART_COLORS.compareMainColors[index + 1]; //similarweb.config.compareMainColors[index. + 1];
                    });
                    onChange();
                },
                get: () =>
                    ($rootScope.global &&
                        $rootScope.global.compare &&
                        $rootScope.global.compare.list) ||
                    [],
            },
        });

        $rootScope.$on("navChangeStart", (event, to, toParams, from, fromParams) => {
            // validate params
            if (swNavigator.validateParams(Object.assign({}, toParams), to)) {
                return;
            }
            if (toParams.key) {
                var keys = toParams.key.split(",");
                localVars.site.relatedApps = {};
                localVars.site.relatedSites = {};
                localVars.site = keys[0];
                localVars.list = keys.splice(1);
                sitesResourceService.getSimilarInfo(keys[0]).then((data) => {
                    _similarSites = data && _.map(data, "Domain");
                    _similarSitesData = data;
                });
            }
        });

        function clear(toParams) {
            // clear site
            localVars.site = "";
            localVars.list = [];
            _similarSites = [];
            _similarSitesData = [];
        }

        $rootScope.$on("navChangeComplete", () => {
            if ($rootScope.global.compare) {
                $rootScope.global.compare.loadedLength = localVars.list.length;
            }
        });

        function isFavorite() {
            return localVars.isFavorite;
        }

        function similarSites() {
            return _similarSites;
        }

        function similarSitesData() {
            return _similarSitesData;
        }

        var listInfo = {};

        // @todo: questionable behavior, should move it to directive
        function formatSite(item) {
            var siteInfo = getInfo(item);
            return (
                '<img class="favicon" src="' +
                siteInfo.icon +
                '"><span class="site-name">' +
                siteInfo.displayName +
                "</span>"
            );
        }

        function getPrimarySite() {
            return localVars.site;
        }

        function isPrimaryVirtual() {
            return localVars.site.isVirtual;
        }

        function isAnyVirtual() {
            var res = false;
            forEach((site, siteInfo) => {
                if (siteInfo.isVirtual) res = true;
            });
            return res;
        }

        function updateMainSite(data) {
            var validateRedirect = (value) => value && value.indexOf("m.") !== 0 && value;
            var mainSite = localVars.site.name;
            if (mainSite in data) {
                var siteInfo = data[mainSite];
                Object.assign($rootScope.global.site, siteInfo);
            }
            updateInfo(data);
        }

        function removeItem(item) {
            localVars.list = _.reject(localVars.list, (i) => i === item);
        }

        function isCompare() {
            return !!localVars.list.length;
        }

        function execute(callbacks /* data1, data2, ..., dataN */) {
            var allData;
            if (arguments.length > 1) {
                allData = Array.prototype.slice.call(arguments, 1);
            }

            if (callbacks.pre) {
                callbacks.pre();
            }

            if (isCompare() && callbacks.compare) {
                callbacks.compare.apply(null, allData);
            } else if (callbacks.single) {
                callbacks.single.apply(
                    null,
                    allData && _.map(allData, (data) => data[getPrimarySite().name]),
                );
            }
            if (callbacks.post) {
                callbacks.post();
            }
        }

        function count() {
            return localVars.list.length + ($rootScope.global.site ? 1 : 0);
        }

        function isLoaded() {
            return _.every(
                [$rootScope.global.site.name].concat(localVars.list),
                (item) => item in listInfo,
            );
        }

        function get(includeCompetitors) {
            if (includeCompetitors === false) {
                return [].concat(localVars.list);
            } else {
                return localVars.site.name ? [localVars.site.name].concat(localVars.list) : [];
            }
        }

        function getInfo(name) {
            return name in listInfo ? listInfo[name] : { name: name, displayName: name };
        }

        function getSitesByMainName() {
            var res = [];
            _.forEach(listInfo, (value) => res.push(value.mainDomainName));
            return res.join("~");
        }

        function getSiteColor(site) {
            return localVars.listByColors[site];
        }

        function registerSiteOrigins(records) {
            records.forEach((record) => {
                var siteOrigins = [];
                forEach((site, siteInfo, index) => {
                    if (record.SiteOrigins[site]) {
                        siteOrigins.push({
                            name: site,
                            value: record.SiteOrigins[site],
                            index: index,
                        });
                    }
                });
                record.SiteOrigins = siteOrigins;

                record.Share = {
                    name: getPrimarySite().name,
                    value: record.Share,
                };

                if (record.Children) {
                    registerSiteOrigins(record.Children);
                }
            });
        }

        function calcTotal(data, member) {
            var totalVisitsAll = 0;
            forEach((site) => {
                var siteData = data[site];
                if (!siteData) {
                    swLog.error("chosenSites.calcTotal(%s) missing data for '%s'", member, site);
                    return;
                }
                var sum = siteData[member];
                if (_.isArray(sum)) {
                    sum = organicPaidService.reduce(sum);
                }
                totalVisitsAll += sum;
            });
            return totalVisitsAll;
        }

        function forEach(iterator, context) {
            get().forEach((site, index) => {
                iterator.call(context || window, site, getInfo(site), index);
            });
        }

        function map(iterator) {
            var res = [];
            get().forEach((site, index) => {
                var siteInfo = getInfo(site);
                var item = iterator(site, siteInfo, index);
                if (_.isObject(item) && !item.displayName) item.displayName = siteInfo.displayName;
                res.push(item);
            });
            return res;
        }

        function updateInfo(siteInfoList) {
            _.forEach(siteInfoList, (item, key) => {
                listInfo[key] = {
                    icon: item.icon,
                    image: item.image,
                    category: item.category,
                    displayName: item.isVirtual ? key.substring(1) : key,
                    isVirtual: item.isVirtual,
                    mainDomainName: item.mainDomainName,
                    name: item.isVirtual ? key.substring(1) : key,
                    smallIcon: true,
                };
            });
            $ngRedux.dispatch(chosenItemsChange(sitelistForLegend()));
        }

        function sitelistForLegend() {
            return map((name, info) => ({
                name: info.displayName,
                color: localVars.listByColors[name],
                icon: info.icon,
                image: info.image,
                smallIcon: true,
            }));
        }

        function registerVisits($scope, tableName, data) {
            var visitsList = [];

            forEach((site) => {
                var visit = {
                    Display: site,
                    Name: formatSite(site),
                    Value: data.TotalVisitsGlobalList[site],
                };
                visitsList.push(visit);
            });

            $scope[tableName].visitsList = visitsList;
        }

        function registerOPS($scope, tableName, data) {
            var ops = [];

            forEach((site) => {
                var organic = _.find(data.OP[site], (item) => item.Name === "0"),
                    paid = _.find(data.OP[site], (item) => item.Name === "1"),
                    organicValue = (organic && organic.Value) || 0,
                    paidValue = (paid && paid.Value) || 0,
                    sum = paidValue + organicValue,
                    op = {
                        Name: formatSite(site),
                        Site: site,
                        Value: [
                            ["Organic", organicValue / sum, 0],
                            ["Paid", paidValue / sum, 1],
                        ],
                    };

                ops.push(op);
            });

            $scope[tableName].opsList = ops;
        }

        function registerLists($scope, items, tableName, data) {
            function parseOthersData(TotalVisitsGlobalList, sum, name) {
                if (Array.isArray(TotalVisitsGlobalList)) {
                    return data.TotalVisitsGlobalList.find((site) => site.name === name)
                        .percentage === 0
                        ? 0
                        : 1 - sum;
                }
                return data.TotalVisitsGlobalList[name] === 0 ? 0 : 1 - sum;
            }

            var columns = [],
                mainSite = getPrimarySite().name;

            forEach((site) => {
                columns.push(formatSite(site));
            });

            _.forEach(items, (item) => {
                var list = [],
                    name = item.name,
                    sums = {},
                    topList = similarweb.utils.formatTopList(
                        item.topList || data[name][mainSite] || [],
                        7,
                    ); //sort by given toplist or main site

                var hasOthers = false;
                if (
                    topList.length &&
                    _.intersection(
                        ["other", "others"],
                        [topList[topList.length - 1].Name.toLowerCase()],
                    ).length
                ) {
                    hasOthers = true;
                    topList.splice(-1, 1);
                }

                _.forEach(topList, function (category) {
                    var categorySites = (
                        item.func ||
                        function (i) {
                            return i;
                        }
                    )(
                        {
                            name: category.Name,
                            sites: [],
                        },
                        category,
                    );

                    forEach((site) => {
                        var res = _.find(data[name][site], (item) => item.Name === category.Name);

                        categorySites.sites.push({
                            name: site,
                            value: res ? res.Value : 0,
                        });
                    });

                    list.push(categorySites);
                });

                _.forEach(list, (categories) => {
                    _.forEach(categories.sites, (site) => {
                        sums[site.name] = sums[site.name] || 0;
                        sums[site.name] += Math.round(10000 * site.value) / 10000;
                    });
                });

                if (hasOthers) {
                    list.push({
                        name: "Others",
                        sites: _.map(sums, (sum, name) => ({
                            name,
                            value: parseOthersData(data.TotalVisitsGlobalList, sum, name),
                        })),
                    });
                }

                $scope[tableName].columns = columns;
                $scope[tableName][name + "List"] = list;
            });
        }

        return {
            similarSites: similarSites,
            similarSitesData: similarSitesData,
            listInfo: listInfo,
            formatSite: formatSite,
            getPrimarySite: getPrimarySite,
            isPrimaryVirtual: isPrimaryVirtual,
            isAnyVirtual: isAnyVirtual,
            updateMainSite: updateMainSite,
            removeItem: removeItem,
            isCompare: isCompare,
            execute: execute,
            count: count,
            isLoaded: isLoaded,
            get: get,
            getInfo: getInfo,
            getSitesByMainName: getSitesByMainName,
            getSiteColor: getSiteColor,
            registerSiteOrigins: registerSiteOrigins,
            calcTotal: calcTotal,
            forEach: forEach,
            map: map,
            updateInfo: updateInfo,
            sitelistForLegend: sitelistForLegend,
            registerVisits: registerVisits,
            registerOPS: registerOPS,
            registerLists: registerLists,
            isFavorite: isFavorite,
            clear: clear,
        };
    });
