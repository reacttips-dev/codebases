import { isFeatureEnabled } from 'owa-feature-flags';
import {
    getAutoRunAddinCommandsByEventType,
    addAutoRunAddinsToWaitingQueue,
    processAutoRunWaitingQueue,
    IAutoRunAddinCommand,
    IExtendedAddinCommand,
    IAddinCommandTelemetry,
    TaskPaneType,
    getTaskPaneRunningInstance,
} from 'owa-addins-store';
import LaunchEventType from 'owa-service/lib/contract/LaunchEventType';
import { ExtendedAddinCommand, AutoRunAddinCommandTelemetry } from 'owa-addins-schema';
import sleep from 'owa-sleep';

const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;

/*
    1. Entry point to launch and execute autoRun Add-ins.
    2. Accepts hosteItemIndex and LaunchEventType as parameters
*/
let launchAutoRunAddins = (hostItemIndex: string, launchEventType: LaunchEventType, args?: any) => {
    if (!isFeatureEnabled('addin-autoRun')) {
        return;
    }
    const autoRunAddinCommandList: IAutoRunAddinCommand[] = getAutoRunAddinCommandsByEventType(
        launchEventType
    ) as IAutoRunAddinCommand[];
    const extendedAddinCommandList = autoRunAddinCommandList.map(autoRunAddinCommand => {
        return new ExtendedAddinCommand(
            autoRunAddinCommand,
            new AutoRunAddinCommandTelemetry() as IAddinCommandTelemetry
        );
    }) as IExtendedAddinCommand[];

    addAutoRunAddinsToWaitingQueue(extendedAddinCommandList, hostItemIndex, args);
    if (launchEventType == LaunchEventType.OnNewMessageCompose) {
        processAutoRunWaitingQueueWithRetry(hostItemIndex, RETRY_COUNT, RETRY_DELAY);
    } else {
        processAutoRunWaitingQueue(hostItemIndex);
    }
};

/*
    @processAutoRunWaitingQueueWithRetry
    Pinned taskpane and autorun uses same OSF.OsfManifestManager.cacheManifest,
    so we will wait pinned addin rendering to finish before we overwrite cache for autorun
*/
function processAutoRunWaitingQueueWithRetry(
    hostItemIndex: string,
    retryCount: number,
    retryDelay: number
) {
    if (retryCount < 1) {
        return;
    }
    if (hasPinnedTaskpaneAndNotRendered(hostItemIndex)) {
        sleep(retryDelay).then(() => {
            processAutoRunWaitingQueueWithRetry(hostItemIndex, retryCount - 1, retryDelay);
        });
    } else {
        processAutoRunWaitingQueue(hostItemIndex);
    }
}

/*
    @hasPinnedTaskpaneAndNotRendered
    Checks if pinned taskpane is there and it is not rendered yet or still rendering
*/
function hasPinnedTaskpaneAndNotRendered(hostItemIndex: string): boolean {
    const persistentTaskpaneControlId: string = getTaskPaneRunningInstance(
        TaskPaneType.Persistent,
        hostItemIndex
    )?.controlId;

    if (!persistentTaskpaneControlId) {
        return false;
    }

    return document.getElementById(persistentTaskpaneControlId) ? false : true;
}

export default launchAutoRunAddins;
