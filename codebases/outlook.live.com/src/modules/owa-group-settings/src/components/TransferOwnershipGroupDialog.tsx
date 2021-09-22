import {
    cannotLeaveGroupDialogTransferOwnership,
    leaveGroupByTransferOwnershipDialog,
    leaveGroupSuccessDialog,
    cannotLeaveGroupDialogCancel,
    cannotLeaveGroupDialogTitle,
    leaveGroupSuccessDialogOk,
} from './CannotLeaveGroupDialog.locstring.json';
import loc, { format as stringFormat } from 'owa-localize';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { ControlIcons } from 'owa-control-icons';
import { getGroupsStore } from 'owa-groups-shared-store/lib/GroupsStore';
import { getCurrentGroupInformationStore } from 'owa-groups-shared-store/lib/CurrentGroupInformationStore';
import { getOpxHostApi } from 'owa-opx';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import {
    useLivePersonaCard,
    PersonaCardBehaviorProps,
} from 'owa-persona/lib/components/PersonaCardBehavior';

import styles from './CannotLeaveGroupDialog.scss';
interface TransferOwnershipGroupProps {
    onClose: () => void;
    transferOwnershipEvent: () => JSX.Element;
    isLeaveCompleted?: boolean;
    groupDisplayName: string;
    groupSmtp?: string;
}

export const TransferOwnershipGroupDialog = observer(function TransferOwnershipGroupDialog(
    props: TransferOwnershipGroupProps
) {
    if (props.isLeaveCompleted) {
        const data = {
            scenario: 'LeaveGroup',
            isSuccess: true,
            groupSmtpAddress: props.groupSmtp,
            error: null,
        };
        if (isHostAppFeatureEnabled('scenarioData')) {
            getOpxHostApi().sendScenarioData(data);
        }
    }
    const getCancelButton = () => {
        return props.isLeaveCompleted ? null : (
            <DefaultButton
                className={styles.groupDiscardButton}
                onClick={props.onClose}
                text={loc(cannotLeaveGroupDialogCancel)}
            />
        );
    };

    const getPrimaryButton = () => {
        return props.isLeaveCompleted ? (
            <PrimaryButton onClick={props.onClose} className={styles.okPrimaryButton}>
                {loc(leaveGroupSuccessDialogOk)}
            </PrimaryButton>
        ) : (
            <PrimaryButton className={styles.transferPrimaryButton}>
                {props.transferOwnershipEvent()}
            </PrimaryButton>
        );
    };

    return (
        <Dialog
            hidden={false}
            maxWidth={425}
            onDismiss={props.onClose}
            modalProps={{
                isBlocking: false,
                className: styles.dialogBox,
            }}
            dialogContentProps={{
                type: DialogType.close,
                title: loc(cannotLeaveGroupDialogTitle),
            }}>
            <div className={styles.leaveGroupDialog}>
                <div className={styles.infoIconPadding}>
                    {props.isLeaveCompleted ? (
                        <Icon className={styles.infoIcon} iconName={ControlIcons.CheckMark} />
                    ) : (
                        <Icon className={styles.infoIcon} iconName={ControlIcons.Info} />
                    )}
                </div>
                <div>
                    {props.isLeaveCompleted
                        ? stringFormat(loc(leaveGroupSuccessDialog), props.groupDisplayName)
                        : loc(leaveGroupByTransferOwnershipDialog)}
                </div>
            </div>
            <DialogFooter>
                <div className={styles.dialogFooterButtons}>
                    {getPrimaryButton()}
                    {getCancelButton()}
                </div>
            </DialogFooter>
        </Dialog>
    );
});

function wrapInLPCTarget(
    emailAddress: string,
    name: string,
    aadObjectId: string,
    personaType: string,
    children: React.ReactNode,
    clientScenario: string,
    isHiddenOverflow: boolean = false,
    ariaLabel: string = null,
    locationToOpen: string,
    onCardOpenCallback?: () => void
): JSX.Element {
    return (
        <LPCWrapper
            disableHover={true}
            emailAddress={emailAddress}
            aadObjectId={aadObjectId}
            name={name}
            personaType={personaType}
            ariaLabel={ariaLabel}
            className={isHiddenOverflow ? styles.hiddenOverflow : undefined}
            locationToOpen={locationToOpen}
            clientScenario={clientScenario}
            onCardOpenCallback={onCardOpenCallback}>
            {children}
        </LPCWrapper>
    );
}

export const transferOwnershipEvent = function transferOwnershipEvent(
    groupSmtp?: string,
    onCardOpenCallback?: () => void
) {
    const groupsStore = getGroupsStore();
    const groupId = groupSmtp ? groupSmtp : getCurrentGroupInformationStore().smtpAddress;
    const group = groupsStore.groups.get(groupId.toLowerCase());
    const groupEmailAddress = group.basicInformation.SmtpAddress;
    const groupName = group.basicInformation.DisplayName;
    const groupAadObjectId = group.basicInformation.ExternalDirectoryObjectId
        ? group.basicInformation.ExternalDirectoryObjectId
        : group.groupDetails.ExternalDirectoryObjectId;
    const membersButtonText = loc(cannotLeaveGroupDialogTransferOwnership);

    return (
        <span className={styles.dialogFooterButtons}>
            {wrapInLPCTarget(
                groupEmailAddress,
                groupName,
                groupAadObjectId,
                'Group',
                <div className={styles.targetButton}>{membersButtonText}</div>,
                'GroupHeader',
                true /*isHiddenOverflow*/,
                membersButtonText /* ariaLabel */,
                'ExpandedViewTransferOwnershipDialog',
                onCardOpenCallback
            )}
        </span>
    );
};

export default function showTransferOwnershipGroupDialog(
    groupDisplayName: string,
    isLeaveCompleted: boolean,
    groupSmtp?: string
) {
    let transferOwnershipGroupDialogDiv = document.createElement('div');
    transferOwnershipGroupDialogDiv.id = 'TransferOwnershipGroupDialog';
    document.body.appendChild(transferOwnershipGroupDialogDiv);
    const unmount = () => {
        ReactDOM.unmountComponentAtNode(transferOwnershipGroupDialogDiv);
        document.body.removeChild(transferOwnershipGroupDialogDiv);

        if (isHostAppFeatureEnabled('opxComponentLifecycle')) {
            getOpxHostApi().onOwaTaskCompleted();
        }
    };
    ReactDOM.render(
        <React.StrictMode>
            <TransferOwnershipGroupDialog
                onClose={unmount}
                transferOwnershipEvent={transferOwnershipEvent}
                isLeaveCompleted={isLeaveCompleted}
                groupDisplayName={groupDisplayName}
                groupSmtp={groupSmtp}
            />
        </React.StrictMode>,
        transferOwnershipGroupDialogDiv
    );
}

function LPCWrapper(props: PersonaCardBehaviorProps & { children?: React.ReactNode }) {
    const PersonaCardBehavior = useLivePersonaCard(props);
    return <PersonaCardBehavior>{props.children}</PersonaCardBehavior>;
}
