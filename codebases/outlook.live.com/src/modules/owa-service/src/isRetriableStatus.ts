import { HttpStatusCode } from './HttpStatusCode';
import isRetriableAuthError from './isRetriableAuthError';

export default function isRetriableStatus(status: number): boolean {
    return (
        status == HttpStatusCode.RetryWith ||
        status == HttpStatusCode.RequestTimeout ||
        status == HttpStatusCode.BadGateway ||
        status < HttpStatusCode.Continue ||
        status > HttpStatusCode.LastValidStatusCode ||
        isRetriableAuthError(status)
    );
}
