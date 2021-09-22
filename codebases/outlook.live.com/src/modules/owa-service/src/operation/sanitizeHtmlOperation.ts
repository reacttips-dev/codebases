import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';

export default function sanitizeHtmlOperation(
    req: { input: string },
    options?: RequestOptions
): Promise<string> {
    return makeServiceRequest<string>('SanitizeHtml', req, options);
}
