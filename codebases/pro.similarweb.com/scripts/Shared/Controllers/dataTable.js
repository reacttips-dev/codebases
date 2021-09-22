import angular from "angular";
import * as _ from "lodash";
import { C_TABLE } from "../../../app/constants/cTable";
import { SwTrack } from "../../../app/services/SwTrack";

angular
    .module("shared")
    .controller("dataTableCtrl", function (
        $scope,
        $rootScope,
        $location,
        $timeout,
        $filter,
        chosenDataGetter,
        s_DataGetter,
        swNavigator,
        $attrs,
        swProfiler,
    ) {
        var dataGetter = chosenDataGetter.get() || s_DataGetter,
            scopeTable,
            doQuery = function (skipCache) {
                const urlOrder = $location.search()[scopeTable.name + "_orderby"],
                    urlPage = Number($location.search()[scopeTable.name + "_page"]),
                    urlFilter = $location.search()[scopeTable.name + "_filters"],
                    queryFilters = {};

                try {
                    if (urlFilter) {
                        angular.forEach(urlFilter.split("+"), function (filter) {
                            const values = filter.split(";");
                            queryFilters[values[0]] = values[2];
                        });
                    }
                } catch (e) {}

                angular.forEach(scopeTable.filters, function (filter, key) {
                    if (key === "excludeBranded" && angular.isDefined(queryFilters[key])) {
                        scopeTable.filters[key].checked = true;
                        return;
                    } else if (key === "excludeBranded") {
                        return;
                    }
                    scopeTable.filters[key].value = queryFilters[key];
                });

                $scope.query.orderby = urlOrder || scopeTable.options.defaultSorted + " desc";
                $scope.query.filter = urlFilter ? parseFilter(true) : null;
                $scope.query.page = isNaN(urlPage) ? 1 : urlPage;
                // used in mobileApps overview page to get table data according to selected mode and device
                Object.assign($scope.query, scopeTable.options.extendParams);
                loadTable(skipCache);
            },
            parseFilter = function (includeTextWrap) {
                const filters = [];
                angular.forEach(scopeTable.filters, function (filter, key) {
                    const value = filter.getValue ? filter.getValue(filter.value) : filter.value;
                    if (
                        !similarweb.utils.isEmpty(value) &&
                        !filter.disabled &&
                        filter.checked !== false
                    ) {
                        filters.push({
                            property: key,
                            action: filter.action,
                            type: filter.type,
                            value: value,
                        });
                    }
                });

                return (
                    filters.length &&
                    _.map(filters, function (item) {
                        if (includeTextWrap && scopeTable.onFilter) {
                            scopeTable.onFilter.call(this, item);
                        }

                        if (includeTextWrap) {
                            if (item.property === "category") {
                                item.action = "category";
                                //item.value = item.value.replace('~', '_');
                            }
                            return [
                                item.property,
                                item.action,
                                item.type === "number" ? item.value : '"' + item.value + '"',
                            ].join(";");
                        }
                        return [item.property, item.action, item.value].join(";");
                    }).join(includeTextWrap ? "," : "+")
                );
            },
            compileDownloadUrl = function (params) {
                return (
                    "/export/" +
                    $rootScope.requestServiceProvider +
                    "/" +
                    scopeTable.csvUrl +
                    "Tsv?" +
                    _.filter(
                        _.map(params, function (value, key) {
                            if (key === "page") {
                                value = 0;
                            }

                            return value || _.isBoolean(value)
                                ? key + "=" + encodeURIComponent(value)
                                : null;
                        }),
                        function (value) {
                            return !!value;
                        },
                    ).join("&")
                );
            },
            loadComplete = function (response) {
                $scope.loading = scopeTable.options.loading = true;
                startProfiling();
                try {
                    $(".tipsy").tipsy().remove();
                } catch (e) {}
                if (!response.Records) {
                    response = {
                        Records: response,
                    };
                }
                $scope.response = response;
                $scope.totalCount = response.TotalCount;
                $scope.totalFiltered = response.FilteredCount;
                $scope.totalUnGroupedCount = response.TotalUnGroupedCount || $scope.totalCount;
                $scope.pages = Math.ceil(
                    ($scope.totalFiltered || $scope.totalCount) / C_TABLE.pageSize,
                );
                $scope.currentIndex = ($scope.query.page - 1) * C_TABLE.pageSize;
                $scope.totalShow =
                    $scope.totalUnGroupedCount < 100 ? $scope.totalUnGroupedCount : 100;

                if (!_.isEmpty(response.Records) && scopeTable.options.sortOnClient) {
                    const params = Object.assign({}, swNavigator.getApiParams(), $scope.query),
                        sortingVal = params[scopeTable.name + "_orderby"],
                        sortingParam = sortingVal
                            ? sortingVal.split(" ")
                            : [scopeTable.options.defaultSorted, "desc"],
                        column = sortingParam.splice(0, sortingParam.length - 1).join(" ");
                    sortRecords(response.Records, column, _.last(sortingParam) === "desc");
                }

                $scope.showGridControls = !response.UpgradeRequired;

                processData(response.Records);

                scopeTable.processResponse && scopeTable.processResponse(response, $scope.query);

                // make 'loading' flag work, even when the data is cached
                $timeout(function () {
                    $scope.loading = scopeTable.options.loading = false;
                });
            },
            sortRecords = function (records, column, desc) {
                let v = desc ? -1 : 1,
                    columnType = _.find(scopeTable.options.columns, { name: column }).type,
                    sorter;
                sorter = function (a, b) {
                    return b[column] < a[column] ? v : -v;
                };
                records.sort(sorter);
            },
            loadTable = function (skipCache) {
                const params = Object.assign(swNavigator.getApiParams(), $scope.query);
                const sortingKey = scopeTable.name + "_orderby";
                $scope.downloadUrl = compileDownloadUrl(
                    scopeTable.options.sortOnClient
                        ? _.omit(params, "orderby", sortingKey)
                        : params,
                );
                scopeTable.options.downloadUrl = $scope.downloadUrl;
                if (scopeTable.onLoadStart) {
                    scopeTable.onLoadStart.call(this, params);
                }

                dataGetter.cancel(scopeTable.url);

                if (scopeTable.options.sortOnClient) {
                    if (
                        $scope.loadedParams &&
                        $.param(_.omit($scope.loadedParams, "orderby", sortingKey)) ===
                            $.param(_.omit(params, "orderby", sortingKey))
                    ) {
                        loadComplete($scope.response);
                        return;
                    }
                }

                $scope.loading = scopeTable.options.loading = true;
                const skipHeader = false;

                dataGetter.get(scopeTable.url, null, $scope.query, skipHeader, skipCache).then(
                    function (response) {
                        $scope.loadedParams = params;
                        // Process data with dynamic column names, used by rankingTable only (meanwhile)
                        if (!_.isEmpty(response) && scopeTable.processDynamicData) {
                            response = scopeTable.processDynamicData(response);
                        }
                        loadComplete(response);
                    },
                    function (reason) {
                        $scope.loadedParams = params;
                        if (reason === "reject") {
                            return;
                        }
                        loadComplete(
                            {
                                Records: [],
                                TotalCount: 0,
                            },
                            true,
                        );
                    },
                );
            },
            filterApply = (function () {
                let stop,
                    oldFilters = null;
                return function (delay) {
                    stop && $timeout.cancel(stop);
                    stop = $timeout(function () {
                        let params = $location.search() || {},
                            newFilters = (params[scopeTable.name + "_filters"] =
                                parseFilter() || null),
                            currentPage = $location.search()[scopeTable.name + "_page"] || 1;
                        $timeout.cancel(stop);
                        if (newFilters !== oldFilters) {
                            oldFilters = newFilters;
                            currentPage = 1;
                        }
                        params[scopeTable.name + "_page"] = currentPage;
                        $location.search(params);
                    }, delay || 0);
                };
            })(),
            changePage = function (change) {
                if ($scope.query.page + change < 1) {
                    return;
                }

                $location.search(scopeTable.name + "_page", $scope.query.page + change);
                const params = swNavigator.getParams();
                SwTrack.google.trackEvent([
                    "TablePage",
                    scopeTable.url,
                    params.key + " for " + params.duration + " months",
                    $scope.query.page,
                ]);
            },
            processData = function (data) {
                const items = [];
                angular.forEach(data, function (item, index) {
                    const children = item.Children || [];

                    item.index = index + 1;
                    item.collapsed = true;
                    item.show = Math.min(children.length, 5);
                    angular.forEach(children, function (child, i) {
                        // prevent cyclic dependency
                        // child.parent = item;
                        child.index = item.index;
                        child.childIndex = i;
                    });

                    items.push(item, children);
                });

                scopeTable.options.data = _.flatten(items, true);
            };

        $scope.query = Object.assign({}, $scope.initialQuery, {
            filter: "",
            orderby: null,
            page: 1,
        });

        $scope.loading = false;

        $scope.currentIndex = 0;

        $scope.sort = function (column, dir, trackingName) {
            $location.search(scopeTable.name + "_orderby", column + " " + dir);
            trackTableEvent(
                "Sort",
                "click",
                _.template("Table/<%= column %>/<%= direction %>")({
                    column: trackingName,
                    direction: dir,
                }),
            );
        };

        $scope.swTableSort = function (table, column) {
            const tableColumns = $scope[table].tableColumns || $scope[table].options.columns;
            tableColumns.forEach(function (col) {
                col.isSorted = false;
                if (column.field === col.field) {
                    col.isSorted = true;
                    col.sortDirection = column.sortDirection.toLowerCase();
                }
            });
            const queryObj = Object.assign({}, $location.search());
            queryObj[$scope[table].name + "_orderby"] =
                column.field + " " + column.sortDirection.toLowerCase();
            $location.search(queryObj);
        };

        $scope.swTableSortHandler = function (table) {
            return function (column) {
                $scope.$apply(function () {
                    $scope.swTableSort(table, column);
                });
            };
        };

        $scope.swTableFilterHandler = function (table) {
            return function (column, value) {
                $scope.$apply(function () {
                    $scope.listItemClick(column, value);
                });
            };
        };

        $scope.clearAll = function () {
            angular.forEach(scopeTable.filters, function (filter, key) {
                if (filter.value && !angular.isDefined(filter.checked)) {
                    filter.value = null;
                }

                if (filter.checked) {
                    filter.checked = false;
                }
            });
            trackTableEvent("Button", "click", "Table/Clear all");
        };

        $scope.init = function (tableName, options) {
            scopeTable = $scope[tableName];
            scopeTable.doQuery = doQuery;
            scopeTable.loadComplete = loadComplete;
            scopeTable.reload = reload;
            scopeTable.options.sortOnClient = options && options.sortOnClient;

            angular.forEach(scopeTable.filters, function (filter, key) {
                $scope.$watch(tableName + ".filters." + key + ".value", function (value, oldValue) {
                    if (value == oldValue) {
                        // null == undefined
                        return;
                    }
                    filterApply(filter.delay === true ? C_TABLE.filterDelay : filter.delay);
                });

                $scope.$watch(tableName + ".filters." + key + ".checked", function (
                    value,
                    oldValue,
                ) {
                    if (value === oldValue) {
                        return;
                    }
                    filterApply(0);
                });

                $scope.$watch("query.key", function (value, oldValue) {
                    if (value && value !== oldValue) {
                        loadTable();
                    }
                });
            });

            $scope.listItemClick = function (filter, id) {
                if (!filter || !angular.isDefined(id)) {
                    return;
                }
                id = id.replace("/", "~");

                if (id && id != "others") {
                    scopeTable.filters[filter].value = id;
                    const trackingValue = id.replace("~", " > ").replace("_", " ");
                    trackTableEvent(
                        "Filter",
                        "click",
                        _.template("Table/<%= name %>/<%= value %>")({
                            name: filter,
                            value: trackingValue,
                        }),
                    );
                }
            };

            $scope.toggleRowExpand = function (row, value) {
                row.collapsed = !row.collapsed;
                trackTableEvent(
                    "Expand Collapse",
                    row.collapsed ? "collapse" : "expand",
                    "Table/" + value,
                );
            };

            $scope.businessInfoClick = function (domain, favicon) {
                $rootScope.global.businessInfo.openOverlay(domain, favicon);
            };

            $scope.trackLink = function ($event, value, isExternal) {
                trackTableEvent(
                    isExternal ? "External Link" : "Internal Link",
                    "click",
                    "Table/" + value,
                );
                $timeout(function () {
                    try {
                        $(".tipsy").tipsy().remove();
                    } catch (e) {}
                });
            };

            if (angular.isDefined(scopeTable.records)) {
                loadComplete({
                    Records: scopeTable.records,
                    TotalCount: scopeTable.totalCount,
                    TotalUnGroupedCount: scopeTable.totalUnGroupedCount,
                });
            } else {
                doQuery();
            }
        };

        $scope.nextPage = function () {
            if ($scope.query.page + 1 > $scope.pages) {
                return;
            }

            trackTableEvent("Pagination", "click", "Table/next/" + $scope.query.page);
            changePage(1);
        };

        $scope.prevPage = function () {
            if ($scope.query.page - 1 < 1) {
                return;
            }

            trackTableEvent("Pagination", "click", "Table/prev/" + $scope.query.page);
            changePage(-1);
        };

        $scope.setPage = function (page) {
            if ($scope.setPageTimeout) {
                $timeout.cancel($scope.setPageTimeout);
            }
            const current = $scope.query.page;
            $scope.setPageTimeout = $timeout(function () {
                if (current != page) {
                    trackTableEvent(
                        "Pagination",
                        "click",
                        _.template("Table/manual/<%= current %>-<%= dest %>")({
                            current: current,
                            dest: page,
                        }),
                    );
                }
                changePage(page - current);
            }, 750);
        };

        $scope.emptyText = $filter("i18n")("global.filter.empty");

        $scope.$on("navUpdate", function (event, current, params, navType) {
            doQuery();
        });

        $scope.onEnter = function () {
            filterApply(0);
        };

        let searchFilterTracking;
        // to prevent double tracking when the filter empty
        let wasEmptyFilter = false;
        $scope.onSearchFilterChange = function (searchTerm) {
            if (searchTerm == "") {
                if (wasEmptyFilter) {
                    wasEmptyFilter = false;
                    return;
                } else {
                    wasEmptyFilter = true;
                }
            }

            if (searchFilterTracking) {
                clearTimeout(searchFilterTracking);
            }
            searchFilterTracking = setTimeout(function () {
                trackTableEvent("Search bar", "click", "Table/" + searchTerm);
                searchFilterTracking = null;
            }, C_TABLE.filterDelay);
        };

        let isFirstRun = true; // fixes #SIM-20077, don't run on first navigation to page.

        $scope.onDropDownFilterChange = function (ddName, ddValue) {
            if (ddValue == "") {
                trackTableEvent(
                    "Drop Down",
                    "click",
                    _.template("Table/<%= name %>/Clear Filter")({ name: ddName }),
                );
            } else if (ddValue && ddValue.text && !isFirstRun) {
                trackTableEvent(
                    "Drop Down",
                    "click",
                    _.template("Table/<%= name %>/<%= value %>")({
                        name: ddName,
                        value: ddValue.text,
                    }),
                );
            }
            isFirstRun = false;
        };

        $scope.onDropDownClearFilter = function (ddName, ddValue) {
            if (ddValue == "") {
                trackTableEvent(
                    "Drop Down",
                    "click",
                    _.template("Table/<%= name %>/Clear Filter")({ name: ddName }),
                );
            }
        };

        function reload() {
            trackTableEvent("Refresh", "click", "Table");
            doQuery(true);
        }

        function trackTableEvent(category, action, name, value) {
            SwTrack.all.trackEvent(category, action, name, value);
        }

        //Monitor UI render time after data returned - to be executed in the AJAX callback function
        function startProfiling() {
            swProfiler.startEndOnNextTick("AngularJS Table", 12345);
        }
    });
