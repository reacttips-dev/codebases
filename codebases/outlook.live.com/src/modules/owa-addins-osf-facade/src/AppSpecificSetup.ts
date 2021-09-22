import { getPackageBaseUrl } from 'owa-config';
import { isCurrentCultureRightToLeft } from 'owa-localize';

export const HOST_REQUIREMENTS = {
    sets: [
        {
            name: 'mailbox',
            maxVersion: '1.10',
        },
        {
            name: 'IdentityAPI',
            maxVersion: '1.3',
        },
        {
            name: 'DialogAPI',
            maxVersion: '1.2',
        },
        {
            // Identifier so we are able to tell in the JS that the OWA client is React, not JSMVVM.
            // We need to differentiate between the OWA clients in the JS because we want to force only JSMVVM to use direct-to-aria otel
            // (otel via host not enabled for JSMVVM).
            name: 'react',
        },
    ],
};

export function getOfficeJSVersion() {
    return '16.01';
}

export const KNOWN_IMAGE_RESOURCES = [
    'progress.gif',
    'agavedefaulticon96x96.png',
    'moe_status_icons.png',
];
export const KNOWN_CSS_RESOURCES = ['moeerrorux.css'];

export const IMAGE_RESOURCE_PATH = 'resources/images/osfruntime/';
export const CSS_RESOURCE_PATH = 'resources/styles/osfruntime/';

/**
 * This facade is used by Osfruntime.js to initialize the service endpoint.
 * @param props This value is passed in by Osfruntime from "hostControl" when creating OSF.ContextActivationManager. It's not used by OWA
 * @param contextActivationManager The instance of OSF.ContextActivationManager that was initialized
 * @param serviceEndpoint The associated service endpoint for this OSF.ContextActivationManager
 */
export function setupFacade(
    props: {},
    contextActivationManager: OSF.ContextActivationManager,
    serviceEndpoint: OSF.ServiceEndpoint
) {
    contextActivationManager.getLocalizedCSSFilePath = getLocalizedResourceFilePathMethod(
        KNOWN_CSS_RESOURCES,
        getPackageBaseUrl() + CSS_RESOURCE_PATH
    );
    contextActivationManager.getLocalizedImageFilePath = getLocalizedResourceFilePathMethod(
        KNOWN_IMAGE_RESOURCES,
        getPackageBaseUrl() + IMAGE_RESOURCE_PATH
    );
    contextActivationManager._notifyHostError = contextActivationManager._notifyHost;
    contextActivationManager._hostType = OSF.HostType.Outlook;
    contextActivationManager._hostPlatform = OSF.HostPlatform.Web;
    contextActivationManager._hostSpecificFileVersion = getOfficeJSVersion();
    contextActivationManager.getRequirementsChecker().setRequirements(HOST_REQUIREMENTS);
}

function transformForRTL(filename: string): string {
    if (!isCurrentCultureRightToLeft()) {
        return filename;
    }
    switch (filename) {
        case 'moeerrorux.css':
            return 'moerroruxrtl.css';
        default:
            return filename;
    }
}

/**
 * Returns a delegate for ContextActivationManager to retrieve localized CSS files and images
 * Returning a falsy value in the delegate prevents osfruntime.js from making a failed request so we do so if we receive a request
 * for a file we are not expecting.
 */
export function getLocalizedResourceFilePathMethod(
    availableResources: string[],
    resourcePath: string
) {
    return (filename: string) => {
        let resolvedFileName = availableResources.filter(value => {
            return filename == value;
        })[0];
        resolvedFileName = transformForRTL(resolvedFileName);

        // Using lower case because files in OWA are lower cases. This could be a problem in servers that are case sensitive (for example, CDNs)
        // If you change the location of this file, please update the gulpfile.js for the host
        return resolvedFileName ? resourcePath + resolvedFileName : '';
    };
}
