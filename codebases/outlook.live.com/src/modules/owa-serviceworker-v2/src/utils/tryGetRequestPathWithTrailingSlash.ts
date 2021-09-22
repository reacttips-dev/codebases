const pathsToEnforceTrailingSlash = ['owa', 'mail', 'calendar'];

export default function tryGetRequestPathWithTrailingSlash(url: URL) {
    let pathSegments = url.pathname.split('/');
    if (pathSegments.length == 2 && pathSegments[0] == '') {
        let lowerCasePath = pathSegments[1].toLowerCase();
        if (pathsToEnforceTrailingSlash.indexOf(lowerCasePath) > -1) {
            return '/' + lowerCasePath + '/' + url.search;
        }
    }

    return null;
}
