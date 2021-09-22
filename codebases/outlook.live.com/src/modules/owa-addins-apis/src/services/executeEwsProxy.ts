import type EwsProxyRequestParameters from 'owa-service/lib/contract/EwsProxyRequestParameters';
import type EwsProxyResponse from 'owa-service/lib/contract/EwsProxyResponse';
import executeEwsProxyOperation from 'owa-service/lib/operation/executeEwsProxyOperation';

export default function executeEwsProxy(
    body: string,
    token: string,
    extensionId: string
): Promise<EwsProxyResponse> {
    const parameters: EwsProxyRequestParameters = {
        Body: body,
        Token: token,
        ExtensionId: extensionId,
    };
    return executeEwsProxyOperation(parameters);
}
