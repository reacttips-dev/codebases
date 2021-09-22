export default (url: string, whitelist: string[] = []): boolean => {
    if (!url) {
        return false;
    }

    const filteredList = whitelist.filter((domain: string) => {
        const targetDomain = url.replace("http://", "")
            .replace("https://", "")
            .replace("www.", "")
            .split(/[/?#]/);

        if (targetDomain.length > 0) {
            return targetDomain[0].endsWith(domain);
        }
    });

    return filteredList.length > 0;
};
