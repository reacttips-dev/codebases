import { observer } from 'mobx-react-lite';
import * as React from 'react';
import ConsentStateType from 'owa-service/lib/contract/ConsentStateType';
import { Dialog, DialogType } from '@fluentui/react/lib/Dialog';
import { OutlookEventDispId, unregisterApiEvent } from 'owa-addins-events';
import {
    ActiveDialog,
    ActiveDialogType,
    extensibilityState,
    IAddinCommand,
} from 'owa-addins-store';

import styles from './UILessDialogWrapper.scss';

export interface UILessDialogWrapperProps {
    hostItemIndex: string;
    controlId: string;
    addinCommand: IAddinCommand;
    children?: any;
}

export default observer(function UILessDialogWrapper(props: UILessDialogWrapperProps) {
    const hideDialog = () => {
        unregisterApiEvent({
            eventDispId: OutlookEventDispId.DIALOG_NOTIFICATION_SHOWN_IN_ADDIN_DISPID,
            controlId: props.controlId,
        });
    };
    const dialog: ActiveDialog = extensibilityState.activeDialogs.get(props.hostItemIndex);
    let isOpen = false;
    if (
        !!dialog &&
        dialog.parentControlId == props.controlId &&
        dialog.dialogType == ActiveDialogType.NonIFrameable
    ) {
        isOpen = true;
    }
    const addinCommand = props.addinCommand;
    const consentState = addinCommand.extension.ConsentState;
    const extensionType = addinCommand.extension.Type;
    const style =
        consentState != ConsentStateType.Consented && extensionType == 'Preinstalled'
            ? styles.consentContainer
            : styles.uiLessContainer;
    const dialogVisibility = isOpen ? '' : styles.hiddenContainer;
    return (
        <Dialog
            hidden={false}
            onDismiss={hideDialog}
            dialogContentProps={{
                type: DialogType.normal,
                title: addinCommand.extension.DisplayName,
            }}
            modalProps={{
                isBlocking: isOpen,
                containerClassName: styles.dialogContainer,
                className: dialogVisibility,
            }}
            forceFocusInsideTrap={isOpen}
            containerClassName={styles.dialogContainer}
            isClickableOutsideFocusTrap={true}>
            <div className={style}>{props.children}</div>
        </Dialog>
    );
});
