import { getTableColumns } from "pages/lead-generator/lead-generator-exist/leadGeneratorExistConfig";
import {
    defaultView,
    siteOptimizationView,
    channelOptimizationView,
    publishersView,
    nonCountryTrafficView,
} from "./predefinedViewsConfig";
import { isEmpty, mapValues } from "lodash";

type ColumnViewConfig = { visible: boolean; index: number };
export type ViewConfig = Record<string, ColumnViewConfig>;

class PredefinedViews {
    static customConfigKey = "visible_columns_config_";
    private currentPredefinedViewId: string;

    PREDEFINED_VIEW_IDS = {
        DEFAULT: "default",
        SITE_OPTIMIZATION: "siteOptimization",
        CHANNEL_OPTIMIZATION: "channelOptimization",
        PUBLISHERS: "publishers",
        NON_COUNTRY_TRAFFIC: "nonCountryTraffic",
        CUSTOM: "custom",
    };

    PREDEFINED_VIEWS: Record<string, ViewConfig> = {
        [this.PREDEFINED_VIEW_IDS.DEFAULT]: defaultView,
        [this.PREDEFINED_VIEW_IDS.SITE_OPTIMIZATION]: siteOptimizationView,
        [this.PREDEFINED_VIEW_IDS.CHANNEL_OPTIMIZATION]: channelOptimizationView,
        [this.PREDEFINED_VIEW_IDS.PUBLISHERS]: publishersView,
        [this.PREDEFINED_VIEW_IDS.NON_COUNTRY_TRAFFIC]: nonCountryTrafficView,
        [this.PREDEFINED_VIEW_IDS.CUSTOM]: {},
    };

    get hasCustomView() {
        return !isEmpty(this.PREDEFINED_VIEWS[this.PREDEFINED_VIEW_IDS.CUSTOM]);
    }

    get currentViewId() {
        return this.currentPredefinedViewId;
    }

    get initialConfig() {
        return this.getVisibleColumnsConfig(getTableColumns());
    }

    get metricsCount() {
        return mapValues(
            this.PREDEFINED_VIEWS,
            (value) => Object.values(value).filter((config) => config?.visible).length,
        );
    }

    init(workspaceId: string) {
        this.getCustomColumnsConfig(workspaceId);
        this.getPredefinedViewId(workspaceId);
    }

    getCustomColumnsConfig(workspaceId: string) {
        const data = localStorage.getItem(`${PredefinedViews.customConfigKey}${workspaceId}`);
        const parsedData = data ? JSON.parse(data) : {};

        this.PREDEFINED_VIEWS[this.PREDEFINED_VIEW_IDS.CUSTOM] = parsedData;

        return parsedData;
    }

    saveCustomColumnsConfig(workspaceId: string, rawData: any[]) {
        const data = this.getVisibleColumnsConfig(rawData);
        this.PREDEFINED_VIEWS[this.PREDEFINED_VIEW_IDS.CUSTOM] = data;

        this.setPredefinedViewId(workspaceId, this.PREDEFINED_VIEW_IDS.CUSTOM);
        localStorage.setItem(
            `${PredefinedViews.customConfigKey}${workspaceId}`,
            JSON.stringify(data),
        );

        return data;
    }

    getVisibleColumnsConfig(columns: any[]) {
        return columns.reduce((acc, { field, visible }, index) => {
            if (field) acc[field] = { index, visible: !!visible };
            return acc;
        }, {});
    }

    getPredefinedViewStoreKey(workspaceId: string) {
        return `predefined_view_${workspaceId}`;
    }

    setPredefinedViewId(workspaceId: string, viewId: string) {
        this.currentPredefinedViewId = viewId;
        localStorage.setItem(this.getPredefinedViewStoreKey(workspaceId), viewId);
    }

    getPredefinedViewId(workspaceId: string) {
        this.currentPredefinedViewId =
            localStorage.getItem(this.getPredefinedViewStoreKey(workspaceId)) ||
            this.PREDEFINED_VIEW_IDS.DEFAULT;

        return this.currentPredefinedViewId;
    }

    getCurrentView() {
        return this.PREDEFINED_VIEWS[this.currentPredefinedViewId];
    }
}
export default new PredefinedViews();
