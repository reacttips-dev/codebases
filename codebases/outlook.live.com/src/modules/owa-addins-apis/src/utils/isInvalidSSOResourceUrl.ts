import { getWebApplicationResourceForAddin } from 'owa-addins-store';

export default function isInvalidSSOResourceUrl(
    controlId: string,
    securityOrigin: string
): boolean {
    let webApplicationResource = getWebApplicationResourceForAddin(controlId);
    if (webApplicationResource) {
        webApplicationResource = webApplicationResource.toLowerCase().replace('api://', 'https://');
    }
    let addinApplicationResourceHost = getHostSecure(webApplicationResource);
    let securityOriginHost = getHostSecure(securityOrigin);
    let owaHost = getHostSecure(window.location.href);

    if (
        !addinApplicationResourceHost ||
        !securityOriginHost ||
        (addinApplicationResourceHost.toLowerCase() != securityOriginHost.toLowerCase() &&
            securityOriginHost != owaHost) // This check is added for Projection popout case where message is going from (outlook-web js > OWA > osfruntime) and (osfruntime > OWA > outlook-web js)
    ) {
        return true;
    }

    return false;
}

function getHostSecure(absoluteUrl: string) {
    if (!absoluteUrl) {
        return undefined;
    }
    const httpsProtocol = 'https:';
    let host;
    try {
        let urlObj = new URL(absoluteUrl);
        if (!urlObj || urlObj.protocol != httpsProtocol) {
            return undefined;
        }
        host = urlObj.host;
    } catch (error) {
        // URL parsing library is not available on IE so it throws error.
        let parser = document.createElement('a');
        parser.href = absoluteUrl;
        if (parser.protocol !== httpsProtocol) {
            return undefined;
        }

        let stringEndsWithSlash = str => {
            return str.substring(str.length - 1, str.length) === '/';
        };
        if (
            (parser.pathname === '' || parser.pathname === '/') &&
            !stringEndsWithSlash(absoluteUrl)
        ) {
            absoluteUrl += '/';
        }

        // IE will show parser.host with the port regardless on whether url originally had a port or not
        // For validation,we need to consider both cases
        let parsedUrlWithoutPort =
            parser.protocol +
            '//' +
            parser.hostname +
            (stringEndsWithSlash(parser.hostname) ? '' : '/') +
            parser.pathname +
            parser.search +
            parser.hash;
        let parsedUrlWithPort =
            parser.protocol +
            '//' +
            parser.host +
            (stringEndsWithSlash(parser.host) ? '' : '/') +
            parser.pathname +
            parser.search +
            parser.hash;

        if (absoluteUrl == parsedUrlWithoutPort || absoluteUrl == parsedUrlWithPort) {
            host = parser.port == '443' ? parser.hostname : parser.host;
        }
    }

    return host;
}
