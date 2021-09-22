import * as trace from '../utils/trace';

export default function handleResponse(e: FetchEvent, response: Response | undefined) {
    // if we have no response then fetch from server
    if (!response) {
        return self.fetch(e.request);
    }

    if (!response.headers) {
        trace.log(`No headers for ${e.request.url}`);
        return self.fetch(e.request);
    }

    const headerDateString = response.headers.get('date');
    // if there is no date header, then we have nothing to verify the expiration time,
    // so let's just always fetch from the server
    if (!headerDateString) {
        trace.log(`No date header for ${e.request.url}`);
        return self.fetch(e.request);
    }

    const headerDate = new Date(headerDateString);
    const expiryTime = headerDate.setDate(headerDate.getDate() + 30);

    // if the current time is newer than the expiry time, let's fetch
    // from the server to get a newer version
    if (Date.now() > expiryTime) {
        trace.log(`Date header is expired for ${e.request.url}`);
        return self.fetch(e.request);
    }

    trace.log(
        `Cache hit ${e.request.mode == 'navigate' ? 'navigate ' : ''}${response.url} from cache.`
    );
    if (e.request.url.indexOf('analytics-ping.js') == -1) {
        return response;
    }

    // we only want to add this header for the analytics-ping file
    const newHeaders = new Headers(response.headers);
    newHeaders.append('x-sw-active-cache', '1');
    // When creating a new response, we want to make sure that we pass in a string
    // as the body instead of a stream because some older browsers like Chrome 49
    // do not read from the stream but instead call toString on the stream
    return new Response('/* From ServiceWorker */', {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
}
