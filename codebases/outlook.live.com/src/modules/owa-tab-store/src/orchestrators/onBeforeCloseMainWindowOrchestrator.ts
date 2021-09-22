import { orchestrator } from 'satcheljs';
import onBeforeCloseMainWindow from 'owa-popout-v2/lib/actions/onBeforeCloseMainWindow';
import getTabById from '../utils/getTabById';
import { getTabHandler } from '../utils/TabHandler';

orchestrator(onBeforeCloseMainWindow, actionMessage => {
    const tab = getTabById(actionMessage.tabId);
    const handler = getTabHandler(tab?.type);
    actionMessage.param.redirectUrl = handler?.onBeforeCloseMainWindow?.(tab);
});
