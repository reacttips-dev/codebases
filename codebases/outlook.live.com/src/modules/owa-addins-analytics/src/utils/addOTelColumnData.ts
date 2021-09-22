import type { IExtendedTelemetryItem } from '@microsoft/1ds-core-js';
import { CommonAdapter, getAdapter } from 'owa-addins-adapters';
import { getUserTypeString } from 'owa-addins-wrapper-utils';
import { isPersistedAddin } from 'owa-addins-persistent';
import {
    isItemSendEvent,
    getExtensionForAddinId,
    IAddinCommand,
    AddinCommand,
    ContextualAddinCommand,
    getEntryPointForControl,
    ExtensionEntryPointEnum,
    isAutoRunAddinCommand,
    AutoRunAddinCommand,
    IAutoRunAddinCommand,
} from 'owa-addins-store';
import {
    ExtensibilityModeEnum,
    AddinTeachingUICalloutGoalEnum,
    AddinTeachingUICalloutActionEnum,
    CustomizeActionStatusEnum,
    CustomizeActionPlacementEnum,
} from 'owa-addins-types';
import type Extension from 'owa-service/lib/contract/Extension';
import {
    AppState,
    AudienceGroup,
    LaunchReason,
    TenantGroup,
    CommandPlacement,
    ActionType,
    AppInstallOrigin,
    AppTeachingUICalloutAction,
    AppTeachingUICalloutGoal,
    CustomizeActionStatusGoal,
    CustomizeActionPlacementGoal,
    OTelSchema,
} from '../enums/otelSchema';
import { getLogicalRing } from 'owa-config';
import getEnabledAddinsFeatureFlags from './getEnabledAddinsFeatureFlags';
import { assertNever } from 'owa-assert';
import { getCompliantAppId } from './getCompliantAppId';

export function addOTelColumnData(
    event: IExtendedTelemetryItem,
    addinCommand: IAddinCommand,
    hostItemIndex: string,
    controlId: string
) {
    event.data[OTelSchema.SdxAppState] = getAppState(hostItemIndex);
    event.data[OTelSchema.SdxLaunchReason] = getLaunchReason(
        addinCommand as AddinCommand,
        controlId
    );
    event.data[OTelSchema.SdxCommandPlacement] = getCommandPlacement(
        addinCommand as AddinCommand,
        hostItemIndex,
        controlId
    );
    event.data[OTelSchema.SdxActionType] = getActionType(controlId);
    event.data[OTelSchema.SdxAppInstallOrigin] = getAppInstallOrigin(
        (addinCommand as AddinCommand).extension
    );
}

export function addOTelColumnDataEventLaunchEvent(
    event: IExtendedTelemetryItem,
    autoRunAddinCommand: IAutoRunAddinCommand,
    hostItemIndex: string,
    controlId: string
) {
    event.data[OTelSchema.SdxAppState] = getAppState(hostItemIndex);
    event.data[OTelSchema.SdxAppInstallOrigin] = getAppInstallOrigin(
        (autoRunAddinCommand as AutoRunAddinCommand).extension
    );
    event.data[OTelSchema.SdxLaunchEventType] = autoRunAddinCommand.getLaunchEventType();
    event.data[OTelSchema.InstanceId] = controlId;
}

export function addOTelColumnDataEventAppInstall(event: IExtendedTelemetryItem, addinId: string) {
    const extension = getExtensionForAddinId(addinId);
    if (extension) {
        event.data[OTelSchema.SdxAppInstallOrigin] = getAppInstallOrigin(extension);
        event.data[OTelSchema.SdxId] = getCompliantAppId(extension);
    }
    event.data[OTelSchema.SdxFeatureFlags] = getAddinsFeatureFlagsAsString();
}

export function addOTelColumnDataEventAppPinning(
    event: IExtendedTelemetryItem,
    addinId: string,
    isAddinPinned: boolean,
    extMode: ExtensibilityModeEnum
) {
    event.data[OTelSchema.SdxAppState] = getAppStateFromExtMode(extMode);

    const extension = getExtensionForAddinId(addinId);
    if (extension) {
        event.data[OTelSchema.SdxAppInstallOrigin] = getAppInstallOrigin(extension);
        event.data[OTelSchema.SdxCommandPlacement] = isAddinPinned
            ? CommandPlacement.Ribbon
            : CommandPlacement.Overflow;
        event.data[OTelSchema.SdxId] = getCompliantAppId(extension);
    }
    event.data[OTelSchema.SdxFeatureFlags] = getAddinsFeatureFlagsAsString();
}

