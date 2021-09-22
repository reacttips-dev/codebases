import type PersonaPostalAddress from 'owa-service/lib/contract/PersonaPostalAddress';

export default function isEnhancedLocation(location: PersonaPostalAddress): boolean {
    if (!location) {
        return false;
    }

    if (location.LocationUri) {
        return true;
    }

    if (location.Latitude && location.Longitude) {
        return true;
    }

    return false;
}
