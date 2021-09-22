const skipCacheQueryParams: { [queryParam: string]: 1 } = {
    bo: 1, // boot online
    authredirect: 1,
    layout: 1,
    animation: 1,
    allow: 1,
    offline: 1,
    ispopout: 1,
    debugjs: 1,
    cvero: 1,
    ae: 1,
    gulp: 1,
    branch: 1,
    features: 1,
    livepersonacardversionoverride: 1,
    midgardtestendpoint: 1,
    cspoff: 1,
    bootflights: 1,
    login_hint: 1,
    prompt: 1,
    jitexp: 1, // The jitexp query string parameter returns a different index that is not cached
};

export default function getIgnoredSearchParams(search: string | undefined): string | undefined {
    if (!search || search.length == 0 || search.charAt(0) != '?') {
        return undefined;
    }

    const keys = search
        .substr(1)
        .split('&')
        .map(kv => kv.split('=')[0].toLowerCase());

    if (keys.includes('offlineboot')) {
        return keys.includes('bo') ? 'bo' : undefined;
    }

    // return the first param for why we are skipping the service worker cache
    return keys.filter(k => skipCacheQueryParams[k])[0];
}
