import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';

/**
 * Creates an enhanced location from room Info
 */
export function createEnhancedLocationFromRoomInfo(
    name: string,
    emailAddress: string
): EnhancedLocation {
    return {
        Id: emailAddress,
        DisplayName: name,
        PostalAddress: {
            LocationSource: 'Resource',
            LocationUri: emailAddress,
            Type: 'Business',
        },
    } as EnhancedLocation;
}
