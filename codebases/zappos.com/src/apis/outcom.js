import timedFetch from 'middleware/timedFetch';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';

// TODO: I think we eventually may want this in mafia slotz or to use Ashish's endpoint
export function getIpRestricted(fetcher = timedFetch('getIpRestricted')) {
  return fetcher('https://dohtecive0.execute-api.us-east-1.amazonaws.com/prod/authorize', { method: 'GET', mode: 'cors' })
    .then(fetchErrorMiddleware);
}
