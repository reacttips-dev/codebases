import type { BootStrategies } from 'owa-shared-start';
import type { PromiseWithKey } from 'owa-performance';

export function preloadStrategies(
    strategies: BootStrategies | undefined
): PromiseWithKey<unknown>[] {
    const promises: PromiseWithKey<unknown>[] = [];
    if (strategies) {
        for (let strategy of Object.keys(strategies)) {
            const lazyAction = strategies[strategy];
            if (lazyAction) {
                promises.push({
                    promise: lazyAction.import(),
                    key: strategy,
                });
            }
        }
    }
    return promises;
}
