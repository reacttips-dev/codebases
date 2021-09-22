import {
    attachmentPolicyHyperLinkText,
    attachmentPolicyInformationReadOnly,
} from './getInfoBarViewState.locstring.json';
import { attachmentPolicyInformationBlockedAccess } from 'owa-locstrings/lib/strings/attachmentpolicy.locstring.json';
import loc from 'owa-localize';
import { AttachmentPolicyInfoBarId } from '../schema/AttachmentPolicyInfoBarId';
import { assertNever } from 'owa-assert';

import {
    InfoBarCustomAction,
    InfoBarMessageColor,
    InfoBarMessageRank,
    InfoBarMessageSource,
    InfoBarMessageViewState,
} from 'owa-info-bar/lib/schema/InfoBarMessageViewState';

// TODO: VSO 32454 implement Access Control info bars
export default function getInfoBarMessageViewState(
    infoBarId: AttachmentPolicyInfoBarId
): InfoBarMessageViewState {
    switch (infoBarId) {
        case AttachmentPolicyInfoBarId.ReadOnlyPlusAttachmentsBlockedAccess:
            return {
                key: 'access_control_info_bar',
                source: InfoBarMessageSource.Compose,
                rank: InfoBarMessageRank.Error,
                message: loc(attachmentPolicyInformationBlockedAccess),
                messageParts: [
                    loc(attachmentPolicyInformationBlockedAccess),
                    getLearnMoreInfoBarCustomAction(),
                ],
                color: InfoBarMessageColor.Red,
            };
        case AttachmentPolicyInfoBarId.ReadOnlyAccess:
            return {
                key: 'access_control_info_bar_check',
                source: InfoBarMessageSource.Compose,
                rank: InfoBarMessageRank.Error,
                message: loc(attachmentPolicyInformationReadOnly),
                messageParts: [
                    loc(attachmentPolicyInformationReadOnly),
                    getLearnMoreInfoBarCustomAction(),
                ],
                color: InfoBarMessageColor.Red,
            };
        default:
            return assertNever(infoBarId);
    }
}

function getLearnMoreInfoBarCustomAction(): InfoBarCustomAction {
    const learnMoreUrl =
        'https://docs.microsoft.com/en-us/intune-user-help/use-managed-devices-to-get-work-done';
    return {
        text: loc(attachmentPolicyHyperLinkText),
        action: () => {
            window.open(learnMoreUrl, '_blank');
        },
    } as InfoBarCustomAction;
}
