import { getHostHub } from './getHostHub';

// This helper is only used to decide when to acquire tokens for MetaOS Hub
// All UI personalization and differences will be driven by isHostAppFeatureEnabled
export function shouldGetTokenFromMetaOSHub() {
    return !!getHostHub();
}
