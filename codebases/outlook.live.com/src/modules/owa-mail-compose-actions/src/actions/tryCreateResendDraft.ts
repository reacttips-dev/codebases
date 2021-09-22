import loadDraftToCompose from './loadDraftToCompose';
import createResendDraft from '../services/createResendDraft';
import { ComposeTarget } from 'owa-mail-compose-store';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import type { InfoBarHostViewState } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { action } from 'satcheljs/lib/legacy';

const INFO_RESEND_ERROR = 'infoResendError';

export default action('tryCreateResendDraft')(function tryCreateResendDraft(
    ndrMessageId: string,
    viewState: InfoBarHostViewState
) {
    const draftsFolderId = folderNameToId('drafts');
    createResendDraft(ndrMessageId, draftsFolderId)
        .then(newDraftMessageId => {
            if (newDraftMessageId) {
                // try remove resend error infobar if has one
                if (viewState.infoBarIds.indexOf(INFO_RESEND_ERROR)) {
                    removeInfoBarMessage(viewState, INFO_RESEND_ERROR);
                }
                // load draft and open compose
                loadDraftToCompose(
                    newDraftMessageId,
                    null /* sxsId */,
                    ComposeTarget.SecondaryTab,
                    {
                        isNdrResend: true,
                    }
                );
            } else {
                // add resend error infobar
                addInfoBarMessage(viewState, INFO_RESEND_ERROR);
            }
        })
        .catch(() => {
            // add resend error infobar
            addInfoBarMessage(viewState, INFO_RESEND_ERROR);
        });
});
