import {
    officeAddinsNotificationGenericError,
    officeAddinsAutomaticProgressNotificationLabel,
} from './UILessFrame.locstring.json';
import loc, { format } from 'owa-localize';
import { observer } from 'mobx-react';
import * as React from 'react';

import WebExtNotificationTypeType from 'owa-service/lib/contract/WebExtNotificationTypeType';
import { addOrReplaceNotificationMessage, removeNotificationMessage } from 'owa-addins-apis';

import { OsfHostContainer } from '../components/OsfHostContainer';
import 'owa-addins-osfruntime/lib/index';
import {
    getExtensibilityState,
    IExtendedAddinCommand,
    InvokeAppAddinCommandStatusCode,
    isAnyUilessAddinRunning,
    isAutoRunAddinCommand,
    terminateUiLessExtendedAddinCommand,
    timeoutResetUiLessExtendedAddinCommand,
    onAutorunExecutionCompleted,
    IAutoRunAddinCommand,
} from 'owa-addins-store';
import {
    AddinCommandsManifestCacheProvider,
    getNotificationTypeFromOSFInfoType,
} from 'owa-addins-osf-facade';
import { logLaunchEventTelemetry } from 'owa-addins-analytics';

import styles from './UILessFrame.scss';

export interface UILessFrameProps {
    extendedAddinCommand: IExtendedAddinCommand;
    controlId: string;
    hostItemIndex: string;
    disableProgressBar?: boolean;
}

@observer
// tslint:disable-next-line:prefer-functional-components
export default class UILessFrame extends React.Component<UILessFrameProps, any> {
    private infoBarId: number;

    constructor(props: UILessFrameProps, context?: any) {
        super(props, context);
        this.infoBarId = 0;
        if (isAutoRunAddinCommand(props.extendedAddinCommand.addinCommand)) {
            getExtensibilityState().activeAutorunUilessFrames.set(
                props.controlId,
                this as UILessFrame
            );
        }
    }

    private addDisplayNotification = (notification: OSF.Notification) => {
        addOrReplaceNotificationMessage(
            this.props.hostItemIndex,
            this.props.controlId,
            false /* persistent */,
            `${this.props.extendedAddinCommand.addinCommand.get_Id()}${this.infoBarId++}`,
            getNotificationTypeFromOSFInfoType(notification.infoType),
            notification.description
        );
    };

    private addGenericErrorNotification = () => {
        const message = format(
            loc(officeAddinsNotificationGenericError),
            this.props.extendedAddinCommand.addinCommand.get_ExtensionDisplayName()
        );
        addOrReplaceNotificationMessage(
            this.props.hostItemIndex,
            this.props.controlId,
            false /* persistent */,
            this.props.extendedAddinCommand.addinCommand.get_Id(),
            WebExtNotificationTypeType.ErrorMessage,
            message,
            this.props.extendedAddinCommand.addinCommand.get_Size16Icon()
        );
    };

    private removeProgressNotification() {
        removeNotificationMessage(
            this.props.hostItemIndex,
            this.props.controlId,
            this.props.extendedAddinCommand.addinCommand.get_Id()
        );
    }

    private addProgressNotification() {
        const message = format(
            loc(officeAddinsAutomaticProgressNotificationLabel),
            this.props.extendedAddinCommand.addinCommand.get_ExtensionDisplayName(),
            this.props.extendedAddinCommand.addinCommand.get_Label()
        );
        addOrReplaceNotificationMessage(
            this.props.hostItemIndex,
            this.props.controlId,
            false /* persistent */,
            this.props.extendedAddinCommand.addinCommand.get_Id(),
            WebExtNotificationTypeType.ProgressIndicator,
            message
        );
    }

    private invokeAppCommand = (subseqCallControl?: any, subseqCallArgs?: any): void => {
        this.props.extendedAddinCommand.addinCommandTelemetry.setExecutionStartTime();
        let control: any = this.props.extendedAddinCommand.addinCommand.getControl();
        if (subseqCallControl) {
            control = subseqCallControl;
            // this is to reset/extend the timeout for subsequent calls.
            timeoutResetUiLessExtendedAddinCommand(this.props.controlId);
        }

        const functionName = control.Action.FunctionName;
        const eventObj = {
            source: { id: control.Id },
            ...(subseqCallControl
                ? subseqCallArgs
                : this.props.extendedAddinCommand.launchEventArgs),
            hasExistingCommandInQueue: subseqCallControl ? true : false,
        };

        if (!this.props.disableProgressBar) {
            this.addProgressNotification();
        }
        OfficeExt.AddinCommandsRuntimeManager.invokeAppCommand(
            this.props.controlId,
            functionName,
            eventObj,
            this.onEventCompleted
        );

        if (isAutoRunAddinCommand(this.props.extendedAddinCommand.addinCommand)) {
            logLaunchEventTelemetry(
                this.props.extendedAddinCommand.addinCommand as IAutoRunAddinCommand,
                this.props.hostItemIndex,
                this.props.controlId
            );
        }
    };

    private onEventCompleted = (status: number, args: OSF.EventCompletedArgs) => {
        const completedContext = args ? args.completedContext : undefined;

        if (isAutoRunAddinCommand(this.props.extendedAddinCommand.addinCommand)) {
            if (status != InvokeAppAddinCommandStatusCode.TimedOut) {
                // for autorun we have to extend timeout, so we will ignore 5 min timeout signal from osfruntime.
                // Timeout reset/extension is handled in autoRunAddinUtils.ts and pendingUILess.ts
                onAutorunExecutionCompleted(
                    this.props.extendedAddinCommand,
                    this.props.controlId,
                    this.props.hostItemIndex,
                    status,
                    completedContext
                );
            }
            return;
        }

        if (!this.props.disableProgressBar) {
            this.removeProgressNotification();
        }

        if (
            status != InvokeAppAddinCommandStatusCode.Success &&
            // need to check this in case the uiless has already been terminated from the MessageComposeAdapter.close() call
            isAnyUilessAddinRunning(this.props.hostItemIndex)
        ) {
            this.addGenericErrorNotification();
        }

        terminateUiLessExtendedAddinCommand(
            this.props.controlId,
            this.props.hostItemIndex,
            status,
            completedContext
        );
    };

    render(): JSX.Element {
        const hostActions = {};
        hostActions[OSF.AgaveHostAction.NotifyHostError] = this.addGenericErrorNotification;

        return (
            <OsfHostContainer
                addinCommand={this.props.extendedAddinCommand.addinCommand}
                addinCommandTelemetry={this.props.extendedAddinCommand.addinCommandTelemetry}
                controlId={this.props.controlId}
                hostItemIndex={this.props.hostItemIndex}
                manifestCacheProvider={AddinCommandsManifestCacheProvider}
                onInsertOsfControl={this.invokeAppCommand}
                onDisplayNotification={this.addDisplayNotification}
                notifyHostActions={hostActions}
                className={styles.uiLessContainer}
            />
        );
    }
}
