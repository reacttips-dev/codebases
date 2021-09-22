import {
    sensitivityLabel,
    requestReadReceipts,
    requestDeliveryReceipts,
    encryptMessageToSmime,
    signMessageToSmime,
    messageOptionsHeader,
} from './MessageOptionsDialog.locstring.json';
import { cancelButton } from 'owa-locstrings/lib/strings/cancelbutton.locstring.json';
import { okButton } from 'owa-locstrings/lib/strings/okbutton.locstring.json';
import loc from 'owa-localize';
import { observer } from 'mobx-react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { Dialog, DialogFooter } from '@fluentui/react/lib/Dialog';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { logUsage } from 'owa-analytics';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { onSmimeOptionsChange } from 'owa-mail-compose-actions/lib/actions/smimeActions';
import setIsDeliveryReceiptRequested from 'owa-mail-compose-actions/lib/actions/setIsDeliveryReceiptRequested';
import setIsReadReceiptRequested from 'owa-mail-compose-actions/lib/actions/setIsReadReceiptRequested';
import setMessageSensitivity from 'owa-mail-compose-actions/lib/actions/setMessageSensitivity';
import updateSensitivityInfoBar from 'owa-mail-compose-actions/lib/utils/updateSensitivityInfoBar';
import { getSensitivityOptions, getSensitivityTypeForKey } from 'owa-mail-sensitivity';
import type SensitivityType from 'owa-service/lib/contract/SensitivityType';

import * as React from 'react';
import shouldShowSmimeOptions from '../utils/shouldShowSmimeOptions';
import isSmimeOptionDisabled from '../utils/isSmimeOptionDisabled';
import styles from './MessageOptionsDialog.scss';

export interface MesageOptionsDialogProps {
    onClose?: () => void;
    composeViewState: ComposeViewState;
}

export interface MesageOptionsDialogState {
    isShown: boolean;
    isReadReceiptRequested: boolean;
    isDeliveryReceiptRequested: boolean;
    sensitivity: SensitivityType;
    shouldEncryptMessageAsSmime: boolean;
    shouldSignMessageAsSmime: boolean;
}

@observer
export default class MessageOptionsDialog extends React.Component<
    MesageOptionsDialogProps,
    MesageOptionsDialogState
> {
    constructor(props: MesageOptionsDialogProps) {
        super(props);
        const {
            isReadReceiptRequested,
            isDeliveryReceiptRequested,
            sensitivity,
            smimeViewState,
        } = props.composeViewState;
        this.state = {
            isShown: true,
            isReadReceiptRequested: isReadReceiptRequested,
            isDeliveryReceiptRequested: isDeliveryReceiptRequested,
            sensitivity: sensitivity ? sensitivity : 'Normal',
            shouldEncryptMessageAsSmime: smimeViewState.shouldEncryptMessageAsSmime,
            shouldSignMessageAsSmime: smimeViewState.shouldSignMessageAsSmime,
        };
    }

    private onAcceptChanges = () => {
        const { composeViewState } = this.props;
        const {
            isReadReceiptRequested,
            isDeliveryReceiptRequested,
            shouldEncryptMessageAsSmime,
            shouldSignMessageAsSmime,
            sensitivity,
        } = this.state;

        setIsReadReceiptRequested(composeViewState, isReadReceiptRequested);
        setIsDeliveryReceiptRequested(composeViewState, isDeliveryReceiptRequested);
        onSmimeOptionsChange(
            composeViewState,
            shouldEncryptMessageAsSmime,
            shouldSignMessageAsSmime
        );
        setMessageSensitivity(composeViewState, sensitivity);
        updateSensitivityInfoBar(composeViewState);
        this.onDismiss();
    };

    private onDismiss = () => {
        this.setState({
            isShown: false,
        });
        this.props.onClose();
    };

    private onSensitivityChanged = (item: IDropdownOption) => {
        this.setState({
            sensitivity: getSensitivityTypeForKey(item.key.toString()),
        });
    };

    private onReadReceiptRequestedCheckboxChanged = (_event: any, checked: boolean) =>
        this.setState({
            isReadReceiptRequested: checked,
        });

    private onDeliveryReceiptRequestedCheckboxChanged = (_event: any, checked: boolean) =>
        this.setState({
            isDeliveryReceiptRequested: checked,
        });

    private onShouldEncryptSmimeCheckboxChanged = (_event: any, checked: boolean) =>
        this.setState({
            shouldEncryptMessageAsSmime: checked,
        });

    private onShouldSignSmimeCheckboxChanged = (_event: any, checked: boolean) =>
        this.setState({
            shouldSignMessageAsSmime: checked,
        });

    render() {
        const dialogContent = [];
        const { composeViewState } = this.props;
        const {
            isReadReceiptRequested,
            isDeliveryReceiptRequested,
            smimeViewState,
        } = composeViewState;
        dialogContent.push(
            <Dropdown
                className={styles.dialogItem}
                defaultSelectedKey={this.state.sensitivity}
                label={loc(sensitivityLabel)}
                ariaLabel={loc(sensitivityLabel)}
                onChanged={this.onSensitivityChanged}
                options={getSensitivityOptions()}
            />,
            <Checkbox
                className={styles.dialogItem}
                defaultChecked={isReadReceiptRequested}
                label={loc(requestReadReceipts)}
                ariaLabel={loc(requestReadReceipts)}
                onChange={this.onReadReceiptRequestedCheckboxChanged}
            />,
            <Checkbox
                className={styles.dialogItem}
                defaultChecked={isDeliveryReceiptRequested}
                label={loc(requestDeliveryReceipts)}
                ariaLabel={loc(requestDeliveryReceipts)}
                onChange={this.onDeliveryReceiptRequestedCheckboxChanged}
            />
        );
        if (shouldShowSmimeOptions(composeViewState)) {
            dialogContent.push(
                <Checkbox
                    className={styles.dialogItem}
                    defaultChecked={smimeViewState.shouldEncryptMessageAsSmime}
                    label={loc(encryptMessageToSmime)}
                    ariaLabel={loc(encryptMessageToSmime)}
                    disabled={isSmimeOptionDisabled(
                        composeViewState,
                        true /** shouldEncryptMessageAsSmimeCheckbox */
                    )}
                    onChange={this.onShouldEncryptSmimeCheckboxChanged}
                />
            );
            dialogContent.push(
                <Checkbox
                    className={styles.dialogItem}
                    defaultChecked={smimeViewState.shouldSignMessageAsSmime}
                    label={loc(signMessageToSmime)}
                    ariaLabel={loc(signMessageToSmime)}
                    disabled={isSmimeOptionDisabled(
                        composeViewState,
                        false /** shouldEncryptMessageAsSmimeCheckbox */
                    )}
                    onChange={this.onShouldSignSmimeCheckboxChanged}
                />
            );
        }

        if (dialogContent.length === 0) {
            logUsage(
                'MessageOptionsEmptyInvariantViolation',
                null // customData
            );
        }
        return (
            <Dialog
                hidden={!this.state.isShown}
                dialogContentProps={{
                    title: loc(messageOptionsHeader),
                }}
                onDismiss={this.onDismiss}>
                {dialogContent}
                <DialogFooter className={styles.dialogItem}>
                    <PrimaryButton onClick={this.onAcceptChanges}>{loc(okButton)}</PrimaryButton>
                    <DefaultButton onClick={this.onDismiss}>{loc(cancelButton)}</DefaultButton>
                </DialogFooter>
            </Dialog>
        );
    }
}
