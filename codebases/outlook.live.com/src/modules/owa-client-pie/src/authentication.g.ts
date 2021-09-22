// This file was automatically generated from authentication.schema.d.ts
// and contains types and methods for calling PIE

import * as PIEBridge from '@microsoft/pie.sharedbridge';

export function GetPIEScriptVersion(): number {
    return 0.6;
}

export enum MailboxTypeHint {
    OFFICE365 = 'OFFICE365',
    OUTLOOKDOTCOM = 'OUTLOOKDOTCOM',
    GOOGLE = 'GOOGLE',
    YAHOO = 'YAHOO',
    ICLOUD = 'ICLOUD',
    OTHER = 'OTHER',
}

export interface RefreshTokenResponse {
    accessToken: string;
    expiresDur: number;
}

export interface AuthEmailResult {
    email: string;
    successful: boolean;
    wasPreviouslyCompleted: boolean;
    webAccountId?: string;
    accessToken?: string;
    expiresDurationSecondsSinceZero?: number;
    isAad?: boolean;
}

export interface ResourceTokenRequestParams {
    userId: string;
    resource: string;
    correlationId: string;
    wwwAuthenticateHeaderValue?: string;
    targetTenantId?: string;
}

export interface TokenResponse {
    token: string;
    expiresDur: number;
}

export interface ServiceErrorProperties {
    requestId: string;
    clientRequestId: string;
    msDiagnosticsHeader: string;
}

export interface GetAccessTokenParams {
    upn: string;
    correlationGuid: string;
}

export interface RefreshAuthTokenParams {
    email: string;
    webAccountId: string;
}

export interface GetAuthTokenForNewAccountParams {
    email: string;
    typeHint?: MailboxTypeHint;
}

export interface GetAccessTokenSilentlyParams {
    tokenRequest: ResourceTokenRequestParams;
}

export interface LogServiceErrorsParams {
    serviceErrorProperties: ServiceErrorProperties;
}

export interface UpdateProxyEmailAddressesParams {
    proxyEmailAddresses: string[];
}

export class JsonPostProcessing {
    public static ArrayOfStringValue(json: any): string[] {
        return json;
    }

    public static MailboxTypeHintValue(json: string): MailboxTypeHint {
        return json as MailboxTypeHint;
    }

    public static RefreshTokenResponseValue(json: any): RefreshTokenResponse {
        const value = json as RefreshTokenResponse;
        return value;
    }

    public static AuthEmailResultValue(json: any): AuthEmailResult {
        const value = json as AuthEmailResult;
        return value;
    }

    public static ResourceTokenRequestParamsValue(json: any): ResourceTokenRequestParams {
        const value = json as ResourceTokenRequestParams;
        return value;
    }

    public static TokenResponseValue(json: any): TokenResponse {
        const value = json as TokenResponse;
        return value;
    }

    public static ServiceErrorPropertiesValue(json: any): ServiceErrorProperties {
        const value = json as ServiceErrorProperties;
        return value;
    }

    public static GetAccessTokenParamsValue(json: any): GetAccessTokenParams {
        const value = json as GetAccessTokenParams;
        return value;
    }

    public static RefreshAuthTokenParamsValue(json: any): RefreshAuthTokenParams {
        const value = json as RefreshAuthTokenParams;
        return value;
    }

    public static GetAuthTokenForNewAccountParamsValue(json: any): GetAuthTokenForNewAccountParams {
        const value = json as GetAuthTokenForNewAccountParams;
        if (value.typeHint !== undefined) {
            value.typeHint = JsonPostProcessing.MailboxTypeHintValue(value.typeHint);
        }
        return value;
    }

    public static GetAccessTokenSilentlyParamsValue(json: any): GetAccessTokenSilentlyParams {
        const value = json as GetAccessTokenSilentlyParams;
        value.tokenRequest = JsonPostProcessing.ResourceTokenRequestParamsValue(value.tokenRequest);
        return value;
    }

    public static LogServiceErrorsParamsValue(json: any): LogServiceErrorsParams {
        const value = json as LogServiceErrorsParams;
        value.serviceErrorProperties = JsonPostProcessing.ServiceErrorPropertiesValue(
            value.serviceErrorProperties
        );
        return value;
    }

    public static UpdateProxyEmailAddressesParamsValue(json: any): UpdateProxyEmailAddressesParams {
        const value = json as UpdateProxyEmailAddressesParams;
        return value;
    }
}

export async function getAccessToken(upn: string, correlationGuid: string): Promise<string> {
    await PIEBridge.throwIfVersionIsNotSupported('Authentication', 0.1);
    const args = { upn: upn, correlationGuid: correlationGuid } as GetAccessTokenParams;
    return PIEBridge.HostBridge.invokeHost('Authentication.getAccessToken', args, undefined);
}

export async function refreshAuthToken(
    email: string,
    webAccountId: string
): Promise<RefreshTokenResponse> {
    await PIEBridge.throwIfVersionIsNotSupported('Authentication', 0.2);
    const args = { email: email, webAccountId: webAccountId } as RefreshAuthTokenParams;
    return PIEBridge.HostBridge.invokeHost(
        'Authentication.refreshAuthToken',
        args,
        JsonPostProcessing.RefreshTokenResponseValue
    );
}

export async function getInitialAccountAuthToken(): Promise<AuthEmailResult> {
    await PIEBridge.throwIfVersionIsNotSupported('Authentication', 0.4);
    return PIEBridge.HostBridge.invokeHost(
        'Authentication.getInitialAccountAuthToken',
        {},
        JsonPostProcessing.AuthEmailResultValue
    );
}

export async function getAuthTokenForNewAccount(
    email: string,
    typeHint?: MailboxTypeHint
): Promise<AuthEmailResult> {
    await PIEBridge.throwIfVersionIsNotSupported('Authentication', 0.4);
    const args = { email: email, typeHint: typeHint } as GetAuthTokenForNewAccountParams;
    return PIEBridge.HostBridge.invokeHost(
        'Authentication.getAuthTokenForNewAccount',
        args,
        JsonPostProcessing.AuthEmailResultValue
    );
}

export async function getAccessTokenSilently(
    tokenRequest: ResourceTokenRequestParams
): Promise<TokenResponse> {
    await PIEBridge.throwIfVersionIsNotSupported('Authentication', 0.3);
    const args = { tokenRequest: tokenRequest } as GetAccessTokenSilentlyParams;
    return PIEBridge.HostBridge.invokeHost(
        'Authentication.getAccessTokenSilently',
        args,
        JsonPostProcessing.TokenResponseValue
    );
}

export async function logServiceErrors(
    serviceErrorProperties: ServiceErrorProperties
): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('Authentication', 0.5);
    const args = { serviceErrorProperties: serviceErrorProperties } as LogServiceErrorsParams;
    return PIEBridge.HostBridge.invokeHost('Authentication.logServiceErrors', args, undefined);
}

export async function addNewAccountAndGetAuthToken(): Promise<AuthEmailResult> {
    await PIEBridge.throwIfVersionIsNotSupported('Authentication', 0.6);
    return PIEBridge.HostBridge.invokeHost(
        'Authentication.addNewAccountAndGetAuthToken',
        {},
        JsonPostProcessing.AuthEmailResultValue
    );
}

export async function updateProxyEmailAddresses(proxyEmailAddresses: string[]): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('Authentication', 0.6);
    const args = { proxyEmailAddresses: proxyEmailAddresses } as UpdateProxyEmailAddressesParams;
    return PIEBridge.HostBridge.invokeHost(
        'Authentication.updateProxyEmailAddresses',
        args,
        undefined
    );
}
