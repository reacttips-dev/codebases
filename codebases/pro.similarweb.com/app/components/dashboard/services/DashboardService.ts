import angular from "angular";
import { swSettings } from "common/services/swSettings";
/**
 * Created by vlads on 21/1/2016.
 */
import { IWidget, Widget } from "components/widget/widget-types/Widget";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import DashboardSubscriptionService from "../../../pages/dashboard/DashboardSubscriptionService";
import { marketingWorkspaceApiService } from "../../../services/marketingWorkspaceApiService";
import { openDB } from "idb";
import swLog from "@similarweb/sw-log";
import widgetSettings from "components/dashboard/WidgetSettings";
import { CUSTOM_CATEGORY_PREFIX } from "services/category/userCustomCategoryService";
import { SwTrack } from "services/SwTrack";
import categoryService from "common/services/categoryService";
import { CacheService } from "services/cache/CacheService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";
import { IDashboard } from "./IDashboard";
import { UserResource } from "../../../user-data/UserResource";

export enum EUpdateType {
    window,
    snapshot,
}

export interface IDashboardService {
    deleteWidget(widget: IWidget<any>): void;

    editWidget(widget: IWidget<any>): void;

    addWidget(widget: IWidget<any>): void;

    getDashboardById(dashboardId: string): IDashboard;

    deleteDashboard(dashboard: IDashboard): void;

    renameDashboard(dashboard: IDashboard): void;

    updateDashboardWidgets(dashboard: IDashboard): Promise<IDashboard>;

    addDashboard(dashboard: IDashboard): Promise<IDashboard>;

    duplicateDashboard(dashboardId, newDashboardName): Promise<IDashboard>;

    bulkAddDashboards(dashboards: IDashboard[]): Promise<IDashboard[]>;

    validateDashboardTitle(dashboards: Array<any>, dashboard: any, newTitle: string): boolean;

    generateNewTitle(nameTemplate, fieldName, objList?): string;

    getDashboardRelatedWorkspace({ dashboardId: string }): Promise<any>;

    getUpdateType(dashboard: any): any;
}

class DashboardService implements IDashboardService {
    private _dashboards: any[];
    private _dashboard: any;
    private newVersion = false;

    title: string;
    widgets: IWidget<any>[];

    constructor(_userDashboards: any, private _widgetFactoryService: any, private _$q: any) {
        const isReadonly = swSettings.components.Dashboard.resources.IsReadonly;
        this._dashboards = _.forEach(_userDashboards, (d) =>
            DashboardService.addDefaultsToDashboard(d, isReadonly),
        );
    }

    static addDefaultsToDashboard(dashboard, isReadonly = false) {
        dashboard.link = "/#/dashboard/" + dashboard.id;
        dashboard.editable = true;
        dashboard.widgets = DashboardService.fixWidgetsImgSrc(dashboard.widgets);
        dashboard.isSharedByMe = DashboardService.isSharedByMe(dashboard);

        if (isReadonly) {
            dashboard.readOnly = true;
            dashboard.editable = false;
        }
    }

    static isSharedByMe(dashboard) {
        return (
            _.result(dashboard, "sharedWithAccounts", []).length > 0 ||
            _.result(dashboard, "sharedWithUsers", []).length > 0
        );
    }

    addDefaultsToSharedDashboard = (dashboard) => {
        dashboard.link = "/#/dashboard/" + dashboard.id;
        dashboard.readOnly = true;
        dashboard.editable = false;
        dashboard.isSharedWithMe = true;
        dashboard.widgets = DashboardService.fixWidgetsImgSrc(dashboard.widgets);
        dashboard.isSharedByMe = false;
        const existingDashboardIndex = this._getDashboardIndex(dashboard.id);
        existingDashboardIndex > -1
            ? (this._dashboards[existingDashboardIndex] = dashboard)
            : this._dashboards.push(dashboard);
    };

    private static fixWidgetsImgSrc(widgets) {
        if (!widgets) {
            return [];
        }
        return widgets.map(function (widget) {
            let props;
            if (typeof widget.properties === "string") {
                try {
                    JSON.parse(widget.properties);
                } catch {
                    props = null;
                    swLog.error("Error parsing properties for dashboard widget: %O", widget);
                }
            } else {
                props = widget.properties;
            }
            try {
                props.key.map(function (k) {
                    if (k.image) {
                        if (k.image.substring(0, 2) == "//") {
                            k.image = "https:" + k.image;
                        }
                    }
                    return k;
                });
                widget.properties = props;
                return widget;
            } catch {
                return widget;
            }
        });
    }

