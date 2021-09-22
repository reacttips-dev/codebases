import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import DurationService from "services/DurationService";
import { AverageUserWidget } from "./widgets/AverageUserWidget";
import { BarChartDemographicsGenderWidget } from "./widgets/BarChartDemographicsGenderWidget";
import { BarChartDemographicsWidget } from "./widgets/BarChartDemographicsWidget";
import { PieChartGenderWidget } from "./widgets/PieChartGenderWidget";
import { chosenItems } from "common/services/chosenItems";

export class appDemographicsCtrl {
    public i18nFilter: any;
    public app: any;
    public countries: any;
    public loading: boolean;
    public selectedCountryId: number;
    public widgets: any;
    public filterDisabled: boolean = true;
    public isCompare: any = false;
    private swSettings = swSettings;
    constructor(
        private widgetResource,
        private $filter,
        private $scope,
        private swNavigator,
        private widgetFactoryService,
    ) {
        this.i18nFilter = this.$filter("i18n");
        this.app = angular.copy(chosenItems.$first());
        this.loading = true;
        this.countries = {};
        this.isCompare = chosenItems.isCompare();
        const params = this.swNavigator.getParams();
        const paramsApi = this.swNavigator.getApiParams();
        const state = this.swNavigator.current().name;
        const durationData = DurationService.getDurationData(null).forAPI;
        const countrySettingsPromise = this.widgetResource
            .resourceByController("AppDemographics", "AppDemographics")
            ["Settings"](
                Object.assign({
                    to: durationData.to,
                    from: durationData.from,
                    isWindow: durationData.isWindow,
                    keys: paramsApi.appId,
                    store: paramsApi.store,
                }),
            ).$promise;

        const currentCountryParam = paramsApi.country;
        countrySettingsPromise.then(
            (data) => {
                if (!_.isEmpty(data.Data.Countries)) {
                    const { swSettings } = this;
                    this.countries = this.getSupportedCountries(
                        swSettings.current.allowedCountries,
                        data.Data.Countries,
                    );
                    this.selectedCountryId = this.getCountryId(data.Data.DefaultCountry);
                    if (!this.selectedCountryId) {
                        this.noCountryForOldWidget(840);
                    }
                    if (this.selectedCountryId !== +currentCountryParam) {
                        return this.swNavigator.go(
                            this.swNavigator.current(),
                            _.merge({}, this.swNavigator.getParams, {
                                country: this.selectedCountryId,
                            }),
                        );
                    }

                    this.initWidgets(
                        angular.merge(
                            {},
                            params,
                            {
                                key: chosenItems.$all().map((item) => ({
                                    appKey: item.Id,
                                    id: item.Id,
                                    store: (item.AppStore || "").toLowerCase(),
                                    icon: item.Icon256 || item.Icon128 || item.Icon,
                                    name: item.Title,
                                })),
                            },
                            { country: this.selectedCountryId },
                        ),
                        state,
                    );

                    this.loading = false;
                    this.filterDisabled = false;
                } else {
                    this.noCountryForOldWidget(840);
                    this.initWidgets(
                        angular.merge(
                            {},
                            params,
                            {
                                key: chosenItems.$all().map((item) => ({
                                    appKey: item.Id,
                                    id: item.Id,
                                    store: (item.AppStore || "").toLowerCase(),
                                    icon: item.Icon256 || item.Icon128 || item.Icon,
                                    name: item.Title,
                                })),
                            },
                            { country: currentCountryParam },
                        ),
                        state,
                    );
                }
            },
            function fail(error) {
                this.noCountryForOldWidget(840);
                this.swLog.debug(error);
                this.initWidgets(
                    angular.merge(
                        {},
                        params,
                        {
                            key: chosenItems.$all().map((item) => ({
                                appKey: item.Id,
                                id: item.Id,
                                store: (item.AppStore || "").toLowerCase(),
                                icon: item.Icon256 || item.Icon128 || item.Icon,
                                name: item.Title,
                            })),
                        },
                        { country: currentCountryParam },
                    ),
                    state,
                );
            },
        );

        this.$scope.$watch("ctrl.selectedCountryId", (newCountry, oldCountry) => {
            if (newCountry !== oldCountry) {
                this.swNavigator.updateParams({ country: newCountry });
            }
        });
    }

    private getSupportedCountries(allowedCountries = [], supportedCountries = []) {
        return allowedCountries.filter(({ id }) => supportedCountries.indexOf(id) > -1);
    }

    private getCountryId(defaultCountryId) {
        const { country: countryFromUrl } = this.swNavigator.getParams();
        const urlCountry = _.find(this.countries, ({ id }) => id === +countryFromUrl);
        const usa: any = _.find(this.countries, ({ id }) => id === 840);
        const defaultCountry: any = _.find(this.countries, ({ id }) => id === defaultCountryId);
        const fallbackCountry = this.countries[0];
        return (urlCountry || usa || defaultCountry || fallbackCountry || {}).id;
    }

    protected initWidgets(params: any, state: string) {
        this.widgets = this.isCompare
            ? {
                  genderBar: this.widgetFactoryService.createWithConfigs(
                      params,
                      BarChartDemographicsGenderWidget,
                      state,
                  ),
                  ageBar: this.widgetFactoryService.createWithConfigs(
                      params,
                      BarChartDemographicsWidget,
                      state,
                  ),
              }
            : {
                  header: this.widgetFactoryService.createWithConfigs(
                      params,
                      AverageUserWidget,
                      state,
                  ),
                  pie: this.widgetFactoryService.createWithConfigs(
                      params,
                      PieChartGenderWidget,
                      state,
                  ),
                  ageBar: this.widgetFactoryService.createWithConfigs(
                      params,
                      BarChartDemographicsWidget,
                      state,
                  ),
              };
    }

    protected noCountryForOldWidget(countryParam: number) {
        this.loading = false;
        this.countries = this.swSettings.filterCountries([countryParam], true);
        this.selectedCountryId = countryParam;
        this.filterDisabled = true;
    }
}

angular
    .module("sw.apps")
    .controller(
        "appDemographicsCtrl",
        appDemographicsCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
