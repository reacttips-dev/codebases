import { observer } from 'mobx-react-lite';
import {
    options_premium_DeleteAccountPopup_Title,
    options_premium_DeleteAccountPopup_Description,
    options_premium_DeleteAccount_Text,
    options_premium_DeleteAllAccount_Text,
    options_premium_CancelAccountDelete_Text,
    options_premium_AddAdditionalMailboxesText,
} from './CloudCacheOptionFull.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { ActionButton, DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';
import { Dialog, DialogFooter } from '@fluentui/react/lib/Dialog';
import { Label } from '@fluentui/react/lib/Label';
import { store } from '../store/store';
import { removeCloudCacheAccount } from '../actions/removeCloudCacheAccount';
import { getCloudCacheAccount } from '../actions/getCloudCacheAccount';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import { getModuleUrlForNewAccount } from '../utils/getModuleUrl';
import { Link } from '@fluentui/react/lib/Link';
import { logUsage } from 'owa-analytics';

import styles from './CloudCacheOptionFull.scss';

export interface DeleteCloudCacheAccountDialogState {
    hideDialog: boolean;
}

export default observer(function CloudCacheOptionFull(props: {}) {
    React.useEffect(() => {
        getCloudCacheAccount(getUserConfiguration().SessionSettings.WebSessionType);
    }, []);
    const [hideDialog, setHideDialog] = React.useState<boolean>(true);
    const showDialog = (): void => {
        setHideDialog(false);
    };
    const closeDialog = (): void => {
        setHideDialog(true);
    };
    const removeAccount = (): void => {
        removeCloudCacheAccount();
        closeDialog();
    };
    const removeAllAccounts = (): void => {
        removeCloudCacheAccount();
        closeDialog();
    };
    if (store.cloudCacheConfigItem.emailAddress) {
        return (
            <>
                <div className={styles.container}>
                    <Label>{store.cloudCacheConfigItem.emailAddress}</Label>

                    <ActionButton
                        onClick={showDialog}
                        iconProps={{
                            iconName: ControlIcons.Delete,
                            styles: { root: styles.actionButton },
                        }}
                        styles={{
                            label: styles.actionLabel,
                        }}
                    />
                </div>
                <div>
                    <Dialog
                        hidden={hideDialog}
                        title={loc(options_premium_DeleteAccountPopup_Title)}
                        subText={loc(options_premium_DeleteAccountPopup_Description)}
                        className={styles.dialog}
                        onDismiss={closeDialog}>
                        <DialogFooter>
                            <PrimaryButton
                                text={loc(options_premium_DeleteAccount_Text)}
                                className={styles.footerButton}
                                onClick={removeAccount}
                            />
                            <DefaultButton
                                text={loc(options_premium_DeleteAllAccount_Text)}
                                className={styles.footerButton}
                                onClick={removeAllAccounts}
                            />
                            <DefaultButton
                                text={loc(options_premium_CancelAccountDelete_Text)}
                                className={styles.footerButton}
                                onClick={closeDialog}
                            />
                        </DialogFooter>
                    </Dialog>
                </div>
            </>
        );
    } else {
        return (
            <div className={styles.container}>
                <Link data-is-focusable="true" onClick={addAccount}>
                    {loc(options_premium_AddAdditionalMailboxesText)}
                </Link>
            </div>
        );
    }
});

function addAccount(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();
    logUsage('addCloudCacheAccountClickedFromSettings', null, { isCore: true });
    window.open(getModuleUrlForNewAccount(WebSessionType.GMail), '_blank');
}
