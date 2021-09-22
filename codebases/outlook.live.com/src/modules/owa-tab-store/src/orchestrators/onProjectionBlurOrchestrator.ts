import { orchestrator } from 'satcheljs';
import onProjectionBlur from 'owa-popout-v2/lib/actions/onProjectionBlur';
import getTabById from '../utils/getTabById';
import { getTabHandler } from '../utils/TabHandler';

orchestrator(onProjectionBlur, actionMessage => {
    const tab = getTabById(actionMessage.tabId);
    const handler = getTabHandler(tab?.type);
    handler?.onBlurProjection?.(tab);
});
