import type {
    DatapointConfig,
    CustomData,
    DatapointOptions,
    ActionSource,
} from 'owa-analytics-types';
import * as trace from 'owa-trace';

export interface DatapointConfigWithFunctions<U extends any[]> {
    name: string | ((...args: U) => string);
    customData?: CustomData | ((...args: U) => CustomData);
    options?: DatapointOptions | ((...args: U) => DatapointOptions);
    cosmosOnlyData?: string | ((...args: U) => string);
    actionSource?: ActionSource | ((...args: U) => ActionSource);
}

export default function extractConfig<U extends any[]>(
    config: DatapointConfigWithFunctions<U>,
    middlewareParams: U
): DatapointConfig | undefined {
    if (!config) {
        return undefined;
    }
    const name = extractPropertySafely(config, 'name', middlewareParams);
    return {
        name,
        customData: extractPropertySafely(config, 'customData', middlewareParams, name),
        options: extractPropertySafely(config, 'options', middlewareParams, name),
        cosmosOnlyData: extractPropertySafely(config, 'cosmosOnlyData', middlewareParams, name),
        actionSource: extractPropertySafely(config, 'actionSource', middlewareParams, name),
    };
}

function extractPropertySafely<U extends any[]>(
    config: DatapointConfigWithFunctions<U>,
    property: string,
    middlewareParams: U,
    name?: string
): any {
    if (config[property]) {
        try {
            return typeof config[property] === 'function'
                ? config[property].apply(null, middlewareParams)
                : config[property];
        } catch (e) {
            trace.errorThatWillCauseAlert(`${name || 'unknown'} failed to extract ${property}`, e);
        }
    }
    return undefined;
}
