import { observer } from 'mobx-react-lite';
import { iFrameableDialogCloseButtonAccessibilityLabel } from './IFrameableDialog.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';

import { Dialog, DialogType } from '@fluentui/react/lib/Dialog';
import { DialogManifestCacheProvider } from 'owa-addins-osf-facade';
import { OsfHostContainer } from '../components/OsfHostContainer';
import { OutlookEventDispId, unregisterApiEvent } from 'owa-addins-events';
import 'owa-addins-osfruntime/lib/index';
import {
    ActiveDialog,
    ActiveDialogType,
    getAddinCommandForControl,
    getExtensibilityState,
} from 'owa-addins-store';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';
import { findFrameworkComponentId } from '../utils/frameworkComponentUtils';

import styles from './IFrameableDialog.scss';

export default observer(function IFrameableDialog(props: {}) {
    const targetWindow = React.useContext(ProjectionContext);
    const frameworkComponentId = findFrameworkComponentId(targetWindow);
    const hostItemIndex = getExtensibilityState().frameworkComponentHostItemIndexMap.get(
        frameworkComponentId
    );

    const dialog: ActiveDialog = getExtensibilityState().activeDialogs.get(hostItemIndex);

    const hideDialogCallback = React.useCallback(() => hideDialog(dialog.parentControlId), [
        dialog?.parentControlId,
    ]);

    if (!dialog) {
        return <div className={styles.divContainer} />;
    }
    if (dialog.isOpen && dialog.dialogType == ActiveDialogType.IFrameable) {
        const addinCommand = getAddinCommandForControl(dialog.parentControlId);
        const appTitle = addinCommand?.extension?.DisplayName;
        const iframeStyle: any = {
            height: dialog.heightInPercentage + 'vh',
            width: dialog.widthInPercentage + 'vw',
            overflow: 'hidden',
        };
        let closeButtonAriaText = loc(iFrameableDialogCloseButtonAccessibilityLabel);
        if (closeButtonAriaText) {
            closeButtonAriaText = closeButtonAriaText.replace('{0}', appTitle);
        }
        const notifyHostActions = {};
        notifyHostActions[OSF.AgaveHostAction.EscExit] = hideDialog;
        return (
            <Dialog
                hidden={!dialog.isOpen}
                onDismiss={hideDialogCallback}
                dialogContentProps={{
                    type: DialogType.close,
                    title: appTitle,
                    closeButtonAriaLabel: closeButtonAriaText,
                }}
                modalProps={{
                    isBlocking: true,
                    containerClassName: styles.dialogContainer,
                }}
                forceFocusInsideTrap={false}
                isClickableOutsideFocusTrap={true}>
                <OsfHostContainer
                    addinCommand={addinCommand}
                    controlId={dialog.controlId}
                    isDialog={true}
                    hostItemIndex={dialog.hostItemIndex}
                    sourceLocation={dialog.url}
                    manifestCacheProvider={DialogManifestCacheProvider}
                    notifyHostActions={notifyHostActions}
                    style={iframeStyle}
                />
            </Dialog>
        );
    } else {
        return <div className={styles.divContainer} />;
    }
});

export function hideDialog(parentControlId: string): void {
    unregisterApiEvent({
        eventDispId: OutlookEventDispId.DISPLAY_DIALOG_DISPID,
        controlId: parentControlId,
    });
}