    private _getDashboardIndex(dashboardId) {
        return _.findIndex(this._dashboards, { id: dashboardId });
    }

    private _getWidgetIndex(widgetId) {
        return _.findIndex(this._dashboard.widgets, { id: widgetId });
    }

    widgetPosMaker(widget) {
        if (widget.hasOwnProperty("pos")) {
            if (widget.pos.hasOwnProperty("minSizeX")) {
                this.newVersion = true;
            }
        }
        let metric, type;
        if (widget.hasOwnProperty("properties")) {
            metric = widget.properties.metric;
            type = widget.properties.type;
        } else if (widget.hasOwnProperty("apiParams")) {
            metric = widget.apiParams.metric;
            type = widget.apiParams.type;
        } else {
            metric = widget.metric;
            type = widget.type;
        }
        switch (type) {
            case "PieChart":
                return { maxSizeY: 1, minSizeX: 1, maxSizeX: 2, handles: ["w", "e"] };
            case "SingleMetric":
                return { maxSizeY: 1, minSizeX: 2, maxSizeX: 2, handles: ["w", "e"] };
            case "Table":
                return { maxSizeY: 2, minSizeX: 2, maxSizeX: 4, handles: ["w", "e"] };
            case "PeriodOverPeriodVisits":
                return { maxSizeY: 1, minSizeX: 1, maxSizeX: 2, handles: ["w", "e"] };
            case "KeywordAnalysisTotalVisits":
                return { maxSizeY: 1, minSizeX: 1, maxSizeX: 2, handles: ["w", "e"] };
            case "TrafficGrowthComparison":
                return { maxSizeY: 1, minSizeX: 4, maxSizeX: 4, handles: ["w", "e"] };
            case "MmxChannelsGraphDashboard":
                return { maxSizeY: 2, minSizeX: 3, maxSizeX: 4, handles: ["w", "e"] };
            default:
                return { maxSizeY: 2, minSizeX: 2, maxSizeX: 4, handles: ["w", "e"] };
        }
    }

    initDashboard(dashboardId) {
        this._dashboard = this._dashboards[this._getDashboardIndex(dashboardId)];
        const widgets = [];
        let widgetsMigrated = 0;
        this._dashboard.widgets.forEach((widgetConfig) => {
            try {
                if (widgetConfig instanceof Widget) {
                    widgetConfig = {
                        properties: widgetConfig.getProperties(),
                        pos: widgetConfig.pos,
                        id: widgetConfig.id,
                        dashboardId: widgetConfig.dashboardId,
                    };
                }
                if (typeof widgetConfig.properties === "string") {
                    widgetConfig.properties = JSON.parse(widgetConfig.properties);
                }
                if (
                    this._dashboard.editable &&
                    this.shouldHaveCustomAssetUniqueId(widgetConfig.properties)
                ) {
                    this.migrateCustomAssetUniqueId(widgetConfig.properties);
                    widgetsMigrated++;
                }
                //Align saved widget model from DB with current filters (e.g. 'ShouldGetVerifiedData').
                let widgetProps = widgetConfig.properties;
                if (typeof widgetProps !== "object") {
                    //The value from add-to-dashboard is stringified.
                    widgetProps = JSON.parse(widgetProps);
                }
                // sim-31104: fix currapted widgets with kw group
                // replace the name of the group with the actual name from the kw groups service
                if (widgetConfig.properties.family === "Keyword") {
                    const { id, name } = widgetConfig.properties.key[0];
                    if (id === name) {
                        const { Name: keywordGroupName } = keywordsGroupsService.findGroupById(id);
                        // if it's a group context and not a keyword context
                        keywordGroupName &&
                            (widgetConfig.properties.key[0].name = keywordGroupName);
                    }
                }
                //SIM-26821 - if widget type from Database doesn't exist - take the defaultType from config
                widgetProps.type = widgetSettings.getMetricWidgetType(
                    widgetProps.metric,
                    widgetProps.type,
                    widgetProps.key.length > 1,
                );
                widgetProps.filters = Object.assign(
                    widgetSettings.getMetricWidgetFilters(
                        widgetProps.metric,
                        widgetProps.type,
                        widgetProps.key.length > 1,
                        true,
                    ),
                    widgetConfig.properties.filters,
                );
                const newWidget = this._widgetFactoryService.create(widgetConfig);
                if (newWidget) {
                    Object.assign(newWidget.pos, this.widgetPosMaker(newWidget));
                    widgets.push(newWidget);
                }
            } catch (e) {
                swLog.error("Error creating widget from config: %O", widgetConfig);
                swLog.error("Error creating widget", e);
            }
        });
        this._dashboard.widgets = widgets;
        if (widgetsMigrated) {
            this.updateDashboardWidgets(this._dashboard);
        }
    }

