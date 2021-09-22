import { getClientVersion } from 'owa-config';
import { getPopoutUrl } from 'owa-url';
import { POPOUT_V2_QUERY, POPOUT_V2_VALUE } from '../utils/constants';

const VERSION = 'version';

export interface DeeplinkUrlOptions {
    skipOptinCheck?: boolean;
    isStandalone?: boolean;
    urlParameters?: Record<string, string>;
}

export default function getDeeplinkUrl(
    vdir: 'mail' | 'calendar',
    route: string,
    options: DeeplinkUrlOptions = {}
): string {
    const parameters: Record<string, string> = options.isStandalone
        ? {}
        : {
              [POPOUT_V2_QUERY]: POPOUT_V2_VALUE, // Use this parameter to tell popout window that it is opened from OWA so possibly there are some data to retrieve from parent window
              [VERSION]: getClientVersion(),
          };

    // merge any additional scenario-based parameters into the final parameters object
    const additionalUrlParameters = options.urlParameters || {};
    Object.keys(additionalUrlParameters).map(key => {
        parameters[key] = additionalUrlParameters[key];
    });

    return getPopoutUrl(vdir, route, options.skipOptinCheck, parameters);
}
