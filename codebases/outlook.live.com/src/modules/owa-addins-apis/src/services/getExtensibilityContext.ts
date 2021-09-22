import type ExtensibilityContext from 'owa-service/lib/contract/ExtensibilityContext';
import type FormFactor from 'owa-service/lib/contract/FormFactor';
import getExtensibilityContextOperation from 'owa-service/lib/operation/getExtensibilityContextOperation';
import type GetExtensibilityContextParameters from 'owa-service/lib/contract/GetExtensibilityContextParameters';

export default function getExtensibilityContext(
    formFactor: FormFactor,
    clientLanguage: string,
    includeDisabledExtensions: boolean,
    apiVersionSupported: string,
    clientOverrideVersion: string
): Promise<ExtensibilityContext> {
    const parameters: GetExtensibilityContextParameters = {
        FormFactor: formFactor,
        ClientLanguage: clientLanguage,
        IncludeDisabledExtensions: includeDisabledExtensions,
        ApiVersionSupported: apiVersionSupported,
        ClientOverrideVersion: clientOverrideVersion,
    };

    return getExtensibilityContextOperation({ request: parameters });
}
