import setAutoRunAddinCommandWaitingQueue from '../actions/setAutoRunAddinCommandWaitingQueue';
import getExtensibilityState from '../store/getExtensibilityState';
import type IAutoRunAddinCommand from '../store/schema/interfaces/IAutoRunAddinCommand';
import destroyAutoRunAddinCommandFromWaitingQueue from '../actions/destroyAutoRunAddinCommandFromWaitingQueue';
import type IAddinCommand from '../store/schema/interfaces/IAddinCommand';
import setUilessExtendedAddinCommand from '../actions/setUilessExtendedAddinCommand';
import AutoRunAddinCommand from '../store/schema/AutoRunAddinCommand';
import type IExtendedAddinCommand from '../store/schema/interfaces/IExtendedAddinCommand';
import type IAutoRunAddinCommandTelemetry from '../store/schema/interfaces/IAutoRunAddinCommandTelemetry';
import type { ObservableMap } from 'mobx';
import { getNextControlId, InvokeAppAddinCommandStatusCode } from '../index';
import onAutorunExecutionCompleted from '../actions/onAutorunExecutionCompleted';

// PER_HOSTITEMINDEX_MAX_LIMIT: Number of autorun add-ins allowed to execute simultaneously per hostItemIndex
export const PER_HOSTITEMINDEX_MAX_LIMIT = 5;
// GLOBAL_MAX_LIMIT: Number of autorun add-ins allowed to execute simultaneously across all hostItemIndex
export const GLOBAL_MAX_LIMIT = 20;

/*
    @addAutoRunAddinsToWaitingQueue
    Accepts a list of AutoRunAddinCommands and calls the setAutoRunAddinCommandWaitingQueue mutator for each of the commands
*/
export const addAutoRunAddinsToWaitingQueue = (
    extendedAutoRunAddinCommands: IExtendedAddinCommand[],
    hostItemIndex: string,
    args?: any
) => {
    extendedAutoRunAddinCommands.forEach((extendedAddinCommand: IExtendedAddinCommand) => {
        if (args) {
            extendedAddinCommand.launchEventArgs = args;
        }
        extendedAddinCommand.controlId = getAutoRunControlId(
            hostItemIndex,
            extendedAddinCommand.addinCommand.get_Id()
        );

        (extendedAddinCommand.addinCommandTelemetry as IAutoRunAddinCommandTelemetry).setQueuePushTime();
        setAutoRunAddinCommandWaitingQueue(extendedAddinCommand, hostItemIndex);
    });
};

/*
    @processAutoRunWaitingQueue
    Reads the AutoRunAddinCommandWaitingQueue and adds the correct autorun addinCommand to the runningUILessExtendedAddinCommands
*/
export const processAutoRunWaitingQueue = (hostItemIndex: string) => {
    const autoRunExtendedAddinCommands = getAutoRunAddinsFromWaitingQueue(hostItemIndex);

    autoRunExtendedAddinCommands.forEach((extendedAddinCommand: IExtendedAddinCommand) => {
        if (canExecuteAddin(hostItemIndex)) {
            (extendedAddinCommand.addinCommandTelemetry as IAutoRunAddinCommandTelemetry).setQueuePopTime();
            executeAutoRunAddin(extendedAddinCommand, hostItemIndex);
        }
    });
};

/*
    @executeAutoRunAddin
    Executes the autorun addinCommand command and checks if the addinCommand executed successfully
*/
export const executeAutoRunAddin = (
    extendedAddinCommand: IExtendedAddinCommand,
    hostItemIndex: string
) => {
    const autorunAddinCommand = extendedAddinCommand.addinCommand as IAutoRunAddinCommand;
    const controlId = extendedAddinCommand.controlId;
    if (isAutoRunAddinExecutingForAddinId(autorunAddinCommand.get_Id(), hostItemIndex)) {
        getExtensibilityState()
            .activeAutorunUilessFrames.get(controlId)
            .invokeAppCommand(
                autorunAddinCommand.getControl(),
                extendedAddinCommand.launchEventArgs
            );
    } else {
        setUilessExtendedAddinCommand(controlId, extendedAddinCommand, hostItemIndex).then(
            result => {
                if (result.status == InvokeAppAddinCommandStatusCode.TimedOut) {
                    onAutorunExecutionCompleted(
                        extendedAddinCommand,
                        controlId,
                        hostItemIndex,
                        InvokeAppAddinCommandStatusCode.TimedOut
                    );
                }
            }
        );
    }
    destroyAutoRunAddinCommandFromWaitingQueue(hostItemIndex, autorunAddinCommand);
};

/*
    @getAutoRunAddinsFromWaitingQueue
    Returns the IAutoRunAddinCommand list from the extendedAddinWaitingQueue for the given hostItemIndex
*/
export const getAutoRunAddinsFromWaitingQueue = (
    hostItemIndex: string
): IExtendedAddinCommand[] => {
    const autoRunAddinWaitingQueue = getExtensibilityState().autoRunAddinCommandWaitingQueue.get(
        hostItemIndex
    );
    return autoRunAddinWaitingQueue ? autoRunAddinWaitingQueue : [];
};

