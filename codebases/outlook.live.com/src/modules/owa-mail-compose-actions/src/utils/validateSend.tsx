import { computed, IComputedValue } from 'mobx';
import {
    getComposeHostItemIndex,
    isAnyNonAutoRunUilessAddinRunning,
    lazyAllowItemSendEvent,
} from 'owa-addins-core';
import insertAppendOnSend from 'owa-addins-editor-plugin/lib/utils/insertAppendOnSend';
import { PerformanceDatapoint, logUsage } from 'owa-analytics';
import {
    LazyPendingPermissionsDialog,
    LazySharingIssueBlockDialog,
} from 'owa-attachment-block-on-send';
import {
    getHasSharingIssues,
    getPendingAttachmentString,
    getPendingPermissionString,
    getSharingIssuesString,
    newSharingIssueSubTitle,
    newSharingIssueTitle,
    hasLinkSharingIssue,
} from 'owa-attachment-block-on-send/lib/directIndex';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isGroupsEnabled } from 'owa-account-capabilities/lib/isGroupsEnabled';
import { isGroupTableSelected } from 'owa-group-utils';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import { LazyInsertLinksBlockDialog } from 'owa-insert-link';
import loc, { format, isStringNullOrWhiteSpace } from 'owa-localize';
import { blockOnNavigationTitle } from 'owa-locstrings/lib/strings/blockonnavigationtitle.locstring.json';
import { okButton } from 'owa-locstrings/lib/strings/okbutton.locstring.json';
import { smimeComposeHasCloudAttachments } from 'owa-locstrings/lib/strings/smimecomposehascloudattachments.locstring.json';
import {
    mandatoryLabelTitle,
    mandatoryLabelModalDescription,
    mandatoryLabelConfirmButtonText,
} from 'owa-mail-protection/lib/components/CLPMandatoryLabelModal.locstring.json';
import { CLPMandatoryLabelModal } from 'owa-mail-protection';
import setSelectedCLPLabel from 'owa-mail-protection/lib/actions/clp/setSelectedCLPLabel';
import setTempCLPLabel from 'owa-mail-protection/lib/actions/clp/setTempCLPLabel';
import {
    logCLPLabelChange,
    logMandatoryLabelDialogShown,
} from 'owa-mail-protection/lib/utils/clp/logCLPDatapoints';
import type { ComposeViewState } from 'owa-mail-compose-store';
import {
    checkForForgottenAttachments,
    LazyForgottenAttachmentsToggle,
} from 'owa-mail-forgotten-attachments';
import { getBlockedSendMessage } from 'owa-policy-tips/lib/utils/getBlockedSendMessage';
import { isValidToSend } from 'owa-policy-tips/lib/utils/isValidToSend';
import resolveAllUnresolvedRecipients from 'owa-readwrite-recipient-well/lib/actions/resolveAllUnresolvedRecipients';
import getNumberInvalidRecipients from 'owa-readwrite-recipient-well/lib/utils/getNumberInvalidRecipients';
import { isCheckPermPending } from 'owa-recipient-permission-checker';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isSmimeEnabledInViewState from 'owa-smime/lib/utils/isSmimeEnabledInViewState';
import { isSxSDisplayed, lazyCanCloseSxS, getActiveSxSId } from 'owa-sxs-store';
import { trace } from 'owa-trace';
import * as React from 'react';
import setIsSending from '../actions/setIsSending';
import {
    attachmentInProgressTitle,
    doNotSendButtonText,
    missingSubjectSubTitle,
    missingSubjectTitle,
    policyTipsBlockedSendDialogTitle,
    sendAnywayButtonText,
    sendButtonText,
} from '../strings.locstring.json';
import {
    INSERT_LINK_ERROR_CODE,
    FORGOTTEN_ATTACHMENTS_ERROR_CODE,
    PENDING_PERMISSION_ERROR_CODE,
    SHARING_ISSUE_ERROR_CODE,
} from './blockDialog/validateErrorCodes';
import { ValidateScenario } from './blockDialog/validateScenario';
import { validateSteps } from './blockDialog/validateSteps';
import type { VerificationStep } from './blockDialog/verificationStep';
import isPrimaryAddressInFromWell from './fromAddressUtils/isPrimaryAddressInFromWell';
import { getRecipientWellsFromComposeViewState } from './getAllRecipientsAsEmailAddressStrings';
import getCloudyAttachmentNames from './getCloudyAttachmentNames';
import getCurrentFromAddress from './getFromAddressFromRecipientWell';
import getRecipientsCount from './getRecipientsCount';
import hasModernGroupInRecipients from './hasModernGroupInRecipients';
import { markDatapointAsWaiting } from './markDatapointAsWaiting';
import resolveFindControlText from './resolveFindControlText';
import validateFromAddress from './validateFromAddress';
import {
    getAllInsertLinksIds,
    getInsertLinksBlockDialogOnSendStrings,
    validateFromInsertLinks,
} from './validateFromInsertLinks';
import {
    attachmentReminderSubText,
    attachmentReminderText,
    blockOnNavigationDontSendLabel,
    blockOnNavigationSendLabel,
    blockOnNavigationSendMessage,
    sharingIssueTitle,
    smimeComposeFromNonPrimaryEmail,
    smimeComposeHasModernGroups,
} from './validateSend.locstring.json';
import { getTotalRecipientCount } from './viewStateUtils';
import { protectionStore } from 'owa-mail-protection/lib/store/protectionStore';
import { DialogResponse } from 'owa-confirm-dialog';
import resolveAllUnresolvedUnifiedRecipients from 'owa-unified-people-picker/lib/actions/resolveAllUnresolvedRecipients';
import resolveAllUnresolvedRecipientsInEdit from 'owa-recipient-edit/lib/actions/resolveAllUnresolvedRecipientsInEdit';

