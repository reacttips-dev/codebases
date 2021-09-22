import {isObject, guardType} from "utils/typeGuards";
import {LinkEventType, EventTypes} from "models";

export const linkEventParser = (data: Partial<LinkEventType | undefined>): LinkEventType | undefined => {
    if (!isObject(data)) {
        return;
    }

    const {ageRestricted, ctaText, eventId, eventType, query, seoText, url} = data;
    return {
        ...(guardType(ageRestricted, "boolean") !== undefined && {ageRestricted}),
        ...(guardType(ctaText, "string") && {ctaText}),
        ...(guardType(eventId, "string") && {eventId}),
        eventType: guardType(eventType, "string") as EventTypes,
        ...(isObject(query) && {query: {...query}}),
        ...(guardType(seoText, "string") && {seoText}),
        ...(guardType(url, "string") && {url}),
    };
};