export function addOTelColumnDataEventAppTeachingUICallout(
    event: IExtendedTelemetryItem,
    addinId: string,
    goal: AddinTeachingUICalloutGoalEnum,
    action: AddinTeachingUICalloutActionEnum,
    extMode: ExtensibilityModeEnum
) {
    event.data[OTelSchema.SdxAppState] = getAppStateFromExtMode(extMode);

    const extension = getExtensionForAddinId(addinId);
    if (extension) {
        event.data[OTelSchema.SdxAppInstallOrigin] = getAppInstallOrigin(extension);
        event.data[OTelSchema.SdxId] = getCompliantAppId(extension);
    }
    event.data[OTelSchema.AppTeachingUICalloutAction] = getAppTeachingUICalloutAction(action);
    event.data[OTelSchema.AppTeachingUICalloutGoal] = getAppTeachingUICalloutGoal(goal);

    event.data[OTelSchema.SdxFeatureFlags] = getAddinsFeatureFlagsAsString();
}

export function addOTelColumnDataEventAppHighlighted(
    event: IExtendedTelemetryItem,
    addinId: string,
    extMode: ExtensibilityModeEnum
) {
    event.data[OTelSchema.SdxAppState] = getAppStateFromExtMode(extMode);

    const extension = getExtensionForAddinId(addinId);
    if (extension) {
        event.data[OTelSchema.SdxAppInstallOrigin] = getAppInstallOrigin(extension);
        event.data[OTelSchema.SdxId] = getCompliantAppId(extension);
    }
    event.data[OTelSchema.SdxFeatureFlags] = getAddinsFeatureFlagsAsString();
}

export function addOTelColumnDataEventCustomizeActionButtonAction(
    event: IExtendedTelemetryItem,
    customizeActionStatus: CustomizeActionStatusEnum,
    customizeActionPlacement: CustomizeActionPlacementEnum
) {
    event.data[OTelSchema.CustomizeActionPlacementGoal] = getCustomizeActionPlacementGoal(
        customizeActionPlacement
    );
    event.data[OTelSchema.CustomizeActionStatusGoal] = getCustomizeActionStatusGoal(
        customizeActionStatus
    );
    event.data[OTelSchema.SdxFeatureFlags] = getAddinsFeatureFlagsAsString();
}

export function getAudienceGroup(): AudienceGroup {
    switch (getLogicalRing()) {
        case 'Dogfood':
            return AudienceGroup.Dogfood;
        case 'Microsoft':
            return AudienceGroup.MSIT;
        default:
            return AudienceGroup.Production;
    }
}
export function getTenantGroup(): TenantGroup {
    const userType = getUserTypeString();
    return userType === 'outlookCom' || userType === 'gmail'
        ? TenantGroup.Consumer
        : TenantGroup.Commercial;
}

function getAppStateFromExtMode(extMode: ExtensibilityModeEnum): AppState {
    switch (extMode) {
        case ExtensibilityModeEnum.MessageRead:
            return AppState.MessageRead;
        case ExtensibilityModeEnum.MessageCompose:
            return AppState.MessageCompose;
        case ExtensibilityModeEnum.AppointmentAttendee:
            return AppState.AppointmentAttendee;
        case ExtensibilityModeEnum.AppointmentOrganizer:
            return AppState.AppointmentOrganizer;
        default:
            return AppState.Unknown;
    }
}
function getAppState(hostItemIndex: string): AppState {
    const adapter = getAdapter(hostItemIndex) as CommonAdapter;
    const mode = adapter?.mode;
    return getAppStateFromExtMode(mode);
}
function getLaunchReason(addinCommand: AddinCommand, controlId: string): LaunchReason {
    // if an add-in is itemsend, pinned or autorun, we assume it auto-opened
    if (
        isItemSendEvent(addinCommand.extension.Id, controlId) ||
        isPersistedAddin(addinCommand) ||
        isAutoRunAddinCommand(addinCommand)
    ) {
        return LaunchReason.Auto;
    }

    return LaunchReason.Manual;
}
function getCommandPlacement(
    addinCommand: AddinCommand,
    hostItemIndex: string,
    controlId: string
): CommandPlacement {
    if (isItemSendEvent(addinCommand.extension.Id, controlId)) {
        return CommandPlacement.OnSend;
    }

    if (isPersistedAddin(addinCommand)) {
        return CommandPlacement.Persistent;
    }

    if (isAutoRunAddinCommand(addinCommand)) {
        return CommandPlacement.LaunchEvent;
    }

    const contextual = (addinCommand as IAddinCommand) as ContextualAddinCommand;
    if (contextual.detectedEntity) {
        return CommandPlacement.Contextual;
    }
    const adapter = getAdapter(hostItemIndex) as CommonAdapter;
    const placement = adapter?.isAddinPinned?.(addinCommand.extension.Id)
        ? CommandPlacement.Ribbon
        : CommandPlacement.Overflow;
    return placement;
}
function getActionType(controlId: string): ActionType {
    const entrypoint = getEntryPointForControl(controlId);
    switch (entrypoint) {
        case ExtensionEntryPointEnum.TaskPane:
            return ActionType.ShowTaskpane;
        case ExtensionEntryPointEnum.UILess:
            return ActionType.ExecuteFunction;
        case ExtensionEntryPointEnum.Contextual:
            return ActionType.Contextual;
        case ExtensionEntryPointEnum.Dialog:
            return ActionType.Dialog;
        case ExtensionEntryPointEnum.Unknown:
            return ActionType.Unknown;
    }
}

