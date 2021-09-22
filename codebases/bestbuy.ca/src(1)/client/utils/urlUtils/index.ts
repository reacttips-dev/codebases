export const extractDomain = (hostname: string): string => {
    const result = hostname.match(/\w+\.?\w+$/);
    return result ? result[0] : "";
};

export const getDomain = (): string => {
    let baseDomain: string = "";
    if (typeof document !== "undefined") {
        baseDomain = extractDomain(document.location.hostname);
    }
    return baseDomain;
};