/** Comments in the below object reference validation steps from JsMVVM that are as-yet-implemented in owamail */
const computedValidationSteps: IComputedValue<VerificationStep[]> = computed(
    () =>
        [
            {
                validate: async (viewState: ComposeViewState) => {
                    return isValidToSend(viewState.policyTipsViewState);
                },
                errorCode: 'PolicyTipsViolation',
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    return {
                        text: loc(policyTipsBlockedSendDialogTitle),
                        subtext: getBlockedSendMessage(viewState.policyTipsViewState),
                        confirmOptions: {
                            hideCancelButton: true,
                        },
                        continueOnUserConfirmation: false,
                    };
                },
            },
            {
                validate: async (viewState: ComposeViewState) => {
                    const { clpViewState } = viewState.protectionViewState;
                    const { hasMandatoryLabel } = protectionStore;
                    return (
                        !isFeatureEnabled('cmp-clp-mandatory-labeling') ||
                        !hasMandatoryLabel ||
                        clpViewState.selectedCLPLabel
                    );
                },
                errorCode: 'CLPMandatoryLabeling',
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    const { clpViewState } = viewState.protectionViewState;
                    logMandatoryLabelDialogShown();
                    return {
                        text: loc(mandatoryLabelTitle),
                        subtext: loc(mandatoryLabelModalDescription),
                        confirmOptions: {
                            okText: loc(mandatoryLabelConfirmButtonText),
                            bodyElement: <CLPMandatoryLabelModal viewState={clpViewState} />,
                            shouldDisableOkButton: () => {
                                return !clpViewState.tempCLPLabel;
                            },
                        },
                        onModalResolveCallback: (confirmResult: DialogResponse) => {
                            if (confirmResult == DialogResponse.ok) {
                                if (clpViewState.tempCLPLabel) {
                                    setSelectedCLPLabel(
                                        clpViewState.tempCLPLabel,
                                        viewState,
                                        clpViewState
                                    );
                                    logCLPLabelChange(
                                        clpViewState.selectedCLPLabel,
                                        clpViewState.tempCLPLabel
                                    );
                                    setTempCLPLabel(clpViewState, null);
                                }
                            } else if (confirmResult == DialogResponse.cancel) {
                                setTempCLPLabel(clpViewState, null);
                            }
                        },
                        continueOnUserConfirmation: true,
                    };
                },
            },
            /** if (this.discardManager.HasDiscarded(composeViewModel.Context.ViewModelId)) */
            /** else if (recipientComponent.IsFromRecipientInvalid) */
            {
                validate: async (viewState: ComposeViewState, datapoint: PerformanceDatapoint) => {
                    let hasInvalidRecipient = false;
                    for (const recipientWell of [
                        viewState.toRecipientWell,
                        viewState.ccRecipientWell,
                        viewState.bccRecipientWell,
                    ]) {
                        if (recipientWell) {
                            if (isFeatureEnabled('mon-rp-recipientEdit')) {
                                resolveAllUnresolvedRecipientsInEdit(recipientWell);
                            } else if (isFeatureEnabled('mon-rp-unifiedPicker')) {
                                await resolveAllUnresolvedUnifiedRecipients(
                                    recipientWell,
                                    undefined /* startAtIndex */,
                                    () => {
                                        markDatapointAsWaiting(datapoint);
                                    }
                                );
                            } else {
                                await resolveAllUnresolvedRecipients(
                                    recipientWell,
                                    recipientWell.recipients,
                                    () => {
                                        markDatapointAsWaiting(datapoint);
                                    }
                                );
                            }
                            if (recipientWell.inForceResolve) {
                                hasInvalidRecipient = true;
                                logUsage('sendInvalidRecipients', [
                                    getNumberInvalidRecipients(recipientWell),
                                    recipientWell.findResultSet.length,
                                ]);
                                break;
                            }
                        }
                    }

                    return !hasInvalidRecipient;
                },
                errorCode: 'InvalidRecipients',
            },
            {
                validate: async (viewState: ComposeViewState) => {
                    resolveFindControlText(viewState.toRecipientWell);
                    resolveFindControlText(viewState.ccRecipientWell);
                    resolveFindControlText(viewState.bccRecipientWell);
                    return (
                        getRecipientsCount(viewState.toRecipientWell) > 0 ||
                        getRecipientsCount(viewState.ccRecipientWell) > 0 ||
                        getRecipientsCount(viewState.bccRecipientWell) > 0
                    );
                },
                messageId: 'errorMessageNoRecipentsMailCanNotBeSend',
                errorCode: 'NoRecipients',
            },
            {
                validate: async (viewState: ComposeViewState) => {
                    return validateFromAddress(viewState);
                },
                messageId: 'errorMessageInvalidSenderMailCanNotBeSend',
                errorCode: 'InvalidSender',
            },
            {
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    const hasWaitingAttachments = viewState.numberOfWaitingAttachments > 0;
                    return {
                        text: loc(attachmentInProgressTitle),
                        subtext: getPendingAttachmentString(
                            viewState.attachmentWell,
                            hasWaitingAttachments
                        ),
                        confirmOptions: {
                            okText: loc(okButton),
                            hideCancelButton: true,
                        },
                        continueOnUserConfirmation: false,
                    };
                },
                validate: async (viewState: ComposeViewState) => {
                    const hasWaitingAttachments = viewState.numberOfWaitingAttachments > 0;
                    if (hasWaitingAttachments) {
                        return false;
                    }

                    return isStringNullOrWhiteSpace(
                        getPendingAttachmentString(viewState.attachmentWell, hasWaitingAttachments)
                    );
                },
                errorCode: 'AttachmentInProgress',
            },
            {
                validate: async (viewState: ComposeViewState) => {
                    const totalRecipients = getTotalRecipientCount(viewState);
                    return totalRecipients <= getUserConfiguration().MaxRecipientsPerMessage;
                },
                messageId: 'warningMessageMaxRecipientsExceed',
                errorCode: 'MaxRecipients',
            },
            {
                // The user might be editing an attachment in the preview pane.
                // Wait until the preview pane is either ready for send or
                // is unable to save the attachment - canClosePreviewPane
                // returns a promise to achieve this so we have to await
                // on the result of the promise
                validate: async (viewState: ComposeViewState, datapoint: PerformanceDatapoint) => {
                    const sxsId = getActiveSxSId(window);
                    if (!isSxSDisplayed(sxsId)) {
                        return true;
                    }
                    markDatapointAsWaiting(datapoint);
                    return (await lazyCanCloseSxS.import())(sxsId);
                },
                messageId: 'errorMessageFileCanNotBeSaved',
                errorCode: 'CantClosePreviewPane',
            },
            {
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    return {
                        text: loc(missingSubjectTitle),
                        subtext: loc(missingSubjectSubTitle),
                        confirmOptions: {
                            okText: loc(sendButtonText),
                            cancelText: loc(doNotSendButtonText),
                        },
                        continueOnUserConfirmation: true,
                    };
                },
                validate: async (viewState: ComposeViewState) =>
                    viewState.isInlineCompose ||
                    (viewState.subject && viewState.subject.length > 0),
                errorCode: 'NoSubject',
            },
            {
                validate: async (viewState: ComposeViewState) => {
                    removeInfoBarMessage(viewState, 'errorSmimeMessageHasIRM');
                    if (isSmimeEnabledInViewState(viewState.smimeViewState)) {
                        const isIRMEnabled = viewState.protectionViewState?.IRMData?.RmsTemplateId;
                        return !isIRMEnabled;
                    }
                    return true;
                },
                messageId: 'errorSmimeComposeHasIRM',
                errorCode: 'HasIRMDataInSmime',
            },
            {
                validate: async (viewState: ComposeViewState) => {
                    if (isSmimeEnabledInViewState(viewState.smimeViewState)) {
                        // Invalidate if From is showing a non-primary identity (VSO 58684)
                        const fromViewState = viewState.fromViewState;
                        return !(
                            fromViewState.isFromShown &&
                            !isPrimaryAddressInFromWell(fromViewState.from?.email?.EmailAddress)
                        );
                    }
                    return true;
                },
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    return {
                        text: '',
                        subtext: loc(smimeComposeFromNonPrimaryEmail),
                        confirmOptions: {
                            okText: loc(okButton),
                            hideCancelButton: true,
                        },
                        continueOnUserConfirmation: false,
                    };
                },
                errorCode: 'HasFromFieldInSmime',
            },
            {
                validate: async (viewState: ComposeViewState) => {
                    if (isSmimeEnabledInViewState(viewState.smimeViewState)) {
                        return !hasModernGroupInRecipients(viewState);
                    }
                    return true;
                },
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    return {
                        text: '',
                        subtext: loc(smimeComposeHasModernGroups),
                        confirmOptions: {
                            okText: loc(okButton),
                            hideCancelButton: true,
                        },
                        continueOnUserConfirmation: false,
                    };
                },
                errorCode: 'HasModernGroupsInSmime',
            },
            {
                validate: async (viewState: ComposeViewState) => {
                    if (isSmimeEnabledInViewState(viewState.smimeViewState)) {
                        return !getCloudyAttachmentNames(viewState).length;
                    }
                    return true;
                },
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    return {
                        text: '',
                        subtext: format(
                            loc(smimeComposeHasCloudAttachments),
                            getCloudyAttachmentNames(viewState).join(', ')
                        ),
                        confirmOptions: {
                            okText: loc(okButton),
                            hideCancelButton: true,
                        },
                        continueOnUserConfirmation: false,
                    };
                },
                errorCode: 'HasCloudyAttachmentsInSmime',
            },
            {
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    return {
                        text: () => getInsertLinksBlockDialogOnSendStrings().title, // Passing the callback to the ConfirmDialog component,  so that it can observe the store value.
                        confirmOptions: {
                            bodyElement: (
                                <LazyInsertLinksBlockDialog
                                    insertLinksIds={getAllInsertLinksIds()}
                                    isSend={true}
                                />
                            ),
                            cancelText: () =>
                                getInsertLinksBlockDialogOnSendStrings().cancelButtonText, // Passing the callback to the ConfirmDialog component,  so that it can observe the store value.
                            okText: () => getInsertLinksBlockDialogOnSendStrings().okButtonText, // Passing the callback to the ConfirmDialog component,  so that it can observe the store value.
                        },
                        continueOnUserConfirmation: true,
                    };
                },
                validate: (viewState: ComposeViewState) => {
                    return validateFromInsertLinks(viewState, true /*isSend*/);
                },
                errorCode: INSERT_LINK_ERROR_CODE,
            },
            {
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    if (hasLinkSharingIssue()) {
                        return {
                            text: loc(newSharingIssueTitle), // To manage access, select the file(s) in your message.
                            confirmOptions: {
                                bodyElement: (
                                    <LazySharingIssueBlockDialog
                                        labelString={loc(newSharingIssueSubTitle)}
                                    />
                                ),
                                okText: loc(sendAnywayButtonText),
                                cancelText: loc(doNotSendButtonText),
                                dialogContentProps: {
                                    showCloseButton: true,
                                },
                            },
                            continueOnUserConfirmation: true,
                        };
                    } else {
                        return {
                            text: loc(sharingIssueTitle),
                            subtext: getSharingIssuesString(
                                viewState.infoBarIds,
                                viewState.attachmentWell,
                                getCurrentFromAddress(viewState.toRecipientWell),
                                getRecipientWellsFromComposeViewState(viewState),
                                viewState.composeId,
                                false /* isCalendar */
                            ),
                            confirmOptions: {
                                okText: loc(sendButtonText),
                                cancelText: loc(doNotSendButtonText),
                            },
                            continueOnUserConfirmation: true,
                        };
                    }
                },
                validate: async (viewState: ComposeViewState) =>
                    !(await getHasSharingIssues(
                        viewState.infoBarIds,
                        viewState.attachmentWell,
                        getCurrentFromAddress(viewState.toRecipientWell),
                        getRecipientWellsFromComposeViewState(viewState),
                        false /*isCalendar*/
                    )),
                errorCode: SHARING_ISSUE_ERROR_CODE,
            },
            {
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    // passing callbacks so the strings will be dynamic and get updated based on the store value.
                    // when calling the callback from the ConfirmDialog component, the property is observable.
                    const getPendingPermissionStrings = () =>
                        getPendingPermissionString(
                            viewState.attachmentWell,
                            getCurrentFromAddress(viewState.toRecipientWell),
                            getRecipientWellsFromComposeViewState(viewState)
                        );
                    return {
                        text: () => getPendingPermissionStrings().title,
                        confirmOptions: {
                            bodyElement: (
                                <LazyPendingPermissionsDialog
                                    attachmentWell={viewState.attachmentWell}
                                    fromAddress={getCurrentFromAddress(viewState.toRecipientWell)}
                                    recipientContainers={getRecipientWellsFromComposeViewState(
                                        viewState
                                    )}
                                />
                            ),
                            cancelText: () => getPendingPermissionStrings().cancelText,
                            okText: () => getPendingPermissionStrings().okButton,
                        },
                        continueOnUserConfirmation: true,
                    };
                },
                validate: async (viewState: ComposeViewState) => {
                    return !isCheckPermPending(viewState.composeId);
                },
                errorCode: PENDING_PERMISSION_ERROR_CODE,
            },
            {
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    return {
                        text: loc(blockOnNavigationTitle),
                        subtext: loc(blockOnNavigationSendMessage),
                        confirmOptions: {
                            okText: loc(blockOnNavigationSendLabel),
                            cancelText: loc(blockOnNavigationDontSendLabel),
                        },
                        continueOnUserConfirmation: true,
                    };
                },
                validate: async (viewState: ComposeViewState) => {
                    return !isAnyNonAutoRunUilessAddinRunning(
                        getComposeHostItemIndex(viewState.composeId)
                    );
                },
                errorCode: 'AddinsStillRunning',
            },
            {
                getConfirmDialogOptions: (viewState: ComposeViewState) => {
                    return {
                        text: loc(attachmentReminderText),
                        subtext: loc(attachmentReminderSubText),
                        confirmOptions: {
                            bodyElement: <LazyForgottenAttachmentsToggle />,
                            okText: loc(sendButtonText),
                            cancelText: loc(doNotSendButtonText),
                        },
                        continueOnUserConfirmation: true,
                    };
                },
                validate: (viewState: ComposeViewState) => {
                    if (getUserConfiguration().UserOptions.CheckForForgottenAttachments) {
                        return !checkForForgottenAttachments(viewState);
                    }
                    return true;
                },
                errorCode: FORGOTTEN_ATTACHMENTS_ERROR_CODE,
            },
            {
                /** appendOnSendAsync API
                 * This appends text to the body of the e-mail after the user presses send.
                 * It must be done at this location:
                 * 1. Before ItemSend, so the appended text is also validated
                 * 2. After other validation checks, so if any of the previous validation checks
                 *  fail, the user does not see the appended text.
                 */
                validate: async (viewState: ComposeViewState) => {
                    if (
                        isFeatureEnabled('rp-appendOnSend') &&
                        viewState.addin.appendOnSend.length != 0
                    ) {
                        await insertAppendOnSend(viewState, viewState.addin);
                    }
                    return true;
                },
                errorCode: 'AppendOnSend',
            },
            /** else if (attachmentComponent != null &&
                attachmentComponent.AttachmentWellViewModel != null &&
                this.ViewModel.ForgottenAttachmentDetectorAsyncFactory != null) */
            {
                /* ItemSend Event Add-ins should always be the last validation step.*/
                validate: async (viewState: ComposeViewState) => {
                    if (
                        (isGroupsEnabled() && isGroupTableSelected()) ||
                        viewState.protectionViewState?.IRMData?.RmsTemplateId
                    ) {
                        return true;
                    }
                    const shouldAllowItemSendEvent = await lazyAllowItemSendEvent.import();
                    return shouldAllowItemSendEvent(getComposeHostItemIndex(viewState.composeId));
                },
                errorCode: 'AddinBlockingSend',
            },
        ] as VerificationStep[]
);

export default async function validateSend(
    viewState: ComposeViewState,
    targetWindow: Window,
    datapoint: PerformanceDatapoint
): Promise<string> {
    let result: string = null;
    try {
        result = await validateSteps(
            viewState,
            datapoint,
            computedValidationSteps.get(),
            ValidateScenario.onSend,
            targetWindow
        );
    } catch (e) {
        setIsSending(viewState, false /*isSending*/);
        trace.warn(e);
        return Promise.reject(e);
    }

    return Promise.resolve(result);
}
