import { isBrowserEdge, isBrowserIE } from 'owa-user-agent/lib/userAgent';

const ContentAttribute = 'content';

type ContentType = 'never' | 'origin' | 'always' | 'default';

let referrerMeta: HTMLMetaElement | undefined;
export default function setReferrerMeta(value: ContentType) {
    if ((isBrowserEdge() || isBrowserIE()) && document) {
        if (!referrerMeta) {
            referrerMeta = document.createElement('meta');
            referrerMeta.setAttribute('name', 'referrer');
            document.head.appendChild(referrerMeta);
        }
        referrerMeta.setAttribute(ContentAttribute, value);
    }
}