/*
    @canExecuteAddin
    Checks if the addin can be executed for the current hostItemIndex
*/
export const canExecuteAddin = (hostItemIndex: string): boolean =>
    !(!!isMaxAddinLimitExceeded(hostItemIndex) || !!isGlobalMaxAddinLimitExceeded());

/*
    @isAutoRunAddinExecutingForAddinId
    Checks if the addin is executing for the given hostItemIndex
*/
export const isAutoRunAddinExecutingForAddinId = (
    addinId: string,
    hostItemIndex: string
): boolean => {
    const runningUILessExtendedAddinCommands = getExtensibilityState()
        .runningUILessExtendedAddinCommands;
    let isAddinExecuting: boolean = false;

    if (!runningUILessExtendedAddinCommands.has(hostItemIndex)) {
        return false;
    }

    runningUILessExtendedAddinCommands
        .get(hostItemIndex)
        .forEach((extendedAddinCommand: IExtendedAddinCommand) => {
            const addinCommand = extendedAddinCommand.addinCommand;
            if (isAutoRunAddinCommand(addinCommand) && addinCommand.get_Id() === addinId) {
                isAddinExecuting = true;
            }
        });
    return isAddinExecuting;
};

/*
    @isGlobalMaxAddinLimitExceeded
    Checks if the total number of executing autorun addins have exceeded GLOBAL_MAX_LIMIT
*/
export const isGlobalMaxAddinLimitExceeded = (): boolean => {
    const runningUILessExtendedAddinCommands = getExtensibilityState()
        .runningUILessExtendedAddinCommands;
    let globalAddinCount: number = 0;

    runningUILessExtendedAddinCommands.forEach(
        (uiLessAddins: ObservableMap<string, IExtendedAddinCommand>) => {
            uiLessAddins.forEach((extendedAddinCommand: IExtendedAddinCommand) => {
                const addinCommand = extendedAddinCommand.addinCommand;
                if (isAutoRunAddinCommand(addinCommand)) {
                    globalAddinCount += 1;
                }
            });
        }
    );

    return globalAddinCount >= GLOBAL_MAX_LIMIT;
};

/*
    @isMaxAddinLimitExceeded
    Checks if the total number of executing autorun addins for given hostItemIndex have exceeded PER_HOSTITEMINDEX_MAX_LIMIT
*/
export const isMaxAddinLimitExceeded = (hostItemIndex: string): boolean => {
    const runningUILessExtendedAddinCommands = getExtensibilityState()
        .runningUILessExtendedAddinCommands;
    let addinCount: number = 0;

    if (runningUILessExtendedAddinCommands.has(hostItemIndex)) {
        runningUILessExtendedAddinCommands
            .get(hostItemIndex)
            .forEach((extendedAddinCommand: IExtendedAddinCommand) => {
                const addinCommand = extendedAddinCommand.addinCommand;
                if (isAutoRunAddinCommand(addinCommand)) {
                    addinCount += 1;
                }
            });
    }
    return addinCount >= PER_HOSTITEMINDEX_MAX_LIMIT;
};

/*
    @isAutoRunAddinCommand
    Checks if the AddinCommand is an instance of AutoRunAddinCommand
*/
export const isAutoRunAddinCommand = (addinCommand: IAddinCommand): boolean => {
    return addinCommand instanceof AutoRunAddinCommand;
};

/*
    @getAutoRunControlId
    Returns controlId for AddinCommand either from previous AddinCommands with same addinId or getNextControlId()
*/
export const getAutoRunControlId = (hostItemIndex: string, addinId: string): string => {
    let finalControlId: string = null;
    const runningUILessExtendedAddinCommands = getExtensibilityState()
        .runningUILessExtendedAddinCommands;
    if (runningUILessExtendedAddinCommands.has(hostItemIndex)) {
        runningUILessExtendedAddinCommands
            .get(hostItemIndex)
            .forEach((extendedAddinCommand: IExtendedAddinCommand) => {
                finalControlId = checkForControlId(extendedAddinCommand, addinId)
                    ? extendedAddinCommand.controlId
                    : finalControlId;
            });
    }
    if (finalControlId) {
        return finalControlId;
    }

    getAutoRunAddinsFromWaitingQueue(hostItemIndex).forEach(
        (extendedAddinCommand: IExtendedAddinCommand) => {
            finalControlId = checkForControlId(extendedAddinCommand, addinId)
                ? extendedAddinCommand.controlId
                : finalControlId;
        }
    );
    return finalControlId ? finalControlId : getNextControlId();
};

const checkForControlId = (extendedAddinCommand: IExtendedAddinCommand, addinId: string): boolean =>
    extendedAddinCommand.controlId && extendedAddinCommand.addinCommand.get_Id() === addinId;
