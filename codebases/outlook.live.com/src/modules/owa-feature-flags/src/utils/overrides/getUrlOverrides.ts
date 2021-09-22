import parseOverrideString from './parseOverrideString';
import { getQueryStringParameters } from 'owa-querystring';

/**
 * Gets all overrides specified by the user within the url
 * e.g. /?override=MyFeatureFlag
 */
export default function getUrlOverrides(override: string) {
    for (const [key, value] of Object.entries(getQueryStringParameters())) {
        if (key.toLowerCase() === override.toLowerCase()) {
            return parseOverrideString(value);
        }
    }
    return {};
}
