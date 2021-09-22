import * as Constants from './Constants';
import { getConnectorsLTIToken } from 'owa-connectors';
import { getCookie } from 'owa-config';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { logUsage } from 'owa-analytics';
import safeGetAttribute from './safeGetAttribute';
import { INLINEIMAGE_ATTRIBUTE_ORIGINALSRC } from 'owa-inline-image-consts';

// Attribute name

const ATTRIBUTE_USECONNECTORSAUTHTOKEN = 'data-connectorsauthtoken';

// Query paramter keys
const QUERY_KEY_URL = 'u';
const QUERY_KEY_ID = 'i';
const QUERY_KEY_DATE = 'd';

// Cookie keys
const COOKIE_KEY_CLIENT_ID = 'ClientId';

/**
 * Calculates the image proxy path
 * @param element The element containing image proxy attributes
 */
export default async function calculateImageProxyPath(element: HTMLElement): Promise<string> {
    const originalSrc = safeGetAttribute(element, INLINEIMAGE_ATTRIBUTE_ORIGINALSRC);
    const proxyEndPoint = safeGetAttribute(element, Constants.ATTRIBUTE_IMAGEPROXYENDPOINT);
    const useConnectorsAuthToken = safeGetAttribute(element, ATTRIBUTE_USECONNECTORSAUTHTOKEN);

    if (!originalSrc || !proxyEndPoint) {
        // Return empty string when original src or proxy endpoint is not present or is empty
        // This usually means this is not a proxy capable image or element
        return '';
    }

    // To avoid bypassing parental controls,
    // always use originalSrc if user is a child
    if (getUserConfiguration().IsConsumerChild) {
        logUsage(Constants.DATAPOINT_PROXY_SKIP_CONSUMER_CHILD);
        return originalSrc;
    }

    return useConnectorsAuthToken == '1'
        ? calculateImageSrcForConnectorsProxy(proxyEndPoint, originalSrc)
        : calculateImageSrcForProxy(proxyEndPoint, originalSrc);
}

/**
 * Calculates the img src attribute value
 * @param proxyEndPoint The proxy end point
 * @param originalSrc The original src attribute value
 */
function calculateImageSrcForProxy(proxyEndPoint: string, originalSrc: string): string {
    const clientId = getCookie(COOKIE_KEY_CLIENT_ID);
    if (!clientId) {
        return null;
    }
    if (proxyEndPoint.toLowerCase() == '/actions/ei') {
        logUsage(Constants.DATAPOINT_PROXY_CONNECTORS_AUTH_TOKEN_FALSE);
        return null;
    }
    const imageSrc =
        `${proxyEndPoint}?` +
        `${QUERY_KEY_URL}=${encodeURIComponent(originalSrc)}&` +
        `${QUERY_KEY_ID}=${encodeURIComponent(clientId)}`;
    return imageSrc;
}

/**
 * Calculates the img src attribute value for the connectors proxy
 * @param proxyEndPoint The proxy end point
 * @param originalSrc The original src attribute value
 */
async function calculateImageSrcForConnectorsProxy(
    proxyEndPoint: string,
    originalSrc: string
): Promise<string> {
    try {
        await getConnectorsLTIToken();
    } catch (error) {
        return null;
    }
    const imageSrc =
        `${proxyEndPoint}?` +
        `${QUERY_KEY_URL}=${encodeURIComponent(originalSrc)}&` +
        `${QUERY_KEY_DATE}=${encodeURIComponent(new Date().toISOString())}`;
    return imageSrc;
}
