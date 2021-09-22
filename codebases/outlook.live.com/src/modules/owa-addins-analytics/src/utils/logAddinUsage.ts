import getDatapointOptions from '../getDatapointOptions';
import { getAdapter } from 'owa-addins-adapters';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import { getCurrentCulture } from 'owa-localize';
import {
    IAddinCommand,
    ExtensionEntryPointEnum,
    getScenarioFromHostItemIndex,
    IAddinCommandTelemetry,
    isAutoRunAddinCommand,
    IAutoRunAddinCommandTelemetry,
    IAutoRunAddinCommand,
} from 'owa-addins-store';
import { getApp } from 'owa-config';
import type LaunchEventType from 'owa-service/lib/contract/LaunchEventType';
import { getCompliantAppId } from './getCompliantAppId';

export const logAddinUsage = (
    success: boolean,
    addinCommand: IAddinCommand,
    hostItemIndex: string,
    entrypoint: ExtensionEntryPointEnum,
    addinCommandTelemetry: IAddinCommandTelemetry,
    controlId: string,
    errorCode?: number
) => {
    let isSharedItem = getIsSharedItem(hostItemIndex);
    let isAutoRun = isAutoRunAddinCommand(addinCommand) ? true : false;

    logAddinLaunched(
        success,
        addinCommand,
        hostItemIndex,
        entrypoint,
        errorCode,
        isSharedItem,
        isAutoRun,
        addinCommandTelemetry,
        controlId
    );

    // Only log the delegate add-in launched datapoint for delegate scenarios
    if (success && isSharedItem) {
        logDelegateAddinLaunched(addinCommand, hostItemIndex);
    }

    // Only log the autorun add-in launched datapoint for autorun scenarios
    if (success && isAutoRun) {
        let launchEventType = getLaunchEventType(addinCommand);
        logAutoRunAddinLaunch(
            addinCommand,
            hostItemIndex,
            launchEventType,
            addinCommandTelemetry,
            controlId
        );
    }
};

function getLaunchEventType(addinCommand: IAddinCommand) {
    let launchEventType = (addinCommand as IAutoRunAddinCommand).getLaunchEventType();
    return launchEventType;
}

function getIsSharedItem(hostItemIndex: string): boolean {
    const adapter = getAdapter(hostItemIndex);
    if (adapter.isSharedItem) {
        return adapter.isSharedItem();
    }

    return false;
}

function logAddinLaunched(
    success: boolean,
    addinCommand: IAddinCommand,
    hostItemIndex: string,
    entrypoint: ExtensionEntryPointEnum,
    errorCode: number,
    isSharedItem: boolean,
    isAutoRun: boolean,
    addinCommandTelemetry: IAddinCommandTelemetry,
    controlId: string
) {
    let executionInitTime;
    let executionStartTime;
    if (addinCommandTelemetry) {
        executionInitTime = addinCommandTelemetry.getExecutionInitTime();
        executionStartTime = addinCommandTelemetry.getExecutionStartTime();
    }

    const datapoint = new PerformanceDatapoint('ExtAddinLaunched', getDatapointOptions());
    datapoint.addCustomData({
        id: getCompliantAppId(addinCommand.extension),
        name: addinCommand.extension.DisplayName,
        owa_1: getApp(),
        owa_2: getScenarioFromHostItemIndex(hostItemIndex),
        owa_3: entrypoint,
        lang: getCurrentCulture(),
        owa_4: addinCommand.extension.Type,
        errorCode,
        delegate: isSharedItem,
        isAutoRun: isAutoRun,
        executionInitTime: executionInitTime,
        executionStartTime: executionStartTime,
        controlId: controlId,
    });

    if (success) {
        datapoint.end();
    } else {
        datapoint.endWithError(
            DatapointStatus.Timeout,
            new Error('Add-in failed to load with code: ' + errorCode)
        );
    }
}

function logDelegateAddinLaunched(addinCommand: IAddinCommand, hostItemIndex: string) {
    const datapoint = new PerformanceDatapoint('ExtDelegateAddinLaunched', getDatapointOptions());
    datapoint.addCustomData({
        id: getCompliantAppId(addinCommand.extension),
        name: addinCommand.extension.DisplayName,
        owa_1: getApp(),
        owa_2: getScenarioFromHostItemIndex(hostItemIndex),
    });

    datapoint.end();
}

function logAutoRunAddinLaunch(
    addinCommand: IAddinCommand,
    hostItemIndex: string,
    launchEventType: LaunchEventType,
    addinCommandTelemetry: IAddinCommandTelemetry,
    controlId: string
) {
    let autoRunQueuePushTimeTime;
    let autorunQueuePopTime;

    if (addinCommandTelemetry) {
        autoRunQueuePushTimeTime = (addinCommandTelemetry as IAutoRunAddinCommandTelemetry).getQueuePushTime();
        autorunQueuePopTime = (addinCommandTelemetry as IAutoRunAddinCommandTelemetry).getQueuePopTime();
    }

    const datapoint = new PerformanceDatapoint('ExtAutoRunAddinLaunched', getDatapointOptions());
    datapoint.addCustomData({
        id: getCompliantAppId(addinCommand.extension),
        name: addinCommand.extension.DisplayName,
        launchEventType: launchEventType,
        autoRunQueuePushTimeTime: autoRunQueuePushTimeTime,
        autorunQueuePopTime: autorunQueuePopTime,
        controlId: controlId,
    });

    datapoint.end();
}
