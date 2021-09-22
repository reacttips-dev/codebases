import { createDefaultHeaders } from 'owa-service/lib/createDefaultHeader';

export function createRestApiRequestHeadersWithFetchOptions() {
    return createDefaultHeaders().then(headers => {
        // Add custom headers for CalendarsInternal behavior
        headers['prefer'] = 'exchange.Behavior="CalendarInternal"';
        return headers;
    });
}
