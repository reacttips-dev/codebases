export enum LocationType {
    Room = 'room',
    Custom = 'custom',
}

export interface LocationIdentifier {
    id: string;
    type: LocationType;
}

export default interface LocationDetails {
    displayName: string;
    emailAddress?: string;
    locationIdentifier: LocationIdentifier;
}

export interface AddRemoveEnhancedLocationsArgs {
    enhancedLocations: LocationIdentifier[];
}
