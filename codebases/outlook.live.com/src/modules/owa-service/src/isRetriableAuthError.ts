import { HttpStatusCode } from './HttpStatusCode';
import { getConfig } from './config';

export default function isRetriableAuthError(status: number): boolean {
    return (
        !!getConfig().getAuthToken &&
        (status == HttpStatusCode.Unauthorized || status == HttpStatusCode.SessionTimeout)
    );
}
