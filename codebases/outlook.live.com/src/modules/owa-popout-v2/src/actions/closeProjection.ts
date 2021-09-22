import * as ReactDOM from 'react-dom';
import getProjection from '../utils/getProjection';
import getProjectionRoot from '../utils/getProjectionRoot';
import * as trace from 'owa-trace';
import onBeforeCloseMainWindow, { BeforeCloseMainWindowParam } from './onBeforeCloseMainWindow';
import removeProjection from './removeProjection';

export default function closeProjection(tabId: string, redirectToDeeplink: boolean) {
    const projection = getProjection(tabId);

    if (projection) {
        const param: BeforeCloseMainWindowParam = {
            redirectUrl: null,
        };

        if (redirectToDeeplink) {
            onBeforeCloseMainWindow(tabId, param);
        }

        try {
            const root = getProjectionRoot(projection);
            ReactDOM.unmountComponentAtNode(root);

            if (param.redirectUrl) {
                removeProjection(projection.window);
                projection.window.location.href = param.redirectUrl;
            } else {
                // No need to clear store here. Store will be cleared in onUnload event handler
                projection.window.close();
            }
        } catch (e) {
            trace.errorThatWillCauseAlert('Fail to close projection: ' + e);
        }
    }
}
