import { refreshConnectedAccountAccessToken } from '../services/refreshConnectedAccountAccessToken';
import type { GetAccessTokenResponse } from '../contracts/ConnectedAccountResponse';
import type { FullErrorResponse } from '../contracts/ErrorResponse';

export function getAccessToken(id: string): Promise<GetAccessTokenResponse | FullErrorResponse> {
    return refreshConnectedAccountAccessToken(id);
}
