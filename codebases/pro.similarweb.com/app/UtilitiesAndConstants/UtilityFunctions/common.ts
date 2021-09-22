export const isIncludeSubDomains = (isWWW) => {
    const ALL_DOMAINS_PREFIX = "*";
    return isWWW === ALL_DOMAINS_PREFIX;
};
