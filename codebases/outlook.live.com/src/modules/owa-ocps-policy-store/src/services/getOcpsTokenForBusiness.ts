import { getAccessTokenforResourceAsLazy } from 'owa-tokenprovider';

const OCPSRESOURCEURI = 'https://clients.config.office.net/';

export default async function getOcpsTokenForBusiness() {
    let [token, tokenPromise] = getAccessTokenforResourceAsLazy(OCPSRESOURCEURI, 'OwaOcpsPolicy');

    if (!token) {
        token = await tokenPromise;
    }
    return token;
}
