import { isFeatureEnabled } from 'owa-feature-flags';
import getScopedPath from './getScopedPath';

let indexedReactPath: string;
export default function getOutlookSpacesPath(): string {
    if (!indexedReactPath) {
        indexedReactPath = isFeatureEnabled('cal-board-linkForwarding')
            ? getScopedPath('/calendar/view/board/')
            : getScopedPath('/spaces/');
    }
    return indexedReactPath;
}