    shouldHaveCustomAssetUniqueId(model) {
        if (model.key.length > 0 && model.key[0].id) {
            if (["Keyword", "Industry"].indexOf(model.family) > -1) {
                return model.key[0].id.indexOf("$*") === 0 || model.key[0].id.indexOf("*") === 0;
            }
        }
        return false;
    }

    migrateCustomAssetUniqueId(model) {
        if (model.family === "Industry") {
            const keyName = model.key[0].name;
            const category = keyName?.startsWith(CUSTOM_CATEGORY_PREFIX)
                ? keyName
                : CUSTOM_CATEGORY_PREFIX + keyName;
            const CustomCategory = categoryService.getCategory(category);
            const CustomCategoryId = CustomCategory.categoryId;
            model.key[0].id = CustomCategoryId;
            model.key[0].category = CustomCategoryId;
        } else if (model.family === "Keyword") {
            const KeywordGroup = keywordsGroupsService.findGroupByName(model.key[0].name);
            const KeywordGroupId = KeywordGroup.Id;
            model.key[0].id = KeywordGroupId;
        }
    }

    get dashboards() {
        return this._dashboards.sort((a, b) => (a.addedTime < b.addedTime ? 1 : -1));
    }

    getFirstDashboard() {
        const myDashboards = this._dashboards.filter((d) => !d.isSharedWithMe);
        if (myDashboards[0]) {
            return myDashboards[0];
        } else {
            return this._dashboards[0];
        }
    }

    getDashboards(concat) {
        const dashboardsCopy = angular.copy(this.dashboards);
        if (typeof concat === "undefined") {
            return this._dashboards;
        } else {
            return dashboardsCopy.reverse().concat(concat);
        }
    }

    get dashboard() {
        return this._dashboard;
    }

    set dashboard(dashboardId) {
        this._dashboard = this._dashboards[this._getDashboardIndex(dashboardId)];
    }

    getDashboardById(dashboardId) {
        const index = this._getDashboardIndex(dashboardId);
        return index > -1 ? this.dashboards[index] : undefined;
    }

    setIsSharedByMe(dashboardId, value) {
        this._dashboards[this._getDashboardIndex(dashboardId)].isSharedByMe = value;
    }

    setSharedWithUsers(dashboardId, value) {
        this._dashboards[this._getDashboardIndex(dashboardId)].sharedWithUsers = value;
    }

    setSharedWithAccounts(dashboardId, value) {
        this._dashboards[this._getDashboardIndex(dashboardId)].sharedWithAccounts = value;
        this.updateShareDashboardsCache(dashboardId);
    }

    private static getDashboardDBPresentation(dashboard) {
        const transformed: any = _.pick(dashboard, ["id", "title"]);
        transformed.widgets = dashboard.widgets.map((widget) => widget.getDBPresentation());
        return transformed;
    }

    private onError(action, reason, id = -1) {
        SwTrack.all.trackEvent(action, "submit-error-server", `Dashboard/${id}`, reason.statusText);
    }

    async deleteWidget(widget) {
        try {
            await UserResource.deleteWidget(widget.id);
            const widgetIndex = this._getWidgetIndex(widget.id);
            if (widgetIndex > -1) {
                this._dashboard.widgets.splice(widgetIndex, 1);
            }
        } catch (ex) {
            this.onError("Delete widget", ex, widget.id);
        }
    }

    async addWidget(widget) {
        Object.assign(widget.pos, this.widgetPosMaker(widget));
        try {
            const data = await UserResource.addWidget(widget);
            this._dashboard.widgets.push(this._widgetFactoryService.create(data));
        } catch (ex) {
            this.onError("Add widget", ex, this._dashboard.id);
        }
    }

    async editWidget(widget) {
        widget.properties.key.map(function (key) {
            if (key.hasOwnProperty("hidden")) {
                key.hidden = false;
            }
            return key;
        });

        try {
            const data = await UserResource.updateWidget(widget);
            this._dashboard.widgets[
                this._getWidgetIndex(widget.id)
            ] = this._widgetFactoryService.create(data);
        } catch (ex) {
            this.onError("Update widget", ex, widget.id);
        }
    }

