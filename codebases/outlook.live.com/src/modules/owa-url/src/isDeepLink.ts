let isDeepLinkValue = false;

export default function isDeepLink() {
    return isDeepLinkValue;
}

export function setIsDeepLink(value: boolean) {
    isDeepLinkValue = value;
}
