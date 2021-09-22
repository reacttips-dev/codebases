import * as _ from "lodash";

import { IWidget, Widget, SWItem, getKeyForApi } from "../widget-types/Widget";
import swLog from "@similarweb/sw-log";
import { Injector } from "common/ioc/Injector";

interface IWidgetCtor {
    new (): IWidget<any>;

    getAllConfigs?: (
        params: any,
    ) => {
        widgetConfig: any;
        metricConfig: any;
        metricTypeConfig: any;
        apiController: string;
        viewOptions: any;
        context?: string;
    };
}

export interface IWidgetFactoryService {
    createWithConfigs<T>(params: any, widgetClass: IWidgetCtor, context: string): IWidget<T>;
    create<T>(widgetConfig: any, context: string): IWidget<T>;
    getKeyForApi(key: SWItem[]);
    initInject(obj);
}

export class WidgetFactoryService implements IWidgetFactoryService {
    private INJECT_PROP = "$inject";

    constructor(private widgetClasses: { [name: string]: IWidgetCtor }) {}

    createWithConfigs<T>(params: any, widgetClass: IWidgetCtor, context: string): IWidget<T> {
        if (widgetClass.getAllConfigs) {
            const config = widgetClass.getAllConfigs(params);
            let widget: IWidget<T> = new widgetClass();
            this.initInject(widget);
            widget.initWidgetWithConfigs(config, context);
            widget.runWidget();
            return widget;
        } else {
            swLog.error(`${widgetClass.name} must implement getAllConfigs()`);
            return null;
        }
    }

    createAllWithConfigs<T>(params: any, WidgetsClasses: any, context: string) {
        return Object.entries<any>(WidgetsClasses).reduce(
            (targetInstacesCollection, [widgetName, widgetClass]) => {
                return {
                    ...targetInstacesCollection,
                    [widgetName]: this.createWithConfigs(params, widgetClass, context),
                };
            },
            {},
        );
    }

    create<T>(widgetConfig: any, context: string): IWidget<T> {
        if (widgetConfig instanceof Widget) {
            return widgetConfig;
        }
        // Deserialize JSON string properties when coming from server
        if (_.isString(widgetConfig.properties)) {
            try {
                widgetConfig.properties = JSON.parse(widgetConfig.properties || "{}");
            } catch (e) {
                swLog.error("Failed parsing widget: " + widgetConfig.properties, e);
                return null;
            }
        }
        if (_.isString(widgetConfig.pos)) {
            widgetConfig.pos = JSON.parse(widgetConfig.pos || "{}");
        }
        const widgetType = widgetConfig.type || widgetConfig.properties.type;

        const widgetTypeClass = `${widgetType}Widget`;

        const ctor = this.widgetClasses[widgetTypeClass];

        if (!ctor) {
            swLog.error(
                `Not found widget type: '${widgetTypeClass}'. Did you forget to ${widgetTypeClass}.register()?`,
            );
            return null;
        }
        if (typeof ctor === "function") {
            const widget: IWidget<T> = new ctor();
            this.initInject(widget);
            widget.initWidget(widgetConfig, context);
            widget.runWidget();
            return widget;
        }
    }

    getKeyForApi(key: SWItem[]) {
        return getKeyForApi(key);
    }

    initInject(obj) {
        let prototype = Object.getPrototypeOf(obj);

        while (prototype && prototype.constructor) {
            const inject =
                (prototype.constructor.hasOwnProperty(this.INJECT_PROP) &&
                    prototype.constructor[this.INJECT_PROP]) ||
                [];
            inject.forEach((inj) => (prototype[`_${inj}`] = Injector.get(inj)));
            prototype = Object.getPrototypeOf(prototype);
        }
    }
}
