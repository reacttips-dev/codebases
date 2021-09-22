import ComposeLinkPreviewMode from '../store/schema/ComposeLinkPreviewMode';
import getStore from '../store/store';

export default function getLinkPreviewMode(linkId: string): ComposeLinkPreviewMode {
    const store = getStore();
    if (linkId === store.selectedLinkId) {
        if (store.isSelectedLinkReadOnly === false) {
            return ComposeLinkPreviewMode.Edit;
        }
        return ComposeLinkPreviewMode.Selected;
    }
    return ComposeLinkPreviewMode.None;
}
