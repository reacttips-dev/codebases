import { getErrorNotification, getTrialNotification } from './AddinErrorNotificationFactory';
import * as ContextActivationManagerFactory from './ContextActivationManagerFactory';
import { registerEndpoints, unregisterEndpoints } from './EndpointRegistrator';
import type { ManifestCacheProvider } from './ManifestCacheProvider';
import { createDictionaryFromOsfControl, OsfControl } from './OsfControl';
import type { TelemetryEvent, CustomerContentEvent } from '@microsoft/oteljs';
import {
    logAddinUsage,
    addOTelColumnData,
    getOneDSCustomerContentEvent,
    getOneDSTelemetryEvent,
} from 'owa-addins-analytics';
import { deleteAllApiEventHandlers } from 'owa-addins-events';
import {
    extensibilityState,
    getEntryPointForControl,
    terminateUiLessExtendedAddinCommand,
    InvokeAppAddinCommandStatusCode,
    IAddinCommandTelemetry,
} from 'owa-addins-store';
import { lazyLogAddinsCustomerContent, lazyLogAddinsTelemetryEvent } from 'owa-analytics';
import type ExtensionInstallScope from 'owa-service/lib/contract/ExtensionInstallScope';
import LicenseType from 'owa-service/lib/contract/LicenseType';
import { getCurrentCulture } from 'owa-localize';
import { isFeatureEnabled } from 'owa-feature-flags';

const UserInstallScope: ExtensionInstallScope = 'User';
const OrgInstallScope: ExtensionInstallScope = 'Organization';
const TimeOutErrorCode: number = 1042;

export type NotifyHostActions = {
    [action: number]: (controlId: string, data: {}) => Promise<void>;
};
export type OnInsertOsfControlDelegate = () => void;
export type DisplayNotificationDelegate = (args: OSF.Notification) => void;

export class OsfControlAdapter {
    private hostItemIndex: string;

    private contextActivationManager: OSF.ContextActivationManager;
    private activeOsfControl: OsfControl;
    private extensionContainer: HTMLDivElement;

    private notifyHostActions: NotifyHostActions;
    private onInsertOsfControlAction: OnInsertOsfControlDelegate;
    private onDisplayNotificationAction: DisplayNotificationDelegate;
    private manifestCacheProvider: ManifestCacheProvider;
    private addinCommandTelemetry: IAddinCommandTelemetry;

    constructor(
        hostItemIndex: string,
        manifestCacheProvider: ManifestCacheProvider,
        notifyHostActions?: NotifyHostActions,
        onInsertOsfControl?: OnInsertOsfControlDelegate,
        onDisplayNotification?: DisplayNotificationDelegate,
        addinCommandTelemetry?: IAddinCommandTelemetry
    ) {
        this.hostItemIndex = hostItemIndex;
        this.addinCommandTelemetry = addinCommandTelemetry;
        this.contextActivationManager = ContextActivationManagerFactory.createContextActivationManager(
            getCurrentCulture(),
            this.notifyHost
        );
        this.notifyHostActions = notifyHostActions || {};
        this.onInsertOsfControlAction = onInsertOsfControl;
        this.onDisplayNotificationAction = onDisplayNotification;
        this.manifestCacheProvider = manifestCacheProvider;
        const externalNotifyError = this.notifyHostActions[OSF.AgaveHostAction.NotifyHostError];
        this.notifyHostActions[OSF.AgaveHostAction.NotifyHostError] = (
            controlId: string,
            data: { errorCode: number }
        ) => {
            if (externalNotifyError) {
                externalNotifyError(controlId, data);
            }
            this.notifyHostError(controlId, data);
            this.tryTerminateUiLessAddin(data.errorCode, controlId);
            return Promise.resolve();
        };
        this.notifyHostActions[
            OSF.AgaveHostAction.SendTelemetryEvent
        ] = this.sendTelemetryEvent.bind(this);
        this.notifyHostActions[
            OSF.AgaveHostAction.SendCustomerContent
        ] = this.sendCustomerContentEvent.bind(this);
    }

    public insertOsfControl(osfControl: OsfControl, extensionContainer: HTMLDivElement): void {
        registerEndpoints(this.hostItemIndex, this.contextActivationManager._serviceEndPoint);
        this.activeOsfControl = osfControl;
        this.extensionContainer = extensionContainer;
        this.manifestCacheProvider.cache(osfControl, getCurrentCulture());
        this.contextActivationManager.insertOsfControl(
            createDictionaryFromOsfControl(
                this.hostItemIndex,
                this.activeOsfControl,
                extensionContainer
            )
        );
    }

