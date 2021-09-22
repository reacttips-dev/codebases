import angular from "angular";
import * as _ from "lodash";
import DurationService from "services/DurationService";
import organicPaidService from "../../../scripts/common/services/organicPaid";
import { CHART_COLORS } from "../../constants/ChartColors";
import { INFO_SIDEBAR_EVENTS_NS } from "./constants/infoSidebarEventNs";
import { SwTrack } from "../../services/SwTrack";

(function () {
    /*
      Info Sidebar / developed by Eyal Weiss
      =============================================================
      2 ways to enable the sidebar integration in a "swGrid" table:

        - The modern way:
          By adding a "sidebar" attribute to the <sw-grid> element, no value needed.
          E.g.: <sw-grid sidebar options="websitesTable.options" ></sw-grid>

        - The legacy way:
          By adding a {type: 'businessInfo'} column to the columns definition.
          the code in the service below looks for this type of column,
          removes it and hooks the sidebar instead.
          This made to easily replace the old "Business Info" modal.
     */

    angular
        .module("sw.common")
        .service("imgResolver", function ($q) {
            const checkSrc = function (src, success, error) {
                const image = new Image();
                image.onload = function () {
                    if ("naturalHeight" in this) {
                        if (this.naturalHeight + this.naturalWidth === 0) {
                            error();
                            return;
                        }
                    } else if (this.width + this.height == 0) {
                        error();
                        return;
                    }
                    success();
                };
                image.onerror = function () {
                    error();
                };
                image.src = src;
            };

            const any = function (urlsArr) {
                if (!angular.isArray(urlsArr)) {
                    urlsArr = Array.prototype.slice.call(arguments);
                }
                return $q(function (resolve, reject) {
                    var check = function (arr) {
                        const src = arr.shift();
                        if (src) {
                            checkSrc(
                                src,
                                function () {
                                    resolve(src);
                                },
                                function () {
                                    check(arr);
                                },
                            );
                        } else {
                            if (arr.length) {
                                check(arr);
                            } else {
                                resolve(); // no result
                            }
                        }
                    };

                    check(urlsArr.splice(0));
                });
            };

            return {
                checkSrc: checkSrc,
                any: any,
            };
        })

        .service("infoSidebarService", function (
            imgResolver,
            $filter,
            $http,
            $q,
            $timeout,
            $rootScope,
            s_ViewGroup,
            swRoute,
            swNavigator,
            widgetResource,
        ) {
            const percentageFilter = $filter("simplePercentage");
            const i18nFilter = $filter("i18n");
            const countryByIdFilter = $filter("countryById");
            const TRAFFIC_SOURCES_COLORS = CHART_COLORS.trafficSourcesColors;

            const CARDS_DEF = {
                website: function (data) {
                    return {
                        templateUrl:
                            "/app/components/info-sidebar/cards-templates/website-card.html",
                        //data: data.info,
                        data: function () {
                            //s_ViewGroup.get('websiteanalysis/' + name, $stateParams, params, false)
                            return $q(function (resolve, reject) {
                                const duration = "1m";
                                const durationObject = DurationService.getDurationData(
                                    duration,
                                    null,
                                    "WebAnalysis",
                                );
                                $q.all([
                                    $http
                                        .get("/api/WebsiteOverview/getheader", {
                                            cache: true,
                                            params: { keys: data.domain, mainDomainOnly: false },
                                        })
                                        .then(function (res) {
                                            return res.data ? res.data[_.keys(res.data)[0]] : null;
                                        }),
                                    widgetResource
                                        .resourceByController(
                                            "WorldwideOverview",
                                            "TrafficSourcesOverview",
                                        )
                                        .PieChart({
                                            keys: data.domain,
                                            country: 999,
                                            from: durationObject.forAPI.from,
                                            to: durationObject.forAPI.to,
                                            isWindow: false,
                                            isWWW: "*",
                                            webSource: "desktop",
                                            includeSubDomains: true,
                                        })
                                        .$promise.then(function (res) {
                                            return res.Data;
                                        }),
                                    widgetResource
                                        .resourceByController(
                                            "WorldwideOverview",
                                            "EngagementOverview",
                                        )
                                        .Table({
                                            keys: data.domain,
                                            country: 999,
                                            from: durationObject.forAPI.from,
                                            to: durationObject.forAPI.to,
                                            isWindow: false,
                                            isWWW: "*",
                                            webSource: "desktop",
                                            includeSubDomains: true,
                                        })
                                        .$promise.then(function (res) {
                                            return res.Data;
                                        }),
                                ]).then(function (values) {
                                    if (values.length < 3 || _.some(values, _.isEmpty)) {
                                        reject();
                                    } else {
                                        const header = values[0],
                                            trafficSources = values[1][data.domain],
                                            audienceOverview = values[2][0];

                                        const leadingCountry =
                                            header.HighestTrafficCountry &&
                                            header.HighestTrafficCountry !== 999
                                                ? countryByIdFilter(header.HighestTrafficCountry)
                                                : undefined;

                                        const categoryName = header.Category
                                            ? $filter("i18nCategory")(header.Category).replace(
                                                  ">",
                                                  "›",
                                              )
                                            : "";
                                        let categoryLabel = categoryName;
                                        if (categoryName.length > 30) {
                                            const categorySplitIdx = categoryName.indexOf(" › ");
                                            if (categorySplitIdx > -1) {
                                                categoryLabel =
                                                    "..." + categoryName.slice(categorySplitIdx);
                                            }
                                        }

                                        // traffic sources
                                        let trafficSourcesSum = {};
                                        let trafficSourcesPct;
                                        let maxTrafficSourcePct = 0;

                                        if (trafficSources) {
                                            trafficSourcesSum = trafficSources;
                                            const totalTrafficFromSources = _.reduce(
                                                _.values(trafficSourcesSum),
                                                function (memo, num) {
                                                    return memo + num;
                                                },
                                                0,
                                            );

                                            if (totalTrafficFromSources) {
                                                trafficSourcesPct = [];
                                                angular.forEach(trafficSourcesSum, function (
                                                    value,
                                                    key,
                                                ) {
                                                    const pctValue =
                                                        value / totalTrafficFromSources;
                                                    maxTrafficSourcePct = Math.max(
                                                        maxTrafficSourcePct,
                                                        pctValue,
                                                    );
                                                    const item =
                                                        similarweb.utils.volumesAndSharesSplited
                                                            .order[key];
                                                    if (item) {
                                                        const icon = (
                                                            (item && item.icon) ||
                                                            key.toLowerCase()
                                                        )
                                                            .replace(/\s/g, "-")
                                                            .replace(/[^a-z0-9-]/gim, "");
                                                        const name = i18nFilter(item && item.title);

                                                        trafficSourcesPct.push({
                                                            icon: "sw-icon-" + icon,
                                                            color:
                                                                TRAFFIC_SOURCES_COLORS[
                                                                    trafficSourcesPct.length
                                                                ],
                                                            label: name,
                                                            key: key,
                                                            value: pctValue,
                                                            pctValue: percentageFilter(pctValue),
                                                            priority: item.priority,
                                                        });
                                                    }
                                                });
                                                trafficSourcesPct = _.sortBy(
                                                    trafficSourcesPct,
                                                    "priority",
                                                );
                                                maxTrafficSourcePct =
                                                    (
                                                        _.maxBy(trafficSourcesPct, function (item) {
                                                            return item.value;
                                                        }) || {}
                                                    ).value || 100;
                                            }
                                        }

                                        const monthlyVisitsData = {};

                                        const params = swNavigator.getParams();
                                        const siteAnalysisUrl = swNavigator.href(
                                            "websites-worldwideOverview",
                                            {
                                                key: _.escape(data.domain),
                                                country: params.country,
                                                duration: params.duration,
                                                isWWW: params.isWWW || "*",
                                            },
                                        );

                                        const normalizeValue = function (val, defaultVal) {
                                            if (val === "NaN") {
                                                return defaultVal;
                                            }
                                            return val;
                                        };

                                        const res = {
                                            site: data.domain,
                                            siteAnalysisUrl: siteAnalysisUrl,
                                            description: header.description || "",
                                            title: header.title || "",
                                            tags: header.tags,
                                            favicon: header.icon,
                                            thumbnail: header.image,
                                            country: leadingCountry,
                                            countryName: leadingCountry ? leadingCountry.text : "",
                                            countryCode: leadingCountry
                                                ? leadingCountry.code.toUpperCase()
                                                : "",
                                            category: header.category,
                                            categoryFullName: categoryName,
                                            categoryLabel: categoryLabel,

                                            hasGaToken: audienceOverview.HasGaToken,

                                            globalRank: header.globalRanking,
                                            globalRanksHistory: audienceOverview.GlobalRanks,
                                            categoryRank: header.categoryRanking,
                                            categoryRankHistory: audienceOverview.CategoryRanks,
                                            countryRank: header.highestTrafficCountryRanking,
                                            countryRankHistory: audienceOverview.CountryRanks,

                                            //leadingCountries: getLeadingCountries(audienceOverview.CountryRanks, 3),

                                            trafficSources: trafficSources,

                                            trafficSourcesSum: trafficSourcesSum,
                                            trafficSourcesPct: trafficSourcesPct,
                                            maxTrafficSourcePct: maxTrafficSourcePct,

                                            averageBounceRate: normalizeValue(
                                                audienceOverview.BounceRate,
                                                0,
                                            ),
                                            averageDailyVisits: normalizeValue(
                                                audienceOverview.AverageDailyVisits,
                                                0,
                                            ),
                                            averageMonthlyVisits: normalizeValue(
                                                audienceOverview.AvgMonthVisits,
                                                0,
                                            ),
                                            averagePageViews: normalizeValue(
                                                audienceOverview.PagesPerVisit,
                                                0,
                                            ),
                                            averageTimeOnSite: normalizeValue(
                                                audienceOverview.AverageTimeOnSite,
                                                0,
                                            ),
                                            averageWeeklyVisits: normalizeValue(
                                                audienceOverview.AverageWeeklyVisits,
                                                0,
                                            ),
                                            totalVisits: audienceOverview.TotalVisits,

                                            pageViewsHistory: audienceOverview.PageViews,
                                            timeOnSitesHistory: audienceOverview.TimeOnSites,
                                            visitsHistory: audienceOverview.Visits,

                                            visitsHistoryTrendLineConfig:
                                                monthlyVisitsData.trendLine,
                                            visitsHistoryMonthlyChange:
                                                monthlyVisitsData.monthlyChange,
                                        };
                                        resolve(res);
                                    }
                                });
                            });
                        },
                        controller: function ($scope) {},
                    };
                },
                company: function (data) {
                    return {
                        templateUrl:
                            "/app/components/info-sidebar/cards-templates/company-card.html",
                        data: function () {
                            return $http
                                .get("/api/websiteanalysis/DiscoverCompany", {
                                    cache: true,
                                    params: { domain: data.domain },
                                })
                                .then(
                                    function (res) {
                                        if (res && res.data) {
                                            if (typeof res.data === "string") {
                                                res.data = JSON.parse(res.data);
                                            }

                                            if (res.data.name) {
                                                const data = res.data;
                                                let homepage = data.homepage,
                                                    homepageDomain = homepage
                                                        ? $filter("extractDomainName")(homepage)
                                                        : undefined,
                                                    logo = data.logo,
                                                    clearbitLogo =
                                                        "//logo.clearbit.com/" + homepageDomain,
                                                    favicon = data.favicon,
                                                    faviconAlt =
                                                        "//www.google.com/s2/favicons?domain=" +
                                                        homepage,
                                                    siteAnalysisUrl,
                                                    swNavigatorParams;

                                                const encodedLocation = data.location
                                                    ? $filter("encodeURI")(
                                                          data.location.replace(/\s/g, "+"),
                                                      )
                                                    : "";
                                                const mapUrl = data.location
                                                    ? "https://maps.googleapis.com/maps/api/staticmap?scale=1&size=330x138&style=element:labels|visibility:off&maptype=roadmap&markers=color:red|" +
                                                      encodedLocation
                                                    : "";
                                                data.mapLinkHref =
                                                    "https://www.google.com/maps/place/" +
                                                    encodedLocation;

                                                data.twitterUrl = data.twitterUrl
                                                    ? "https://twitter.com/" +
                                                      $filter("socialHandle")(
                                                          data.twitterUrl,
                                                          data.name,
                                                      )
                                                    : undefined;

                                                if (homepage) {
                                                    swNavigatorParams = swNavigator.getParams();
                                                    siteAnalysisUrl = swNavigator.href(
                                                        "websites-worldwideOverview",
                                                        {
                                                            key: _.escape(homepageDomain),
                                                            country: swNavigatorParams.country,
                                                            duration: swNavigatorParams.duration,
                                                            isWWW: swNavigatorParams.isWWW || "*",
                                                        },
                                                    );
                                                }
                                                data.homepageDomain = homepageDomain;
                                                data.siteAnalysisUrl = siteAnalysisUrl;

                                                return $q
                                                    .all([
                                                        imgResolver
                                                            .any(mapUrl)
                                                            .then(function (url) {
                                                                if (url) {
                                                                    data.mapImageSrc = url;
                                                                }
                                                            }),
                                                        imgResolver
                                                            .any([favicon, faviconAlt])
                                                            .then(function (url) {
                                                                data.faviconSrc = url;
                                                            }),
                                                        imgResolver
                                                            .any([
                                                                logo,
                                                                clearbitLogo,
                                                                favicon,
                                                                faviconAlt,
                                                            ])
                                                            .then(function (url) {
                                                                data.imgSrc = url;
                                                            }),
                                                    ])
                                                    .then(function () {
                                                        return data;
                                                    });
                                            }
                                        }
                                        return null;
                                    },
                                    function () {
                                        return null;
                                    },
                                );
                        },
                        controller: function ($scope) {},
                    };
                },
            };

            const show = function (domain) {
                //console.log('infoSidebarService.show');
                $rootScope.$emit(INFO_SIDEBAR_EVENTS_NS + ".exec", "open", domain);
            };

            const hide = function () {
                //console.log('infoSidebarService.hide');
                $rootScope.$emit(INFO_SIDEBAR_EVENTS_NS + ".exec", "close");
            };

            const bindEvent = function (scope, name, listener) {
                const unbind = $rootScope.$on(INFO_SIDEBAR_EVENTS_NS + "." + name, listener);
                scope.$on("$destroy", unbind);
                return unbind;
            };

            const bindToSwGrid = function (gridScope, gridElement) {
                let hasBusinessInfoCol = false;
                const gridElemClass2 = "swTable";
                if (!gridElement.hasClass(gridElemClass2)) {
                    gridScope.options.columns = _.filter(gridScope.options.columns, function (col) {
                        if ((col || {}).type === "businessInfo") {
                            hasBusinessInfoCol = true;
                            return false;
                        }
                        return true;
                    });
                    if (!hasBusinessInfoCol && !gridElement.hasOwnProperty("sidebar")) {
                        return false; // side is disabled for this grid
                    }
                }

                const buttonTarget1 = "td.sw-domain-column";
                const buttonTarget2 = ".swTable-cell .cell-content";
                const eligibleTargetVerifier1 = "a .sw-domain-column-name";
                const eligibleTargetVerifier2 = ".swTable-content";

                const $sidebarToggleButton = $(
                    '<a class="icon discover-row-btn"><i class="btn-icon sw-icon-business-info"></i></a>',
                );
                let $markedRow,
                    sidebarActiveRowClass = "sidebar-target-active";
                const unMarkActiveRow = function () {
                    const $r = $markedRow;
                    if ($markedRow) {
                        $markedRow.removeClass(sidebarActiveRowClass);
                        $markedRow = null;
                    }
                    return $r;
                };
                const isRowMarked = function ($tr) {
                    return $tr.hasClass(sidebarActiveRowClass);
                };
                const markRow = function ($tr) {
                    $markedRow = $tr.addClass(sidebarActiveRowClass);
                };
                const getRowData = function ($tr) {
                    const rowIndex = $tr.data("index");
                    let rowData;
                    if (rowIndex !== undefined && gridScope.options && gridScope.options.data) {
                        rowData = gridScope.options.data[rowIndex];

                        //var allRowsData = gridScope.options.data;
                        //var len = allRowsData.length;
                        //var i = rowIndex;
                        //do {
                        //  rowData = allRowsData[i] || {};
                        //  i++;
                        //} while (i < len && (rowData.index || 0) < rowIndex);
                    }
                    return rowData || {};
                };
                gridElement
                    .on("mouseenter", "tr", function (e) {
                        const $tr = $(e.currentTarget);
                        if (!$tr.hasClass("sw-child-row")) {
                            // not enabled for child rows in multi-level tables
                            const $td = $tr.children(buttonTarget1);
                            if (!$td.length || !$td.find(eligibleTargetVerifier1).length) {
                                return; // not really a domain in the column
                            }
                            const $instance = $td.find(".discover-row-btn");
                            if (!$instance.length) {
                                const rowData = getRowData($tr);
                                if (rowData.Domain) {
                                    const $targetTd = $tr.children(buttonTarget1);
                                    if ($targetTd.length) {
                                        $sidebarToggleButton
                                            .clone()
                                            .attr("title", "Discover " + rowData.Domain)
                                            .appendTo($targetTd);
                                    }
                                }
                            }
                        }
                    })
                    .on("mouseenter", ".swTable-row", function (e) {
                        const $tr = $(e.currentTarget);
                        if (!$tr.length || !$tr.find(eligibleTargetVerifier2).length) {
                            return; // not really a domain in the column
                        }
                        const $instance = $tr.find(".discover-row-btn");
                        if (!$instance.length) {
                            const domainElement = $tr.find(buttonTarget2).find(".swTable-content");
                            const domain = domainElement.text().trim();
                            if (domain) {
                                const $targetTd = $tr.find(buttonTarget2);
                                if ($targetTd.length) {
                                    $sidebarToggleButton
                                        .clone()
                                        .attr("title", "Discover " + domain)
                                        .appendTo($targetTd);
                                    domainElement.addClass("swTable-content--company-button");
                                }
                            }
                        }
                    })
                    .on("mouseleave", "tr", function (e) {
                        const $tr = $(e.currentTarget),
                            $instance = $tr.children(buttonTarget1).find(".discover-row-btn");
                        if ($instance && !$tr.hasClass(sidebarActiveRowClass)) {
                            $instance.remove();
                        }
                    })
                    .on("mouseleave", ".swTable-row", function (e) {
                        const $tr = $(e.currentTarget),
                            $instance = $tr.find(".discover-row-btn");
                        if ($instance) {
                            $instance.remove();
                        }
                        const domainElement = $tr.find(".swTable-content");
                        if (domainElement.hasClass("swTable-content--company-button")) {
                            domainElement.removeClass("swTable-content--company-button");
                        }
                    })
                    .on("click", ".discover-row-btn", function (e) {
                        if (gridElement.hasClass(gridElemClass2)) {
                            show(
                                $(e.currentTarget)
                                    .parent()
                                    .find(".swTable-content")
                                    .attr("data-domain"),
                            );
                        } else {
                            const $td = $(e.currentTarget).closest("td"),
                                $tr = $td.closest("tr");
                            if ($tr.is(unMarkActiveRow())) {
                                hide();
                            } else {
                                const rowData = getRowData($tr);
                                if (rowData.Domain) {
                                    markRow($tr);
                                    show(rowData.Domain);
                                }
                            }
                        }
                    });
                //bindEvent(gridScope, 'open:before', function () {
                //  console.log('open:before');
                //});
                bindEvent(gridScope, "close", unMarkActiveRow);

                gridScope.$on("navChangeStart", function (event) {
                    $timeout(hide, 0);
                });

                gridScope.$on("$destroy", function (event) {
                    $timeout(hide, 0);
                });
            };

            $rootScope.$on(INFO_SIDEBAR_EVENTS_NS + ".show", function (e, domain) {
                SwTrack.all.trackEvent("Pop up", "open", "Table/SimilarTech/" + domain);
            });

            $rootScope.$on(INFO_SIDEBAR_EVENTS_NS + ".close", function (e, domain) {
                SwTrack.all.trackEvent("Pop up", "close", "Table/SimilarTech/" + domain);
            });

            return {
                eventsNamespace: INFO_SIDEBAR_EVENTS_NS,
                cardsDefinition: CARDS_DEF,
                show: show,
                hide: hide,
                bindToSwGrid: bindToSwGrid,
                bindEvent: bindEvent,
            };
        })

        .directive("infoSidebar", function (
            $rootScope,
            infoSidebarService,
            $animate,
            $animateCss,
            $injector,
            $q,
            $templateRequest,
            $compile,
            $timeout,
            swNavigator,
        ) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: "/app/components/info-sidebar/info-sidebar.html",
                scope: {
                    cards: "=",
                },
                link: function (scope, elem, attrs) {
                    scope.visible = false;
                    const $cardsContainer = elem.find(".sidebar-cards");
                    scope.emptyCards = function () {
                        if (scope._cardsEmptyPromise) {
                            return scope._cardsEmptyPromise;
                        }

                        const $cardEls = $cardsContainer.children();

                        return (scope._cardsEmptyPromise = $q
                            .all(
                                $cardEls.map(function (i, el) {
                                    const $el = angular.element(el);

                                    return $animate.addClass($el, "out").then(function () {
                                        $el.remove();
                                    });
                                }),
                            )
                            .then(function () {
                                scope.hasCards = false;
                                scope.expandedCard = undefined;
                                scope._cardsEmptyPromise = undefined;
                            }));
                    };

                    scope.reset = function () {
                        scope.data = {};
                        scope._cardInstances = {};
                        scope.isPending = undefined;
                        scope.curOpenCard = undefined;
                        angular.forEach(scope.pendingCards, function (cardDef, key) {
                            if (cardDef.abort) {
                                cardDef.abort();
                            }
                        });
                        scope.emptyCards();
                    };

                    scope.$watch("expandedCard", function (expandedCard, oldValue) {
                        angular.forEach(scope._cardInstances, function (cardScope, key) {
                            const card = (cardScope || {}).card;
                            if (card) {
                                if (!expandedCard || card === expandedCard) {
                                    card.expanded = !!expandedCard;
                                    card.hidden = false;
                                } else {
                                    card.expanded = false;
                                    card.hidden = true;
                                }
                            }
                        });
                    });

                    scope.reset();

                    const loadCardData = function (cardDef) {
                        return $q(function (resolve, reject) {
                            cardDef.abort = reject;
                            $q.all([$templateRequest(cardDef.templateUrl), cardDef.data()]).then(
                                function (values) {
                                    if (
                                        cardDef.domain !== scope.data.domain ||
                                        values.length < 2 ||
                                        _.some(values, _.isEmpty)
                                    ) {
                                        reject();
                                    } else {
                                        const template = values[0],
                                            data = values[1];
                                        cardDef.data = Object.assign({}, cardDef.data, data);
                                        resolve({ template: template, data: data });
                                    }
                                    cardDef.abort = null;
                                },
                            );
                        });
                    };

                    const initCard = function (cardDef, cardData) {
                        const template = cardData.template,
                            data = cardData.data;
                        const cardHtml =
                            '<sidebar-card expanded="card.expanded" card-config="card" card-data="card.data">' +
                            template +
                            "</sidebar-card>";
                        const linkFn = $compile(angular.element(cardHtml));
                        const newScope = Object.assign(scope.$new(false, scope), { card: cardDef });
                        const cardEl = linkFn(newScope);
                        return { cardEl: cardEl, cardScope: newScope };
                    };

                    const createCards = function (cardsDef) {
                        const scopeData = (scope.data = scope.data || {});
                        const domain = scope.data.domain;
                        const _cardInstances = (scope._cardInstances = {});

                        scope.isPending = true;
                        $q.all(
                            _.map(cardsDef, function (p) {
                                let cardDef;

                                if (angular.isString(p)) {
                                    cardDef = infoSidebarService.cardsDefinition[p](scopeData);
                                    cardDef.key = cardDef.key || p;
                                } else if (angular.isFunction(p)) {
                                    cardDef = p(scopeData);
                                }

                                cardDef.domain = domain;
                                cardDef.expanded = false;

                                return loadCardData(cardDef).then(
                                    function (cardData) {
                                        return { cardDef: cardDef, cardData: cardData };
                                    },
                                    function () {
                                        return null;
                                    },
                                );
                            }),
                        ).then(function (fullfield) {
                            angular.forEach(fullfield, function (r) {
                                if (r) {
                                    const cardDef = r.cardDef,
                                        cardData = r.cardData;
                                    const initRes = initCard(cardDef, cardData);
                                    cardDef.element = initRes.cardEl;
                                    scope.hasCards = true;
                                    $cardsContainer.append(initRes.cardEl);
                                    scopeData[cardDef.key] = cardData.data;
                                    _cardInstances[cardDef.key] = initRes.cardScope;
                                    initRes.cardScope.$on("$destroy", function () {
                                        initRes.cardEl.remove();
                                        delete scopeData[cardDef.key];
                                        delete _cardInstances[cardDef.key];
                                    });
                                    $animate.addClass(initRes.cardEl, "in").then(function () {
                                        initRes.cardEl.removeClass("in");
                                    });
                                }
                            });

                            scope.isPending = false;
                        });
                    };

                    /* Open Sidebar */
                    scope.open = function (domain) {
                        const doOpen = function () {
                            scope._isOpening = true;
                            scope.reset();
                            scope.data.domain = domain;

                            scope.emptyCards().then(function () {
                                createCards(scope.cards);
                                if (!scope.visible) {
                                    $rootScope.$emit(
                                        infoSidebarService.eventsNamespace + ".open",
                                        scope.data.domain,
                                    );
                                    scope.visible = true;
                                    scope._isOpening = false;
                                }
                                $rootScope.$emit(
                                    infoSidebarService.eventsNamespace + ".show",
                                    scope.data.domain,
                                );
                            });
                        };
                        if (scope._isClosing) {
                            scope.closePromise.then(function () {
                                $timeout(doOpen, 10);
                            });
                        } else {
                            doOpen();
                        }
                    };

                    /* Close Sidebar */
                    scope.close = function () {
                        if (scope.visible && !scope._isClosing) {
                            scope.closePromise = scope.emptyCards().then(function () {
                                scope.visible = false;
                                $rootScope.$emit(
                                    infoSidebarService.eventsNamespace + ".close",
                                    scope.data.domain,
                                );
                                scope.reset();
                                scope._isClosing = false;
                            });
                            scope._isClosing = true;
                        }
                    };

                    scope.collapseCard = function () {
                        if (scope.expandedCard) {
                            const cardConfig = scope.expandedCard;
                            cardConfig.element.find(".expandable").each(function (i, el) {
                                $animate.removeClass(el, "in").then(function () {
                                    if (scope.expandedCard === cardConfig) {
                                        scope.expandedCard = undefined;
                                    }
                                });
                            });
                        }
                    };

                    scope.expandCard = function (cardConfig) {
                        if (!scope.expandedCard || scope.expandedCard !== cardConfig) {
                            scope.collapseCard();

                            const cardEl = cardConfig.element;
                            scope.expandedCard = cardConfig;

                            $timeout(function () {
                                return $q
                                    .all(
                                        cardEl.find(".expandable").map(function (i, el) {
                                            return $animate.addClass(el, "in");
                                        }),
                                    )
                                    .then(function () {});
                            }, 0);
                        }
                    };

                    scope.toggleCard = function (cardConfig) {
                        if (cardConfig.expanded) {
                            scope.collapseCard();
                        } else {
                            scope.expandCard(cardConfig);
                        }
                    };
                    scope.$on(
                        "navChangeStart",
                        (event, toState, toParams, fromState, fromParams) => {
                            if (toState !== fromState) {
                                scope.close();
                            }
                        },
                    );
                },
                controller: function ($scope) {
                    const ctrl = this;

                    this.close = function () {
                        $scope.close();
                    };

                    this.open = function () {
                        $scope.open.apply($scope, arguments);
                    };

                    this.toggle = function () {
                        if ($scope.visible && $scope.data.domain === arguments[0]) {
                            this.close();
                        } else {
                            $scope.open.apply($scope, arguments);
                        }
                    };

                    this.expandCard = function (cardConfig) {
                        if (angular.isString(cardConfig)) {
                            cardConfig = $scope._cardInstances[cardConfig];
                        }
                        if (cardConfig) {
                            $scope.expandCard(cardConfig);
                        }
                    };

                    this.collapseCard = function () {
                        $scope.collapseCard();
                    };

                    this.toggleCard = function (cardConfig) {
                        if (angular.isString(cardConfig)) {
                            cardConfig = $scope._cardInstances[cardConfig];
                        }
                        if (cardConfig) {
                            $scope.toggleCard(cardConfig);
                        }
                    };

                    // service communication
                    const unbind = $rootScope.$on(
                        infoSidebarService.eventsNamespace + ".exec",
                        function (event, cmd /*, arg1 .. argN */) {
                            //console.log('exec', cmd, arguments);
                            const fn = ctrl[cmd];
                            if (angular.isFunction(fn)) {
                                const args = Array.prototype.slice.call(arguments, 2);
                                $scope.$apply(function () {
                                    fn.apply(ctrl, args);
                                });
                            }
                        },
                    );
                    $scope.$on("$destroy", unbind);
                },
            };
        })
        .directive("sidebarCard", function ($rootScope, $animate) {
            return {
                restrict: "E",
                replace: true,
                require: "^infoSidebar",
                templateUrl: "/app/components/info-sidebar/sidebar-card.html",
                scope: {
                    data: "=cardData",
                    config: "=cardConfig",
                    expanded: "=",
                },
                link: function (scope, elem, attrs, parentCtrl) {
                    scope.expand = function (key) {
                        parentCtrl.expandCard(key || scope.config);
                    };

                    scope.collapse = function () {
                        parentCtrl.collapseCard();
                    };

                    scope.toggle = function () {
                        parentCtrl.toggleCard(scope.config);
                    };

                    scope.closeSideBar = function () {
                        parentCtrl.close();
                    };

                    scope.clickExternalLink = function (domain) {
                        SwTrack.all.trackEvent(
                            "External Link",
                            "click",
                            "Table/SimilarTech/" + domain,
                        );
                    };
                    scope.clickInternalLink = function (domain) {
                        SwTrack.all.trackEvent(
                            "Internal Link",
                            "click",
                            "Table/SimilarTech/" + domain,
                        );
                    };

                    if (scope.expanded) {
                        scope.expand();
                    }
                },
            };
        });
})();
