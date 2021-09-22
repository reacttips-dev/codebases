import { observer } from 'mobx-react-lite';
import {
    errorPublicFolderNotAvailableDialogBoxTitle,
    errorPublicFolderNotAvailableDialogBoxBody,
    okButton_0,
} from './PublicFolderErrorDialog.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { Dialog, DialogFooter, PrimaryButton, DialogType } from '@fluentui/react/lib';
import { shouldShowPublicFolderErrorDialog } from '../actions/updatePublicFolderPickerProps';

export interface PublicFolderErrorDialogViewProps {
    isHidden: boolean;
}

export const PublicFolderErrorDialog = observer(function PublicFolderErrorDialog(
    props: PublicFolderErrorDialogViewProps
) {
    return (
        <Dialog
            hidden={props.isHidden}
            onDismiss={closeDialog}
            dialogContentProps={{
                type: DialogType.normal,
                title: loc(errorPublicFolderNotAvailableDialogBoxTitle),
                subText: loc(errorPublicFolderNotAvailableDialogBoxBody),
            }}>
            <DialogFooter>
                <PrimaryButton onClick={closeDialog} text={loc(okButton_0)} />
            </DialogFooter>
        </Dialog>
    );
});

function closeDialog() {
    shouldShowPublicFolderErrorDialog(false);
}
