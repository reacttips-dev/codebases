import { format } from 'owa-localize';

const FULL_DETAILS_URL_FORMAT =
    'https://www.bing.com/maps?v=2&rtp=~pos.{0}_{1}_{2}_{3}&FORM=CalLoc';
const ADDRESS_ONLY_URL_FORMAT = 'https://www.bing.com/maps?v=2&rtp=~adr.{0}_{1}&FORM=CalLoc';

/**
 * Gets the Bing directions url for a given postal address
 * @param latitude: The latitude of the place
 * @param longitude: The longitude of the place
 * @param formattedAddress: the formatted address
 * @param name: The display name of the place
 */
export default function getBingUrl(
    latitude: number | undefined,
    longitude: number | undefined,
    formattedAddress: string,
    name: string
) {
    if (latitude && longitude) {
        return format(
            FULL_DETAILS_URL_FORMAT,
            latitude.toString(),
            longitude.toString(),
            formattedAddress,
            name
        );
    }

    if (formattedAddress) {
        return format(ADDRESS_ONLY_URL_FORMAT, formattedAddress, name);
    }

    return null;
}
