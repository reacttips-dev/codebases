export interface TokenAsyncResult {
    wasSuccessful: boolean;
    token: string;
}

export function createTokenAsyncResult(wasSuccessful: boolean, token: string): TokenAsyncResult {
    return { wasSuccessful, token };
}
