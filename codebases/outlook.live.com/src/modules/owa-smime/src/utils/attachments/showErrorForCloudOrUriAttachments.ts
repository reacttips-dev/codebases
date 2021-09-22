import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import loc, { format } from 'owa-localize';
import type { InfoBarHostViewState } from 'owa-info-bar/lib/schema/InfoBarMessageViewState';
import { smimeComposeHasCloudAttachments } from 'owa-locstrings/lib/strings/smimecomposehascloudattachments.locstring.json';

export default function showErrorForCloudOrUriAttachments(
    attachmentFileNames: string[],
    infoBar: InfoBarHostViewState
) {
    attachmentFileNames?.length &&
        addInfoBarMessage(infoBar, 'ErrorSmimeHasCloudOrUriAttachments', [
            format(loc(smimeComposeHasCloudAttachments), attachmentFileNames.join(', ')),
        ]);
}
