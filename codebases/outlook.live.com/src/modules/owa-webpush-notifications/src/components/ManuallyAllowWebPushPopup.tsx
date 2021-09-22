import { observer } from 'mobx-react-lite';
import {
    webpushManualPromptHeader,
    webpushManualPromptStep1,
    webpushManualPromptStep2,
    webpushManualPromptStep3,
    webpushManualPromptStep4,
    webpushManualPromptOK,
} from './ManuallyAllowWebPushPopup.locstring.json';
import loc from 'owa-localize';
import { completeManualNotificationPermissionsPrompt } from '../actions/manualPromptActions';
import { webPushStore } from '../store/store';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogFooter } from '@fluentui/react/lib/Dialog';
import { Layer } from '@fluentui/react/lib/Layer';

import * as React from 'react';

import styles from './ManuallyAllowWebPushPopup.scss';

export const ManuallyAllowWebPushPopup = observer(function ManuallyAllowWebPushPopup(props: {}) {
    const step = (stepDirections: string, key: number) => {
        return (
            <li className={styles.step} key={key}>
                {stepDirections}
            </li>
        );
    };
    const steps = (steps: string[]) => <ol className={styles.steps}>{steps.map(step)}</ol>;
    const dismiss = () => {
        completeManualNotificationPermissionsPrompt(window.Notification.permission);
    };
    return (
        <Layer>
            <Dialog
                dialogContentProps={{
                    showCloseButton: true,
                    title: loc(webpushManualPromptHeader),
                }}
                modalProps={{
                    isBlocking: true,
                    isDarkOverlay: true,
                    containerClassName: styles.dialogContainer,
                }}
                hidden={false}
                onDismiss={dismiss}>
                {steps([
                    loc(webpushManualPromptStep1),
                    loc(webpushManualPromptStep2),
                    loc(webpushManualPromptStep3),
                    loc(webpushManualPromptStep4),
                ])}
                <DialogFooter>
                    <PrimaryButton
                        onClick={dismiss}
                        text={loc(webpushManualPromptOK)}
                        disabled={webPushStore ? webPushStore.webPushPermission === 'denied' : true}
                    />
                </DialogFooter>
            </Dialog>
        </Layer>
    );
});
