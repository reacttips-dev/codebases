import findMetatag from './findMetatag';

function tryAddSuffix(url: string = ''): string | undefined {
    if (url && url.indexOf('/') > -1) {
        return url + AriaUrlSuffix;
    }

    return undefined;
}

export const AriaUrlSuffix = 'Collector/3.0/';

export function getAriaUrl(): string | undefined {
    const ariaUrl = findMetatag('ariaUrl');
    return tryAddSuffix(ariaUrl);
}

export function getCompactAriaUrl(): string | undefined {
    const compactAriaUrl = findMetatag('compactAriaUrl');
    return tryAddSuffix(compactAriaUrl);
}
