import { getOpxHostApi } from 'owa-opx';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export default function notifyOpxReady() {
    if (isHostAppFeatureEnabled('opxComponentLifecycle')) {
        getOpxHostApi().onScenarioLoaderRemoved();
        getOpxHostApi().onPageReady();
    }
}
