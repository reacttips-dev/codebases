import type { DatapointOptions } from 'owa-analytics-types';

function getDatapointOptions(): DatapointOptions {
    let ariaTenantTokens = [
        '56468f6991c348029c6bba403b444607-7f5d6cd1-7fbe-4ab1-be03-3b2b6aeb3eb4-7696',
    ];
    return {
        tenantTokens: ariaTenantTokens,
    };
}

export default getDatapointOptions;
