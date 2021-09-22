// eslint-disable-next-line node/no-deprecated-api
import { resolve as urlResolve } from 'url';
import { getPackageBaseUrl } from 'owa-config/lib/bootstrapOptions';

export default function getOwaResourceUrl(partialUrl: string) {
    return urlResolve(getPackageBaseUrl(), partialUrl);
}
