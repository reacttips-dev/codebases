const COLLAB_SPACE_ID = 'FluidCollaborativeSpace';
const DOWNLEVEL_LINK_URL_PARAM = 'fluid-agenda-downlevel-link';

// Determine if the link element is a descendant of an element with id as 'FluidCollaborativeSpace'
// or contains the down level link param in the url itself.
// This suggests its part of the html blob for collab space support in down level clients.
export function isDownLevelFluidLink(child: HTMLElement | Node, url: string): boolean {
    const ownerDocument = child.ownerDocument;
    const matchingIdElement = ownerDocument?.getElementById(COLLAB_SPACE_ID);
    const urlParams = new URLSearchParams(url);
    return (
        matchingIdElement?.contains(child) || urlParams?.get(DOWNLEVEL_LINK_URL_PARAM) === 'true'
    );
}
