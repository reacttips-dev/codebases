import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

const PROJECTION_URL = 'about:blank';

export default function getProjectionUrl(projectionTabId: string) {
    return isHostAppFeatureEnabled('projectionCustomTitlebar')
        ? `${PROJECTION_URL}?windowId=${projectionTabId}`
        : PROJECTION_URL;
}
