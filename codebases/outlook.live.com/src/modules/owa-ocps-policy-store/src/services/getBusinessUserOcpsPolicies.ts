import { getGuid } from 'owa-guid';
import getOcpsTokenForBusiness from './getOcpsTokenForBusiness';

const GETOCPSPOLICYENDPOINT = 'https://clients.config.office.net/user/v1.0/web/policies';

export default async function getBusinessUserOcpsPolicies(): Promise<Response> {
    let token = await getOcpsTokenForBusiness();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('x-Cid', getGuid());

    let requestInit: RequestInit = {
        method: 'GET',
    };

    requestInit.headers = headers;

    return fetch(GETOCPSPOLICYENDPOINT, requestInit);
}
