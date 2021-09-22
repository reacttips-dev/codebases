import { getOwaResourceUrl } from 'owa-resource-url';
import { addProtocol } from 'owa-config/lib/bootstrapOptions';

const FAVICON_REL = 'shortcut icon';
const FAVICON_TYPE = 'image/x-icon';

export default function applyFavicon(relativeFavIconPath: string, overlayIconPath?: string) {
    if (!document) {
        // We may be in SSR? Bail either way
        return;
    }

    const favIconUrl = getOwaResourceUrl(relativeFavIconPath);
    let favIconElement = document.querySelector(`link[rel="${FAVICON_REL}"]`) as HTMLLinkElement;

    if (!favIconElement) {
        favIconElement = document.createElement('link');
        favIconElement.rel = FAVICON_REL;
        favIconElement.type = FAVICON_TYPE;

        document.head.appendChild(favIconElement);
    }

    const fullfavIconUrl = addProtocol(favIconUrl);
    if (favIconElement.href != fullfavIconUrl) {
        for (const cb of favIconCallbacks) {
            cb(fullfavIconUrl, overlayIconPath);
        }
    }

    favIconElement.href = favIconUrl; //protocol automatically gets added in the href
}

type FavIconCallback = (iconUrl: string, overlayIconUrl?: string) => void;
let favIconCallbacks: FavIconCallback[] = [];
export function registerFavIconCallback(cb: FavIconCallback) {
    favIconCallbacks.push(cb);
}
