import { createInstance, enums } from '@optimizely/react-sdk';
import { getRuntimeConfigVariable } from '../utils/config';
const sdkKey = getRuntimeConfigVariable('SHARED_OPTIMIZELY_SDK_KEY');
if (!sdkKey && process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.warn('Could not initialize Optimizely without SDK key.');
}
let clientIinstance;
const getOptimizely = (datafile) => {
    const isServerSide = typeof window === 'undefined';
    const datafileOptions = isServerSide
        ? {
            autoUpdate: false,
        }
        : {
            updateInterval: 30000,
            autoUpdate: true,
        };
    if (isServerSide) {
        const serverInstance = createInstance({
            datafile,
            sdkKey,
            datafileOptions,
            logLevel: enums.LOG_LEVEL.WARNING,
        });
        return serverInstance;
    }
    if (!clientIinstance) {
        clientIinstance = createInstance({
            sdkKey,
            datafile,
            datafileOptions,
            logLevel: enums.LOG_LEVEL.WARNING,
            // Default values to prevent warnings
            eventBatchSize: 10,
            eventFlushInterval: 1000,
        });
    }
    return clientIinstance;
};
export default getOptimizely;
//# sourceMappingURL=index.js.map