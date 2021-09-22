import angular from "angular";
import * as _ from "lodash";
import { CarouselList } from "components/carousel/CarouselList";
import widgetSettings from "components/dashboard/WidgetSettings";

angular
    .module("websiteAnalysis")
    .controller(
        "AudienceGeographyCtrl",
        (
            $scope,
            $location,
            $filter,
            chosenSites,
            swNavigator,
            widgetFactoryService,
            geographyFetcherFactory,
        ) => {
            const params = swNavigator.getParams();
            const state = swNavigator.current();
            const keys = params.key.split(",");
            const isCompare = keys.length > 1;
            const widgets = _.clone(
                widgetSettings.getPageWidgets(state.name, isCompare ? "compare" : "single"),
            );
            const Worldwide = 999;
            const widget = widgets[0];
            const DISPLAYED_MAP_ITEMS = 5;

            widget.properties.options.overrideColumns = false;

            if (isCompare) {
                widget.properties.options.tableCompareLegend = true;
            }

            Object.assign(widget.properties, params, { family: "Website", country: Worldwide });

            widget.properties.key = _.map(keys, (website) => ({
                id: website,
                name: website,
                image: chosenSites.getInfo(website).icon,
                smallIcon: true,
            }));

            widget.widgetDataFetcher = geographyFetcherFactory;
            $scope.tableWidgetInstance = widgetFactoryService.create(widget, state);

            geographyFetcherFactory.Instance.$promise.then((response) => {
                const biggestShare = Math.round(response.Data[0].Share * 10000) / 100;
                const geoListData = response.Data.map((item) => {
                    let share = Math.round(item.Share * 10000) / 100;
                    return {
                        country: item.Country,
                        siteOrigins: chosenSites.map((site, siteInfo) => ({
                            site: site,
                            displayName: siteInfo.displayName,
                            icon: siteInfo.icon,
                            value: item.ShareList[site],
                        })),
                        value: share,
                        opacity: 0.25 + (share / biggestShare) * 0.75,
                    };
                });
                $scope.GeoMap = new CarouselList(
                    geoListData,
                    DISPLAYED_MAP_ITEMS,
                    "Countries Maps",
                );
            });

            $scope.GeoMap = new CarouselList([], DISPLAYED_MAP_ITEMS, "Countries Maps");
        },
    );
