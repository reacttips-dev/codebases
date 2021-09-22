import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';

export default function getEventLocationDetailsForTelemetry(event: CalendarEvent) {
    const locationDetails = {
        containsLocation: false,
        containsRichLocation: false,
    };
    event.Locations?.forEach(location => {
        locationDetails.containsLocation = true;
        if (
            location.PostalAddress?.Latitude != undefined &&
            location.PostalAddress?.Longitude != undefined
        ) {
            locationDetails.containsRichLocation = true;
        }
    });
    return locationDetails;
}
