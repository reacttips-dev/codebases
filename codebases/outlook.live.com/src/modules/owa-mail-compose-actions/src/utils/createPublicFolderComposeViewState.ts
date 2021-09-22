import type {
    PublicFolderComposeViewState,
    PublicFolderComposeViewStateInitProps,
} from 'owa-mail-compose-store';
import createMailComposeViewState from './createMailComposeViewState';
import getFromViewState from './getFromViewState';

export default function createPublicFolderComposeViewState(
    props: PublicFolderComposeViewStateInitProps
): PublicFolderComposeViewState {
    return <PublicFolderComposeViewState>{
        ...createMailComposeViewState(props),

        fromViewState: getFromViewState(
            props.from,
            props.meetingRequestItem,
            props.referenceItemId,
            true
        ),
        publicFolderId: props.publicFolderId,
    };
}
