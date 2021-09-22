import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import { containsRoomWithEmail } from 'owa-location-persona/lib/utils/areEnhancedLocationsEqual';
import { createEnhancedLocationFromRoomInfo, isEnhancedLocation } from 'owa-location-persona';

export default function intitializeLocations(calendarItem: CalendarItem) {
    // server bug is https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/46946
    // Locations array can contain null locations, we should filter those
    if (!calendarItem.Locations) {
        calendarItem.Locations = [];
    } else {
        calendarItem.Locations = calendarItem.Locations.filter(location => location);
    }

    // When rooms are added from legacy clients, the room is not added to the Locations collection it is added to the resources collection.
    // Instead Locations can contain a string location that is the display name of the room.
    // This is a client work around to initialize location collection from resources collection.
    // server bug is https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/46946

    if (calendarItem.Resources) {
        calendarItem.Resources.map(resource => {
            if (!containsRoomWithEmail(calendarItem.Locations, resource.Mailbox.EmailAddress)) {
                // remove string locations (and only strings) that have the same display name as the room
                calendarItem.Locations = calendarItem.Locations.filter(location => {
                    return (
                        location.DisplayName !== resource.Mailbox.Name ||
                        isEnhancedLocation(location.PostalAddress)
                    );
                });

                calendarItem.Locations.push(
                    createEnhancedLocationFromRoomInfo(
                        resource.Mailbox.Name,
                        resource.Mailbox.EmailAddress
                    )
                );
            }
        });
    }
}
