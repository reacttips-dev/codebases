import {
    isMinimumBrowserVersion,
    isBrowserChrome,
    isBrowserEdge,
    isBrowserEDGECHROMIUM,
} from 'owa-user-agent';
import {
    MINIMUM_CHROME_VERSION,
    MINIMUM_EDGE_VERSION,
    MINIMUM_EDGE_CHROMIUM_VERSION,
} from './constants';

export default function doesBrowserSupportModernExtension(): boolean {
    return (
        (isBrowserChrome() && isMinimumBrowserVersion([MINIMUM_CHROME_VERSION])) ||
        (isBrowserEdge() && isMinimumBrowserVersion([MINIMUM_EDGE_VERSION])) ||
        (isBrowserEDGECHROMIUM() && isMinimumBrowserVersion([MINIMUM_EDGE_CHROMIUM_VERSION]))
    );
}
