import { getLokiBootstrapperConfig } from '../getLokiBootstrapperConfig';
import type { LokiConfig } from '../models/models';
import store from '../store/store';
import { getMidgardBootstrapperAsync } from '../utils/getMidgardBootstrapper';

let lokiConfig = undefined;

export async function fetchLokiConfigAsync(): Promise<LokiConfig> {
    if (lokiConfig) {
        return Promise.resolve(lokiConfig);
    }

    if (store.isInitialized) {
        const bootstrapperConfig = getLokiBootstrapperConfig();

        return getMidgardBootstrapperAsync()
            .then(mb => mb.fetchLokiConfigAsync(bootstrapperConfig))
            .then(config => {
                lokiConfig = config;
                return lokiConfig;
            });
    }

    return null;
}

// Should only be called after fetchLokiConfigAsync has run
export function fetchLokiConfigSync(): LokiConfig {
    if (lokiConfig) {
        return lokiConfig;
    } else {
        try {
            fetchLokiConfigAsync();
        } catch {}
        return null;
    }
}