    public purgeOsfControl(): void {
        if (!!this.activeOsfControl && !!this.extensionContainer) {
            const { controlId } = this.activeOsfControl;
            unregisterEndpoints(this.hostItemIndex, this.contextActivationManager._serviceEndPoint);
            deleteAllApiEventHandlers(controlId);
            this.contextActivationManager.purgeOsfControl(controlId, false);
            this.activeOsfControl = null;
            this.extensionContainer = null;
        }
    }

    public onInsertOsfControl(): void {
        const {
            addinCommand: { extension },
        } = this.activeOsfControl;

        if (
            (extension.OriginString == UserInstallScope ||
                extension.OriginString == OrgInstallScope) &&
            extensibilityState.Context &&
            extensibilityState.Context.IsInOrgMarketplaceRole
        ) {
            this.tryDisplayNotification(extension.AppStatus, extension.LicenseType);
        }

        if (!!this.onInsertOsfControlAction) {
            this.onInsertOsfControlAction();
        }
    }

    public notifyAgave(action: OSF.AgaveHostAction) {
        const { controlId } = this.activeOsfControl;
        this.contextActivationManager.notifyAgave(controlId, action);
    }

    public updateHostItemIndex(hostItemIndex: string) {
        unregisterEndpoints(this.hostItemIndex, this.contextActivationManager._serviceEndPoint);

        this.hostItemIndex = hostItemIndex;
        registerEndpoints(hostItemIndex, this.contextActivationManager._serviceEndPoint);
    }

    public dispose(): void {
        this.contextActivationManager.dispose();
        this.contextActivationManager = null;
    }

    public notifyHost = async (controlId: string, action: OSF.AgaveHostAction, data: {}) => {
        const hostActions = this.notifyHostActions;
        if (hostActions) {
            const handler = hostActions[action];
            if (handler) {
                await handler(controlId, data);
            }
        }
    };

    private notifyHostError(controlId: string, data: { errorCode?: number }) {
        logAddinUsage(
            false /* success */,
            this.activeOsfControl?.addinCommand,
            this.hostItemIndex,
            getEntryPointForControl(controlId),
            this.addinCommandTelemetry,
            controlId,
            data.errorCode
        );
    }

    private async sendTelemetryEvent(
        ControlIdUnused: string,
        event: TelemetryEvent
    ): Promise<void> {
        const oneDSEvent = getOneDSTelemetryEvent(event);
        const { addinCommand, controlId } = this.activeOsfControl;
        addOTelColumnData(oneDSEvent, addinCommand, this.hostItemIndex, controlId);
        if (oneDSEvent.iKey) {
            await lazyLogAddinsTelemetryEvent.importAndExecute(
                oneDSEvent.iKey /* tenantToken */,
                oneDSEvent
            );
        }
    }

    private async sendCustomerContentEvent(
        ControlIdUnused: string,
        event: CustomerContentEvent
    ): Promise<void> {
        if (!isFeatureEnabled('addin-sendCustomerContent')) {
            return;
        }

        const oneDSEvent = getOneDSCustomerContentEvent(event);
        const { addinCommand, controlId } = this.activeOsfControl;
        addOTelColumnData(oneDSEvent, addinCommand, this.hostItemIndex, controlId);
        if (oneDSEvent.iKey) {
            await lazyLogAddinsCustomerContent.importAndExecute(
                oneDSEvent.iKey /* tenantToken */,
                oneDSEvent
            );
        }
    }

    private displayNotification(args: OSF.Notification) {
        this.contextActivationManager.displayNotification(args);

        if (!!this.onDisplayNotificationAction) {
            this.onDisplayNotificationAction(args);
        }
    }

    private tryDisplayNotification(status: string, licenseType: LicenseType) {
        const { addinCommand, controlId } = this.activeOsfControl;
        if (!!status) {
            const notification = getErrorNotification(controlId, addinCommand, status);
            if (notification) {
                this.displayNotification(notification);
            }
        } else if (licenseType == LicenseType.Trial) {
            this.displayNotification(getTrialNotification(addinCommand, controlId));
        }
    }

    private tryTerminateUiLessAddin(errorCode: number, controlId: string) {
        if (errorCode == TimeOutErrorCode) {
            let context = {
                allowEvent: false,
            };
            terminateUiLessExtendedAddinCommand(
                controlId,
                this.hostItemIndex,
                InvokeAppAddinCommandStatusCode.TimedOut,
                context
            );
        }
    }
}
