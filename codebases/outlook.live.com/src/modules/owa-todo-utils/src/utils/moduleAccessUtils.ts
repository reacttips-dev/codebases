import ClientTypeOptInState from 'owa-service/lib/contract/ClientTypeOptInState';
import type {
    ReadOnlyPolicySettingsType,
    ReadOnlyUserOptionsType,
} from 'owa-service/lib/ReadOnlyTypes';
import { getUserConfiguration } from 'owa-session-store';

export enum ModuleForTasks {
    /** User cannot access any tasks functionality */
    None,
    /** User can access legacy Tasks module */
    LegacyTasks,
    /** User can access modern To Do module */
    ToDo,
}

/**
 * Check which module (if any) that the user can access for tasks functionality,
 * based on user type and To Do cutover status
 */
export function getModuleForTasks(): ModuleForTasks {
    const isUserCutover = isToDoModuleEnabled();
    if (isUserTypeSupportedForToDo() && isUserCutover) {
        return ModuleForTasks.ToDo;
    }
    if (isUserTypeSupportedForTasks() && !isUserCutover) {
        return ModuleForTasks.LegacyTasks;
    }
    return ModuleForTasks.None;
}

/**
 * Check if user can access modern To Do module
 *
 * NOTE: A return value of `false` should NOT be treated as meaning user can access legacy Tasks module
 *       This is only safe to do IF `getModuleForTasks` is previously called and does not return `ModuleForTasks.None`
 */
export function canShowToDoModule(): boolean {
    return isUserTypeSupportedForToDo() && isToDoModuleEnabled();
}

/**
 * Check if user can access modern To Do integration features
 *
 * Note that this is identical to `canShowToDoModule` except user opt-in setting is ignored
 */
export function canUseToDoFeatures(): boolean {
    return isUserTypeSupportedForToDo() && isToDoModuleEnabled(true);
}

/**
 * Check if user type is supported by modern To Do module
 */
function isUserTypeSupportedForToDo(): boolean {
    const userConfiguration = getUserConfiguration();
    const isExplicitLogon = userConfiguration.SessionSettings?.IsExplicitLogon;
    const isShadowMailbox = userConfiguration.SessionSettings?.IsShadowMailbox;
    return !isExplicitLogon && !isShadowMailbox;
}

/**
 * Check if user type is supported by legacy Tasks module
 */
function isUserTypeSupportedForTasks(): boolean {
    const userConfiguration = getUserConfiguration();
    return !userConfiguration.SessionSettings?.IsShadowMailbox;
}

/**
 * Check if modern To Do module is enabled for the user
 */
function isToDoModuleEnabled(ignoreUserOptin?: boolean): boolean {
    const userConfiguration = getUserConfiguration();
    const userOptions = userConfiguration.UserOptions;
    const policySettings = userConfiguration.PolicySettings;

    return !!(
        userOptions?.ReactOptinSettings &&
        // To Do cutover takes precedence
        (userOptions.ReactOptinSettings.TasksGraduatedFromBeta ||
            // otherwise, check that To Do module is enabled AND both tenant and user have opted in
            (userOptions.ReactOptinSettings.TasksEnabled &&
                (ignoreUserOptin || isUserOptedIntoTodo(userOptions)) &&
                isTodoAllowedByOutlookBetaPolicySetting(policySettings))) &&
        userOptions.ReactOptinSettings.TasksRedirectUrl !== null
    );
}

/**
 * Determine if user has opted into modern To Do module
 *
 * Note that `TasksGraduatedFromBeta` (To Do cutover) will take precedence over user opt-in setting
 */
function isUserOptedIntoTodo(userOptions: ReadOnlyUserOptionsType): boolean {
    if (userOptions?.ReactOptinSettings?.TasksShouldUseSharedToggle) {
        // If we are using shared toggle, check ClientTypeOptInState.
        // With React Mail, Cal, People starting to cutover, but not Tasks,
        // we cannot assume that the user wants React Tasks as well.
        return userOptions.ClientTypeOptInState !== ClientTypeOptInState.Jsmvvm;
    } else {
        // We are not using a shared toggle (e.g. Consumer), so check TasksClientTypeOptInState.
        // In this case, users are auto-opted in (None is treated as opted in).
        return userOptions.TasksClientTypeOptInState !== ClientTypeOptInState.Jsmvvm;
    }
}

/**
 * Determine if modern To Do module is allowed by tenant policy
 *
 * The scenario here is that Mail/Calendar has cutover, so we are in React.
 *
 * But the admin has turned off `OutlookBetaToggleEnabled` OWA Mailbox Policy to prevent Tasks from
 * redirecting until To Do is Tier-D compliant.
 *
 * Note that `TasksGraduatedFromBeta` (To Do cutover) will take precedence over tenant policy
 */
function isTodoAllowedByOutlookBetaPolicySetting(
    policySettings?: ReadOnlyPolicySettingsType
): boolean {
    if (policySettings && policySettings.OutlookBetaToggleEnabled === false) {
        return false;
    }

    return true;
}
