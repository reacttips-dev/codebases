import type { ComposeViewState } from '../store/schema/ComposeViewState';
import type { PublicFolderComposeViewState } from '../store/schema/PublicFolderComposeViewState';

export default function isPublicFolderComposeViewState(
    viewState: ComposeViewState
): viewState is PublicFolderComposeViewState {
    return (<PublicFolderComposeViewState>viewState).publicFolderId !== undefined;
}
