import type JsonRequestHeaders from 'owa-service/lib/contract/JsonRequestHeaders';

/**
 * Attempt to get time zone from request headers. If none are present, return
 * "UTC" as the default value.
 */
export default function getTimeZone(headers: JsonRequestHeaders) {
    if (headers?.TimeZoneContext?.TimeZoneDefinition?.Id) {
        return headers.TimeZoneContext.TimeZoneDefinition.Id;
    }

    // Default value
    return 'UTC';
}
