import { lazyGetAndUpdateAccessToken } from 'owa-headers-refresh-token';
import {
    getOWAConnectedAccount,
    OWAConnectedAccountState,
    connectedAccountInErrorState,
} from 'owa-accounts-store';
import { isPastTime } from 'owa-observable-datetime';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import { logUsage } from 'owa-analytics';
import { now, differenceInSeconds } from 'owa-datetime';
import { trace } from 'owa-trace';

const HEADER_ANCHOR_MAILBOX: string = 'X-AnchorMailbox';
const HEADER_AUTHORIZATION: string = 'Authorization';
const HEADER_WEBSESSION_TYPE: string = 'X-OwaWebSessionType';
const HEADER_OWA_EXPLICITLOGONUSER: string = 'X-OWA-ExplicitLogonUser';

export async function getConnectedAccountHeaders(
    userIdentity: string,
    groupMailboxAddress?: string
): Promise<{ [headerName: string]: string }> {
    const headers: { [headerName: string]: string } = {};
    const account = getOWAConnectedAccount(userIdentity);

    if (account) {
        if (account.accountState == OWAConnectedAccountState.AccessRevoked) {
            return null;
        } else if (
            account.accountState == OWAConnectedAccountState.AccountDeprovisioned ||
            account.accountState == OWAConnectedAccountState.AccountNotFound
        ) {
            // show error dialog if the connnected account is in deprovisioned state. For other states, proceed with getting the token
            connectedAccountInErrorState(account.accountState, account.accountProviderType);
            return null;
        }
    }

    if (groupMailboxAddress) {
        headers[HEADER_ANCHOR_MAILBOX] = groupMailboxAddress;
        headers[HEADER_OWA_EXPLICITLOGONUSER] = groupMailboxAddress;
    } else if (account) {
        headers[HEADER_ANCHOR_MAILBOX] = account.anchorMailbox;
    }

    if (account) {
        let token = account.token;
        let isExpired = isPastTime(account.tokenExpiry);

        if (isExpired || !token) {
            logUsage(
                'getAndUpdateAccessToken',
                {
                    tokenExpiry: differenceInSeconds(account.tokenExpiry, now()),
                    isTokenExpired_1: isExpired,
                    isTokenInvalid_2: !token,
                },
                {
                    isCore: true,
                }
            );
            token = await lazyGetAndUpdateAccessToken.importAndExecute(
                account.accountId,
                userIdentity,
                token
            );
            trace.info(
                '[AccountLoadRecovery] getConnectedAccountHeaders: finished GetAndUpdateAccessToken for ' +
                    userIdentity +
                    token
            );

            if (!token) {
                // The account is already being marked as invalid in getAndUpdateRefreshToken, but the caller doesn't know about it,
                // so we will set a fake token as a token header to fail the request and log it
                token = '';
            }
        }

        let tokenString: string;
        if (account.accountProviderType == 'Outlook') {
            tokenString = `MSAuth1.0 usertoken="${token}", type="MSACT"`;
            headers[HEADER_WEBSESSION_TYPE] = WebSessionType.ExoConsumer.toString();
        } else if (
            account.accountProviderType == 'Google' ||
            account.accountProviderType == 'ICloud'
        ) {
            tokenString = `Bearer ${token}`;
            headers[HEADER_WEBSESSION_TYPE] = WebSessionType.GMail.toString();
        }

        headers[HEADER_AUTHORIZATION] = tokenString;
    }

    return headers;
}