export function getUserIdentitySpace(): string {
    const userType = getUserTypeString();
    switch (userType) {
        case 'outlookCom':
            return 'MsaPuid';
        case 'office365':
            return 'OrgIdPuid';
        default:
            return 'Unknown';
    }
}

function getAppInstallOrigin(extension: Extension): AppInstallOrigin {
    if (extension.OriginString === 'Organization') {
        return AppInstallOrigin.Organization;
    }
    if (extension.OriginString === 'User') {
        return AppInstallOrigin.User;
    }
    if (extension.OriginString === 'Default') {
        return AppInstallOrigin.Default;
    } else {
        return AppInstallOrigin.None;
    }
}

function getAppTeachingUICalloutAction(
    action: AddinTeachingUICalloutActionEnum
): AppTeachingUICalloutAction {
    switch (action) {
        case AddinTeachingUICalloutActionEnum.Show:
            return AppTeachingUICalloutAction.Show;
        case AddinTeachingUICalloutActionEnum.ClickOnClose:
            return AppTeachingUICalloutAction.ClickOnClose;
        case AddinTeachingUICalloutActionEnum.ClickOnGotIt:
            return AppTeachingUICalloutAction.ClickOnGotIt;
        case AddinTeachingUICalloutActionEnum.ClickOnCustomize:
            return AppTeachingUICalloutAction.ClickOnCustomize;
        case AddinTeachingUICalloutActionEnum.MissNoAnchor:
            return AppTeachingUICalloutAction.MissNoAnchor;
        case AddinTeachingUICalloutActionEnum.MissNotSelected:
            return AppTeachingUICalloutAction.MissNotSelected;
        default:
            return assertNever(action);
    }
}

function getAppTeachingUICalloutGoal(
    goal: AddinTeachingUICalloutGoalEnum
): AppTeachingUICalloutGoal {
    switch (goal) {
        case AddinTeachingUICalloutGoalEnum.NewAdminDeployment:
            return AppTeachingUICalloutGoal.NewAdminDeployment;
        case AddinTeachingUICalloutGoalEnum.Awareness:
            return AppTeachingUICalloutGoal.Awareness;
        default:
            return assertNever(goal);
    }
}

function getAddinsFeatureFlagsAsString(): string {
    return getEnabledAddinsFeatureFlags().join(',');
}

function getCustomizeActionStatusGoal(
    customizeActionStatus: CustomizeActionStatusEnum
): CustomizeActionStatusGoal {
    switch (customizeActionStatus) {
        case CustomizeActionStatusEnum.Highlighted:
            return CustomizeActionStatusGoal.Highlighted;
        case CustomizeActionStatusEnum.Clicked:
            return CustomizeActionStatusGoal.Clicked;
        case CustomizeActionStatusEnum.HighlightedAndClicked:
            return CustomizeActionStatusGoal.HighlightedAndClicked;
        default:
            return assertNever(customizeActionStatus);
    }
}

function getCustomizeActionPlacementGoal(
    customizeActionPlacement: CustomizeActionPlacementEnum
): CustomizeActionPlacementGoal {
    switch (customizeActionPlacement) {
        case CustomizeActionPlacementEnum.OverFlowMenu:
            return CustomizeActionPlacementGoal.OverFlowMenu;
        case CustomizeActionPlacementEnum.UICallout:
            return CustomizeActionPlacementGoal.UICallout;
        default:
            return assertNever(customizeActionPlacement);
    }
}
