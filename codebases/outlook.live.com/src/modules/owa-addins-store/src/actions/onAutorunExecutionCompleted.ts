import { action, orchestrator } from 'satcheljs';
import {
    processAutoRunWaitingQueue,
    terminateUiLessExtendedAddinCommand,
    IExtendedAddinCommand,
    getExtensibilityState,
    getScenarioFromHostItemIndex,
} from '../index';
import { logUsage } from 'owa-analytics';
import { getApp } from 'owa-config';
import { getCompliantAppIdHandler as getCompliantAppId } from 'owa-addins-osfruntime';

let onAutorunExecutionCompleted = action(
    'onAutorunExecutionCompleted',
    (
        extendedAddinCommand: IExtendedAddinCommand,
        controlId: string,
        hostItemIndex: string,
        status: number,
        completedContext?: OSF.EventCompletedContext
    ) => ({
        extendedAddinCommand: extendedAddinCommand,
        controlId: controlId,
        hostItemIndex: hostItemIndex,
        status: status,
        completedContext: completedContext,
    })
);

orchestrator(onAutorunExecutionCompleted, actionMessage => {
    actionMessage.extendedAddinCommand.addinCommandTelemetry.setExecutionEndTime();
    logUsage('AddinExecutionCompleted', {
        id: getCompliantAppId(actionMessage.extendedAddinCommand.addinCommand.extension),
        controlId: actionMessage.controlId,
        owa_1: getApp(),
        owa_2: getScenarioFromHostItemIndex(actionMessage.hostItemIndex),
        executionEndTime: actionMessage.extendedAddinCommand.addinCommandTelemetry.getExecutionEndTime(),
    });

    terminateUiLessExtendedAddinCommand(
        actionMessage.controlId,
        actionMessage.hostItemIndex,
        actionMessage.status,
        actionMessage.completedContext
    );

    getExtensibilityState().activeAutorunUilessFrames.delete(actionMessage.controlId);
    processAutoRunWaitingQueue(actionMessage.hostItemIndex);
});

export default onAutorunExecutionCompleted;
