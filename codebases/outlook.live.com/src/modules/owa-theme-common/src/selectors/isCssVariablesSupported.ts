import { isBrowserEdge, isBrowserSafari, isMinimumBrowserVersion } from 'owa-user-agent';

declare global {
    interface Window {
        CSS?: {
            supports(propertyName: string, propertyValue: string): boolean;
        };
    }
}

let cachedBrowserSupport: boolean | undefined;

export function isCssVariablesSupported(): boolean {
    if (cachedBrowserSupport === undefined) {
        cachedBrowserSupport = doesBrowserSupportCssVariables();
    }

    return cachedBrowserSupport;
}

function doesBrowserSupportCssVariables(): boolean {
    if (isBrowserEdge() && !isMinimumBrowserVersion([16])) {
        // Edge 15 generally supports CSS variables, but has several bugs, including
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/
        return false;
    } else if (isBrowserSafari()) {
        // Safari 9.1+ support CSS variables:
        // https://caniuse.com/#search=css%20variables
        // but Safari doesn't support the mechanism below to determine browser support
        // https://developer.mozilla.org/en-US/docs/Web/API/CSS
        return isMinimumBrowserVersion([9, 1]);
    } else {
        // See https://stackoverflow.com/questions/26633258/how-can-i-detect-css-variable-support-with-javascript
        // Get the CSS interface, which has the "supports" method we need to detect support.
        // This interface doesn't exist on IE and some early versions of Edge
        const CSS = window.CSS;
        return !!CSS && !!CSS.supports && CSS.supports('color', 'var(--fake-var)');
    }
}
