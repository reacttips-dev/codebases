import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import type PostalAddressType from 'owa-service/lib/contract/PostalAddressType';
import type LocationSourceType from 'owa-service/lib/contract/LocationSourceType';
import type PostalAddress from 'txp-data/lib/schema/innerSchema/PostalAddress';

/**
 * Creates an EnhancedLocation from either a set of geocoordinates or a PostalAddress
 * @param txpPostalAddress contains address data
 * @param latitude latitude coordinates
 * @param longitude longiture coordinates
 * @param addressType classification of address
 * @param locationUri URI for the rich location
 * @param locationSource type of source that the address is derived from
 * @returns EnhancedLocation detailing the address
 */
export default function createEnhancedLocationFromTxpData(
    txpPostalAddress: PostalAddress,
    addressType?: PostalAddressType,
    locationUri?: string,
    locationSource?: LocationSourceType
): EnhancedLocation {
    if (txpPostalAddress) {
        return {
            PostalAddress: {
                LocationUri: locationUri,
                LocationSource: locationSource,
                Type: addressType,
                Street: txpPostalAddress.streetAddress,
                City: txpPostalAddress.addressLocality,
                State: txpPostalAddress.addressRegion,
                Country: txpPostalAddress.addressCountry,
                PostalCode: txpPostalAddress.postalCode,
                PostOfficeBox: txpPostalAddress.postOfficeBoxNumber,
                Longitude: txpPostalAddress.longitude,
                Latitude: txpPostalAddress.latitude,
            },
        };
    }
    return null;
}
