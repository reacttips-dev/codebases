import type LazyModuleConfig from '../types/LazyModuleConfig';

const loadedImports = {};

let config: LazyModuleConfig = {
    markImportAsLoaded: (id: string) => {
        loadedImports[id] = true;
    },
    isImportLoaded: (id: string) => loadedImports[id],
    logUsage: () => {},
    logError: () => {},
};

export function getConfig() {
    return config;
}

export function setConfig(newConfig: LazyModuleConfig) {
    config = newConfig;
}
