import { AnchorElementsSource } from '../types/AnchorElementsSource';
import getSharingLinkInfo from '../selectors/getSharingLinkInfo';

const newLinkSources = [
    AnchorElementsSource.PasteHtml,
    AnchorElementsSource.InsertLinkFromToolbar,
    AnchorElementsSource.AutoLink,
    AnchorElementsSource.ShareLinkCompose,
    AnchorElementsSource.InsertLinkFromAttachMenu,
];

export function isNewLink(linkId: string): boolean {
    const sharingLinkInfo = getSharingLinkInfo(linkId);
    return sharingLinkInfo && newLinkSources.indexOf(sharingLinkInfo.source) !== -1;
}
