import type { MailFolder } from 'owa-graph-schema';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function getEffectiveFolderDisplayName(
    folder: Pick<MailFolder, 'remoteFolderDisplayName' | 'DisplayName'>
): string {
    if (!folder) {
        return '';
    }

    if (getUserConfiguration().SessionSettings.IsShadowMailbox && folder.remoteFolderDisplayName) {
        return folder.remoteFolderDisplayName;
    }

    return folder.DisplayName;
}
