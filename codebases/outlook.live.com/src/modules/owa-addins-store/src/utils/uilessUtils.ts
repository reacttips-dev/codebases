import getExtensibilityState from '../store/getExtensibilityState';
import type IAddinCommand from '../store/schema/interfaces/IAddinCommand';
import type { ObservableMap } from 'mobx';
import type IExtendedAddinCommand from '../store/schema/interfaces/IExtendedAddinCommand';
import type IAddinCommandTelemetry from '../store/schema/interfaces/IAddinCommandTelemetry';
import AutoRunAddinCommand from '../store/schema/AutoRunAddinCommand';

export function isAnyUilessAddinRunning(hostItemIndex: string): boolean {
    return getExtensibilityState().runningUILessExtendedAddinCommands.has(hostItemIndex);
}

export function isAnyNonAutoRunUilessAddinRunning(hostItemIndex: string): boolean {
    const runningUILessExtendedAddinCommand = getExtensibilityState().runningUILessExtendedAddinCommands?.get(
        hostItemIndex
    );

    if (runningUILessExtendedAddinCommand) {
        for (let extendedAddinCommand of runningUILessExtendedAddinCommand.values()) {
            const addinCommand = extendedAddinCommand.addinCommand;
            if (!(addinCommand instanceof AutoRunAddinCommand)) {
                // return true when you find any instance of addin which is only Uiless and not autorun
                return true;
            }
        }
    }
    return false;
}

export function getUilessAddinCommand(controlId: string): IAddinCommand {
    const addins = getRunningUilessAddins();
    if (!addins) {
        return null;
    }

    for (const hostItem of addins.values()) {
        for (const uilessControlId of hostItem.keys()) {
            if (uilessControlId === controlId) {
                return hostItem.get(uilessControlId).addinCommand;
            }
        }
    }
    return null;
}

export function getUilessAddinCommandTelemetry(
    hostItemIndex: string,
    controlId: string
): IAddinCommandTelemetry {
    if (
        getRunningUilessAddins().has(hostItemIndex) &&
        getRunningUilessAddins().get(hostItemIndex).has(controlId)
    ) {
        return getRunningUilessAddins().get(hostItemIndex).get(controlId).addinCommandTelemetry;
    }
    return null;
}

export function getUilessHostItemIndex(controlId: string): string {
    const addins = getRunningUilessAddins();
    if (!addins) {
        return null;
    }

    for (const hostItemIndex of addins.keys()) {
        const hostItem = addins.get(hostItemIndex);
        for (const uilessControlId of hostItem.keys()) {
            if (uilessControlId === controlId) {
                return hostItemIndex;
            }
        }
    }
    return null;
}

export function isUilessAddinRunning(controlId: string): boolean {
    return getUilessAddinCommand(controlId) !== null;
}

function getRunningUilessAddins(): ObservableMap<
    string,
    /*key: hostItemIndex*/ ObservableMap<string, /*key: controlId*/ IExtendedAddinCommand>
> {
    return getExtensibilityState().runningUILessExtendedAddinCommands;
}
