import { assertNever } from 'owa-assert';
import { UploadFolderMailboxType } from '../store/schema/UploadFolder';
import { setExplicitLogonHeaders } from 'owa-headers';

export default function getHeaders(
    mailboxId: string,
    type: UploadFolderMailboxType
): Headers | null {
    switch (type) {
        case UploadFolderMailboxType.Group:
            const headers = new Headers();
            setExplicitLogonHeaders(mailboxId, headers);

            return headers;
        case UploadFolderMailboxType.User:
            return null;
        default:
            return assertNever(type);
    }
}
