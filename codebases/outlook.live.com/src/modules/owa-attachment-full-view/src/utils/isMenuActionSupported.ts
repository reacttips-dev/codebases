import type { AttachmentFullViewState, AttachmentMenuAction } from 'owa-attachment-full-data';

export default function isMenuActionSupported(
    action: AttachmentMenuAction,
    viewState: AttachmentFullViewState
): boolean {
    return viewState.strategy.supportedMenuActions.indexOf(action) !== -1;
}
