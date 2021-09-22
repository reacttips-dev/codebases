import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type NavBarData from '../contract/NavBarData';

export default function getBposShellInfoNavBarDataOperation(
    options?: RequestOptions
): Promise<NavBarData> {
    return makeServiceRequest<NavBarData>('GetBposShellInfoNavBarData', {}, options);
}
