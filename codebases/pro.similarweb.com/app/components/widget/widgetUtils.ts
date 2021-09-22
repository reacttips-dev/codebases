import { Injector } from "common/ioc/Injector";
import { TableWidget } from "components/widget/widget-types/TableWidget";
import { IRouterState } from "routes/allStates";
import { SwNavigator } from "common/services/swNavigator";
import { getLegacyState, Solutions2Package } from "common/services/solutions2Helper";
export const getWidgetKey = (keys) => {
    const chosenSites: any = Injector.get("chosenSites");
    return keys.split(",").map((website) => ({
        id: website,
        name: website,
        image: chosenSites.getInfo(website).icon,
        smallIcon: true,
    }));
};

const getEmptyObject = (params) => ({});

/** Simple Widget class the includes all the config generation code.
 *  the config generation boilerplate is extracted into this generated class under the method 'getAllConfigs().'
 *  the returned class inherits from the base class passed in under 'BaseClass' argument
 *
 * */
export function createBaseClassFrom(
    BaseClass,
    getWidgetConfig,
    getMetricTypeConfig = getEmptyObject,
    getMetricConfig = getEmptyObject,
) {
    return class extends BaseClass {
        static getAllConfigs(params) {
            const widgetConfig = getWidgetConfig(params);
            const { properties, ...otherConfigParts } = widgetConfig;
            return {
                widgetConfig: {
                    properties: {
                        ...params,
                        ...properties,
                    },
                    ...otherConfigParts,
                },
                metricConfig: getMetricConfig(params),
                metricTypeConfig: getMetricTypeConfig(params),
                apiController: widgetConfig.properties.apiController,
                viewOptions: widgetConfig.properties.options,
            };
        }
    };
}

/** class that inherits from table which also has getAllConfigs() method
 *
 * */
export const getTableBaseClass = (getWidgetConfig, getMetricConfig?) => {
    const AdsTableBase = createBaseClassFrom(TableWidget, getWidgetConfig, getMetricConfig);
    return class extends AdsTableBase {
        static getWidgetMetadataType() {
            return "Table";
        }

        static getWidgetResourceType() {
            return "Table";
        }

        get templateUrl() {
            return `/app/components/widget/widget-templates/table.html`;
        }
    };
};

export const getWidgetCTATarget = (
    target: IRouterState | string,
    legacyPackagePriority: Solutions2Package[] = [],
    swNavigator: SwNavigator,
    innerPackageLevel?: string,
) => {
    const currentState = swNavigator.current();
    const targetState = swNavigator.getState(target);
    let finalTargetState = targetState;
    if (swNavigator.getPackageName(currentState) !== swNavigator.getPackageName(targetState)) {
        const legacyStateName = getLegacyState(
            targetState,
            legacyPackagePriority,
            innerPackageLevel,
        );
        if (legacyStateName) {
            finalTargetState = swNavigator.getState(legacyStateName);
        }
    }
    const isSamePackage =
        swNavigator.getPackageName(currentState) === swNavigator.getPackageName(finalTargetState);
    return [finalTargetState, isSamePackage];
};