    async addDashboard(dashboard) {
        try {
            const data = await UserResource.addDashboard(dashboard);
            DashboardService.addDefaultsToDashboard(data);
            this._dashboards.unshift(data);
            return data;
        } catch (ex) {
            this.onError("Add dashboard", ex);
            throw ex;
        }
    }

    async duplicateDashboard(dashboardId, newDashboardName) {
        try {
            const data = await UserResource.duplicateDashboard(dashboardId, newDashboardName);
            DashboardService.addDefaultsToDashboard(data);
            this._dashboards.unshift(data);
            return data;
        } catch (ex) {
            this.onError("Duplicate dashboard", ex);
            throw ex;
        }
    }

    /**
     * Same as duplicateDashboard but doesn't require new title
     * @param item
     * @returns {IPromise<T>}
     */
    async cloneDashboard(item) {
        let newTitle = item.title.length > 95 ? item.title.substr(0, 95) : item.title;
        newTitle = this.generateNewTitle(
            `${newTitle.replace(/(Copy)\s\(\d+\)$/, "$1 ")} Copy`,
            "title",
        );
        return this.duplicateDashboard(item.id, newTitle);
    }

    /**
     * Same as addDashboard but doesn't require new title
     * @returns {IPromise<T>}
     */
    async addNewDashboard() {
        const newTitle = this.generateNewTitle(i18nFilter()("home.page.dashboard.new"), "title");
        return this.addDashboard({ title: newTitle });
    }

    /**
     * Creates/Updates dashboards
     * @param dashboards
     * @returns {Promise<T>}
     */
    async bulkAddDashboards(dashboards) {
        try {
            const data = await UserResource.bulkAddDashboards(dashboards);
            this.addUpdateDashboards(data);
            return data;
        } catch (ex) {
            this.onError("Bulk add dashboard", ex);
            throw ex;
        }
    }

    /**
     * Updates widgets for existing dashboard or creates new one
     * uses dashboard id to match
     *
     * @param addedUpdatedDashboards array of dashboards
     */
    addUpdateDashboards(addedUpdatedDashboards) {
        const _mapping = {},
            _newDashboards = [];
        this.dashboards.forEach((dashboard, index) => {
            _mapping[dashboard.id] = { index: index, dashboard: dashboard };
        });

        addedUpdatedDashboards.forEach((addedUpdatedDashboard) => {
            if (_mapping[addedUpdatedDashboard.id]) {
                this.dashboards[_mapping[addedUpdatedDashboard.id].index].widgets =
                    addedUpdatedDashboard.widgets; //update
            } else {
                DashboardService.addDefaultsToDashboard(addedUpdatedDashboard);
                _newDashboards.push(addedUpdatedDashboard); //add
            }
        });
        //puts new dashboards at the bottom of the list, otherwise index above changes
        _newDashboards.forEach((newDashboard) => {
            this._dashboards.unshift(newDashboard);
        });
    }

    validateDashboardTitle(dashboard, newTitle) {
        if (newTitle.trim() === "") return false;
        const _dashboardsWithTitle: any = _.filter(this._dashboards, {
            title: newTitle,
        });
        if (!_dashboardsWithTitle.length && newTitle.length > 0) {
            return true;
        } else {
            if (dashboard.id) {
                return (
                    _dashboardsWithTitle.length == 1 && _dashboardsWithTitle[0].id == dashboard.id
                );
            } else {
                return _dashboardsWithTitle.length == 0;
            }
        }
    }

    async renameDashboard(dashboard) {
        try {
            const data = await UserResource.updateDashboard(dashboard);
            this._dashboards[this._getDashboardIndex(dashboard.id)].title = data.title;
            return data;
        } catch (ex) {
            this.onError("Update dashboard", ex, dashboard.id);
            throw ex;
        }
    }

    async updateDashboardWidgets(dashboard) {
        try {
            return UserResource.updateDashboardWidgets(
                DashboardService.getDashboardDBPresentation(dashboard),
            );
        } catch (ex) {
            this.onError("Update dashboard widgets", ex, dashboard.id);
            throw ex;
        }
    }

    async getDashboardRelatedWorkspace({ dashboardId }) {
        return UserResource.getDashboardRelatedWorkspace(dashboardId);
    }

