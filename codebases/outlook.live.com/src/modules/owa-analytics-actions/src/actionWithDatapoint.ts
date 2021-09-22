import { action, ActionCreator } from 'satcheljs';
import addDatapointConfig from './addDatapointConfig';
import type { DatapointConfig } from 'owa-analytics-types';

export type DatapointConfigCreator<T extends {}, C extends ActionCreator<T>> = (
    actionMessage: ReturnType<C>,
    ...args: Parameters<C>
) => Partial<DatapointConfig>;

export function actionWithDatapoint(actionType: string): () => {};

export function actionWithDatapoint<T extends {}, C extends ActionCreator<T>>(
    actionType: string,
    createActionMessage: C
): C;

export function actionWithDatapoint<
    T extends {},
    C extends ActionCreator<T>,
    D extends DatapointConfigCreator<T, C>
>(actionType: string, createActionMessage: C, createDatapointConfig: D): C;

export function actionWithDatapoint<
    T extends {},
    C extends ActionCreator<T>,
    D extends DatapointConfigCreator<T, C>
>(actionType: string, createActionMessage?: C, createDatapointConfig?: D): C {
    return action(actionType, ((...args: Parameters<C>) => {
        const actionMessage = createActionMessage ? createActionMessage(...args) : ({} as T);
        const config = createDatapointConfig
            ? (createDatapointConfig(actionMessage as ReturnType<C>, ...args) as DatapointConfig)
            : { name: actionType };
        config.name = config.name || actionType;
        config.options = config.options || { isCore: true };
        return addDatapointConfig(config, actionMessage);
    }) as C);
}
