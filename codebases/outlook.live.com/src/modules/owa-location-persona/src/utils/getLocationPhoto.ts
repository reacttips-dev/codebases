import { format, getCurrentCulture } from 'owa-localize';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import { makeGetRequest } from 'owa-ows-gateway';
import { isSuccessStatusCode } from 'owa-http-status-codes';

const defaultPhotoWidth = 290;
const defaultPhotoHeight = 135;

/**
 * Download the persona map for the specified place
 */
export default function getLocationPhoto(
    latitude: number | undefined,
    longitude: number | undefined,
    address: string,
    onCompleteDownload: (blobUrl: string) => void,
    width?: number,
    height?: number
) {
    width = width || defaultPhotoWidth;
    height = height || defaultPhotoHeight;
    const userConfiguration = getUserConfiguration();

    // Bing Url requires either address or both latitude and longtide
    if (
        (isNullOrWhiteSpace(address) && (!latitude || !longitude)) ||
        !userConfiguration.PolicySettings.PlacesEnabled
    ) {
        onCompleteDownload('');
    } else {
        var requestUrl = format(
            '/OWS/beta/Location/locationmap?Latitude={0}&Longitude={1}&Address={2}&Culture={3}&Width={4}&Height={5}',
            latitude && latitude.toString(),
            longitude && longitude.toString(),
            encodeURIComponent(address),
            getCurrentCulture(),
            width,
            height
        );
        makeGetRequest(requestUrl, undefined, true).then(response => {
            if (isSuccessStatusCode(response.status)) {
                response.json().then(locationMap => {
                    // read ImageBytes from locationMap response object
                    onCompleteDownload(`data:image/png;base64,${locationMap.ib}`);
                });
            } else {
                onCompleteDownload('');
            }
        });
    }
}
