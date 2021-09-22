import angular from "angular";
import * as _ from "lodash";
import categoryService from "common/services/categoryService";
/**
 * @responsibility handle user inputs from a2d modal controller
 */

import { IWidgetModel, IWidget } from "components/widget/widget-types/Widget";
import { swSettings } from "common/services/swSettings";
import widgetSettings from "components/dashboard/WidgetSettings";
import { SwTrack } from "services/SwTrack";
import { sitesResourceService } from "services/sitesResource/sitesResourceService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export class AddToDashboardController {
    //Properties
    private _widget: IWidget<any>;
    private _customModel: IWidgetModel;
    private _successLinkParams: Array<any> = [];
    private _widgetTitle = "";
    private _checkedDashboards: Array<any> = [];

    public dashboards: Array<any> = [];
    public editableTitle = "";
    public saving = false;
    public success = false;
    public inEditMode = false;
    public multipleDashboards = false;
    public buttonDisabled = true;

    //Methods
    public startEdit: () => void;
    public isDashboardTitleValid: () => boolean;
    public createDashboard: () => void;
    public toggleAddButton: () => void;
    public toggleCheck: (any) => void;
    public cta: () => void;
    private _getWidgetModel: (IWidget) => IWidgetModel;
    private _addWidget: () => void;
    private swSettings = swSettings;

    constructor(
        private dashboardService,
        private widget,
        private swNavigator,
        private customModel,
        private i18nFilter,
        private industryKeyToTitleFilter,
        private $timeout,
        private $q,
        private sitesResource,
    ) {
        this._widget = widget;
        this._customModel = customModel;
        this._widgetTitle = this._widget
            ? this._widget.viewData.title
            : i18nFilter(swSettings.widgets.metrics[customModel.metric].properties.title);

        //Creates copy of the dashboard list and adds required properties(eg. disabled)
        this.dashboards = dashboardService.dashboards
            .filter((d) => !d.isSharedWithMe)
            .map((dashboard) => {
                return {
                    ...dashboard,
                    disabled: true,
                    widgets: dashboard.widgets.map((widget) => ({
                        ...widget,
                    })),
                };
            });

        /**
         * Enters new dashboard title edit mode
         */
        this.startEdit = function () {
            SwTrack.all.trackEvent(
                "Pop up",
                "click",
                "Add to my Dashboard/" + this._widgetTitle + "/create dashboard",
            );
            this.editableTitle = dashboardService.generateNewTitle(
                i18nFilter("home.page.dashboard.new"),
                "title",
            );
            this.inEditMode = true;
        };

        /**
         * Verifies if dashboard title. Wrapper for external service
         * @returns {boolean}
         */
        this.isDashboardTitleValid = function () {
            //check if there is no dashboard with same name in temp dashboard array
            const tempDashboardWithSameName = this.dashboards.find(
                (dashboard) => dashboard.title === this.editableTitle,
            );
            if (tempDashboardWithSameName !== undefined) {
                return false;
            }
            return dashboardService.validateDashboardTitle({}, this.editableTitle);
        };

        /**
         * Creates a temp dashboard in this.dashboards array if title valid
         */
        this.createDashboard = function () {
            if (!this.isDashboardTitleValid()) {
                return;
            }
            this.inEditMode = false;
            this.dashboards.unshift({
                disabled: false,
                title: this.editableTitle,
            });
            SwTrack.all.trackEvent(
                "Pop up",
                "add",
                "Add to my Dashboard/" + this._widgetTitle + "/" + this.editableTitle,
            );
            this.toggleAddButton();
        };

        /**
         * Toggles CTA button if one of the dashboards enabled(checked) by user
         */
        this.toggleAddButton = function () {
            this.buttonDisabled = !_.some(this.dashboards, { disabled: false });
        };

        /**
         * Toggles dashboard
         * @param dashboard
         */
        this.toggleCheck = function (dashboard) {
            if (dashboard.disabled) {
                SwTrack.all.trackEvent(
                    "Pop up",
                    "add",
                    "Add to my Dashboard/" + this._widgetTitle + "/" + dashboard.title,
                );
            } else {
                SwTrack.all.trackEvent(
                    "Pop up",
                    "remove",
                    "Add to my Dashboard/" + this._widgetTitle + "/" + dashboard.title,
                );
            }
            dashboard.disabled = !dashboard.disabled;
            this.toggleAddButton();
        };

        /**
         * Problem: when there is no widget - no widget model
         * Solution: create custom widget model until there is no not widget left
         * @param widget
         * @returns IWidgetModel
         */
        this._getWidgetModel = function (widget): IWidgetModel {
            let _model: any;
            let _customFilters: any;
            if (widget) {
                _model = widget.getWidgetModel();
                if (widget._viewData.key) {
                    widget._viewData.key.forEach((item, i) => {
                        if (_model.key[i] && _model.key[i].image === undefined) {
                            _model.key[i].image = item.image;
                        }
                    });
                }
                const _defaultFilters = widgetSettings.getMetricWidgetFilters(
                    _model.metric,
                    _model.type,
                    _model.key.length > 1,
                    true,
                );
                _customFilters = {
                    timeGranularity: this._widget.apiParams.timeGranularity
                        ? this._widget.apiParams.timeGranularity
                        : "Daily",
                    ShouldGetVerifiedData: _model.ShouldGetVerifiedData,
                };
                if (_model.family === "Website") {
                    _defaultFilters["includeSubDomains"] = widget.apiParams.includeSubDomains;
                }
                Object.keys(_defaultFilters).forEach((filterName) => {
                    if (widget.apiParams[filterName] !== undefined) {
                        _defaultFilters[filterName] = widget.apiParams[filterName];
                    }
                });
                _model["filters"] = Object.assign(
                    _defaultFilters,
                    _model["filters"] || {},
                    _customFilters,
                    this._widget.getWidgetFilters(),
                );
                //If this._widget.getWidgetFilters() is not implemented - copy the apiParams object [SIM-20263].
                if (!Object.keys(this._widget.getWidgetFilters()).length) {
                    _model["filters"].filter = widget.apiParams.filter;
                }
                if (_model.family === "Industry") {
                    _model.key[0].name = this.industryKeyToTitleFilter(_model.key[0].name);
                    //Custom categories uses GUID in dashboards.
                    if (_model.key[0].id.indexOf("*") > -1) {
                        _model.key[0].id = categoryService.getCategory(
                            `*${_model.key[0].name}`,
                        ).categoryId;
                    }
                    _model.key[0].category = _model.key[0].id;
                }
                if (_model.family === "Keyword") {
                    //Keyword groups uses GUID in dashboards.
                    if (_model.key[0].id.indexOf("*") > -1) {
                        const groupName = _model.key[0].name.split("*")[1];
                        _model.key[0].name = groupName;
                        _model.key[0].id = keywordsGroupsService.findGroupByName(groupName).Id;
                    }
                }
            } else {
                _model = this._customModel;
            }
            return _model;
        };

        /**
         * Bound to the CTA button
         * @returns {boolean}
         */
        this.cta = () => {
            if (!this.saving) {
                this._addWidget();
            } else if (this.saving && this.success) {
                SwTrack.all.trackEvent(
                    "Internal Link",
                    "submit-ok",
                    "Add to my Dashboard/" +
                        this._widgetTitle +
                        "/" +
                        this._checkedDashboards.length,
                );
                swNavigator.go.apply(swNavigator, this._successLinkParams);
            } else {
                return false;
            }
        };

        /**
         * Adds widgets to dashboards
         * creates new dashboards or adds to existing ones
         * handles success state
         */
        this._addWidget = function () {
            this.saving = true;
            SwTrack.all.trackEvent(
                "Pop up",
                "submit-ok",
                "Add to my Dashboard/" + this._widgetTitle + "/" + this._checkedDashboards.length,
            );

            const _widgetProps = this._widget || false;

            this.getIcons(this._getWidgetModel(_widgetProps))
                .then((widgetModel: IWidgetModel) => {
                    const _widget = this.createWidget(widgetModel);
                    this._checkedDashboards = _.filter(this.dashboards, { disabled: false });
                    this.multipleDashboards = this._checkedDashboards.length > 1;
                    return this.createDashboardsQuery(this._checkedDashboards, _widget);
                })
                .then((dashboardQuery) => {
                    return this.saveDashboards(dashboardQuery);
                })
                .then((successLinkParams) => {
                    this._successLinkParams = successLinkParams;
                    this.success = true;
                })
                .catch(() => {
                    //todo: log to server
                });
        };
    }

    saveDashboards(dashboardQuery) {
        return this.$q((resolve) => {
            const _startTime = new Date().getTime();
            const _desiredTimeOut = 1000; //milliseconds
            let _successLinkParams;
            this.dashboardService.bulkAddDashboards(dashboardQuery).then(
                function (dashboardsResult) {
                    if (dashboardsResult.length === 1) {
                        _successLinkParams = [
                            "dashboard-exist",
                            { dashboardId: dashboardsResult[0].id },
                        ];
                    } else {
                        _successLinkParams = ["dashboard-new"];
                    }

                    //if request took less then 1s adding timeout to match the 1s and show the animation
                    const _delta = new Date().getTime() - _startTime;
                    if (_delta < _desiredTimeOut) {
                        const _restOfTheTime = _desiredTimeOut - _delta;
                        this.$timeout(
                            function () {
                                resolve(_successLinkParams);
                            }.bind(this),
                            _restOfTheTime,
                        );
                    } else {
                        resolve(_successLinkParams);
                    }
                }.bind(this),
            );
        });
    }

    createDashboardsQuery(dashboards, widget) {
        const _query = [];
        dashboards.forEach((dashboard) => {
            const _dashboard: any = {
                widgets: [widget],
            };
            if (dashboard.id) {
                _dashboard.id = dashboard.id;
            } else {
                _dashboard.title = dashboard.title;
            }
            _query.push(_dashboard);
        });
        return _query;
    }

    createWidget(widgetModel: IWidgetModel) {
        const _widgetTypeWidth = parseInt(widgetSettings.getDefaultWidgetSize(widgetModel.type));
        return {
            pos: JSON.stringify({ sizeX: _widgetTypeWidth }), //Set default widget type width (sizeX)
            properties: JSON.stringify(widgetModel),
        };
    }

    getIcon(item: any) {
        return item.image;
    }

    getIcons(widgetModel: IWidgetModel) {
        return this.$q((resolve) => {
            const _query = [];
            widgetModel.key.forEach((key: any) => {
                if (!this.getIcon(key)) {
                    _query.push(key.id);
                }
            });
            if (_query.length > 0) {
                sitesResourceService.getWebsitesFavicons(_query).then((favIcons) => {
                    widgetModel.key.forEach((key: any) => {
                        if (!this.getIcon(key) && favIcons[key.id]) {
                            key.image = favIcons[key.id];
                        }
                    });
                    resolve(widgetModel);
                });
            } else {
                resolve(widgetModel);
            }
        });
    }
}

angular
    .module("sw.common")
    .controller(
        "widgetAddToDashboardController",
        AddToDashboardController as ng.Injectable<ng.IControllerConstructor>,
    );
