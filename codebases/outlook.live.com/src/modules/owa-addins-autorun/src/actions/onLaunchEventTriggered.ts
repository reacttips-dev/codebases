import { action, orchestrator } from 'satcheljs';
import type LaunchEventType from 'owa-service/lib/contract/LaunchEventType';
import startAutoRunAddin from '../startAutoRunAddin';

let onLaunchEventTriggered = action(
    'onLaunchEventTriggered',
    (hostItemIndex: string, launchEventType: LaunchEventType, args?: any) => ({
        hostItemIndex: hostItemIndex,
        launchEventType: launchEventType,
        args: args,
    })
);

orchestrator(onLaunchEventTriggered, actionMessage => {
    startAutoRunAddin(
        actionMessage.hostItemIndex,
        actionMessage.launchEventType,
        actionMessage.args
    );
});

export default onLaunchEventTriggered;