    async deleteDashboard(dashboard) {
        marketingWorkspaceApiService.shouldRefresh(true);
        try {
            const data = UserResource.deleteDashboard(dashboard);
            this._dashboards.splice(this._getDashboardIndex(dashboard.id), 1);
            return data;
        } catch (ex) {
            this.onError("Delete dashboard", ex, dashboard.id);
            throw ex;
        }
    }

    generateNewTitle(nameTemplate, fieldName, objList = this._dashboards) {
        let result = nameTemplate;
        const listTitles = _.map(objList, fieldName);
        if (_.includes(listTitles, nameTemplate)) {
            let suffix = 1;
            while (_.includes(listTitles, `${nameTemplate} (${suffix})`)) {
                suffix++;
            }
            result = `${nameTemplate} (${suffix})`;
        }
        return result;
    }

    dashboardsubscribe(id) {
        return DashboardSubscriptionService.subscribeToNotification(id).then(() => {
            this.updateDashboardNotificationCache(id, true);
            this._dashboards[this._getDashboardIndex(id)].isSubscribedToNotifications = true;
        });
    }

    dashboardUnsubscribe(id) {
        return DashboardSubscriptionService.unsubscribeToNotification(id).then(() => {
            this.updateDashboardNotificationCache(id, false);
            this._dashboards[this._getDashboardIndex(id)].isSubscribedToNotifications = false;
        });
    }

    getUpdateType(dashboard) {
        const isWindow = (widget) => {
            const widgetProps = widget._widgetConfig
                ? widget._widgetConfig.properties
                : widget.properties;
            const duration = widgetProps.duration;
            return duration?.slice(-1) == "d";
        };
        const isSnapshot = (widget) => {
            const widgetProps = widget._widgetConfig
                ? widget._widgetConfig.properties
                : widget.properties;
            const duration = widgetProps.duration;
            return duration?.slice(-1) == "m";
        };

        if (dashboard.widgets.some(isWindow)) return EUpdateType.window;
        else if (dashboard.widgets.some(isSnapshot)) return EUpdateType.snapshot;
        else return false;
    }

    updateShareDashboardsCache = async (dashboardId) => {
        if (!window.indexedDB || typeof Worker === "undefined") return;

        const db = await openDB("pro-cache-db", CacheService.CURRENT_IDB_VERSION);
        const tx = db.transaction(["cache"], "readwrite");
        const store = tx.objectStore("cache");
        const userdata = await store.get("userdata");

        const newDashboards = userdata.value.dashboards.map((board) => {
            if (board.id === dashboardId) {
                board.isSharedByMe = this.dashboard.isSharedByMe;
                board.sharedWithUsers = this.dashboard.sharedWithUsers;
                board.sharedWithAccounts = this.dashboard.sharedWithAccounts;
            }
            return board;
        });

        const newUserData = {
            ...userdata.value,
            dashboards: newDashboards,
        };

        const putTx = db.transaction(["cache"], "readwrite");
        const putStore = putTx.objectStore("cache");

        const item = {
            key: "userdata",
            value: newUserData,
        };

        putStore.put(item);
        await putTx.done;
        db.close();
    };

    updateDashboardNotificationCache = async (dashboardId, status: boolean) => {
        if (!window.indexedDB || typeof Worker === "undefined") return;

        const db = await openDB("pro-cache-db", CacheService.CURRENT_IDB_VERSION);
        const tx = db.transaction(["cache"], "readwrite");
        const store = tx.objectStore("cache");
        const userdata = await store.get("userdata");

        const newDashboards = userdata.value.dashboards.map((board) => {
            if (board.id === dashboardId) {
                board.isSubscribedToNotifications = status;
            }
            return board;
        });

        const newUserData = {
            ...userdata.value,
            dashboards: newDashboards,
        };

        const putTx = db.transaction(["cache"], "readwrite");
        const putStore = putTx.objectStore("cache");

        const item = {
            key: "userdata",
            value: newUserData,
        };

        putStore.put(item);
        await putTx.done;
        db.close();
    };
}

export const dashboardServiceFactory = (dashboards, widgetFactoryService, $q) => {
    return new DashboardService(dashboards, widgetFactoryService, $q);
};

angular.module("sw.common").factory("dashboardService", (widgetFactoryService, $q) => {
    const dashboards = window["similarweb"].config.userData.dashboards;
    return dashboardServiceFactory(dashboards, widgetFactoryService, $q);
});
