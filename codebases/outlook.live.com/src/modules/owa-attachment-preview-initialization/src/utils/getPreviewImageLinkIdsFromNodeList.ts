import { getSharingLinkInfo, SharingLinkInfo, lazyImageLinkPreviewCondition } from 'owa-link-data';

/**
 * This function filters the array of link elements to only retrieve the Ids of
 * BeautifulLink Images that are ODC.
 *
 * @param allElements This is a collection of BeautifulLinks.
 * @returns An array of strings containing the BeautifulLink Ids within the MessageBody/ HTMLContent.
 */
export async function getPreviewImageLinkIdsFromNodeList(
    allElements: NodeListOf<Element>
): Promise<string[]> {
    let beautifulLinkIds: string[] = [];
    const imageLinkPreviewCondition = await lazyImageLinkPreviewCondition.import();

    for (let i = 0; i < allElements.length; i++) {
        const linkInformation: SharingLinkInfo = getSharingLinkInfo(allElements[i].id);
        const isLinkPreviewable = imageLinkPreviewCondition(
            linkInformation?.fileName,
            linkInformation?.providerType
        );
        if (isLinkPreviewable && !beautifulLinkIds.includes(allElements[i].id)) {
            beautifulLinkIds.push(allElements[i].id);
        }
    }

    return beautifulLinkIds;
}
