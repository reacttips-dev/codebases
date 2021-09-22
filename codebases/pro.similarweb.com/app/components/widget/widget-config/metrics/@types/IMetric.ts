import swLog from "@similarweb/sw-log";
import * as all from "../all-metrics";
import { Properties } from "./IProperties";
import { Compare, Single } from "./IWidgetTypes";
import _ from "lodash";

export interface IMetric {
    id: string;
    properties: Properties;
    widgets: Widgets;
    getDashboardWidgetTypes?: (params: WizardParams) => any;
    serverId?: string;
}

interface Widgets {
    single?: Single;
    compare?: Compare;
}

export interface WizardParams {
    competitorList: any[];
    comparedDurationSelectedItem?: string;
}

export function getMetric(name: string) {
    if (!(name in allMetrics)) {
        swLog.error(`${name} Metric was not defined. Did you forget to call 'registerMetric()' ?`);
    }
    return allMetrics[name];
}

export const allMetrics = _.fromPairs(Object.entries(all)); // get all the objects
