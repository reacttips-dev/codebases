import * as userAgent from 'owa-user-agent';

// Cannot cache this value because user can enable/disable plugins
declare var ActiveXObject: any;

export default function isPDFPreviewSupported(
    makeActiveXObject?: (name: string) => any,
    plugins?: any
): boolean {
    if (
        userAgent.isBrowserChrome() ||
        userAgent.isBrowserEDGECHROMIUM() ||
        userAgent.isBrowserSafari()
    ) {
        return hasPDFPlugin(plugins);
    } else if (userAgent.isBrowserIE()) {
        return hasAdobePlugin(makeActiveXObject || ((name: string) => new ActiveXObject(name)));
    } else if (userAgent.isBrowserEdge() || userAgent.isBrowserFirefox()) {
        // use PDF.js instead by default now
        return false;
    }

    return false;
}

function hasAdobePlugin(makeActiveXObject: (name: string) => any): boolean {
    try {
        return makeActiveXObject('AcroPDF.PDF') !== null;
    } catch (e) {
        return false;
    }
}

function hasPDFPlugin(plugins?: any): boolean {
    const pluginNames = ['Chrome PDF Viewer', 'Microsoft Edge PDF Viewer', 'WebKit built-in PDF'];
    plugins = plugins || navigator?.plugins;
    try {
        return (
            typeof plugins?.namedItem === 'function' &&
            pluginNames.some(pluginName => plugins.namedItem(pluginName) !== null)
        );
    } catch {}

    return false;
}
