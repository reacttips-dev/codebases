import { fetchOpts } from 'apis/mafia';
import timedFetch from 'middleware/timedFetch';
import { Cookies } from 'types/cookies';
import { CloudReviewParams, CloudReviewProductSummary } from 'types/cloudReviews';
import { fetchErrorMiddlewareAllowedErrors } from 'middleware/fetchErrorMiddleware';

/** Submit a user review without media. */
export async function submitReview(cloudReviewsUrl: string, credentials: Cookies, params: CloudReviewParams, fetcher = timedFetch('submitReview')): Promise<Response<{ reviewId: string }>> {
  const url = `${cloudReviewsUrl}/accountapi/n/cloudreviews/v1/submit`;
  const optsPlusMafiaAuthOpts = fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  }, credentials);
  return fetcher(url, optsPlusMafiaAuthOpts);
}

interface SubmitMediaResponse {
  hashValue: string;
  mediaType: string;
}

/** Upload user media. */
export async function submitMedia(cloudReviewsUrl: string, credentials: Cookies, params: CloudReviewParams, fetcher = timedFetch('submitMedia')): Promise<Response<SubmitMediaResponse[]>> {
  const url = `${cloudReviewsUrl}/v1/media`;
  const optsPlusMafiaAuthOpts = fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  }, credentials);
  return fetcher(url, optsPlusMafiaAuthOpts);
}

/** Upvote a review. */
export async function upvoteReview(cloudReviewsUrl: string, credentials: Cookies, reviewId: string, fetcher = timedFetch('upvoteReview')): Promise<Response<{}>> {
  const url = `${cloudReviewsUrl}/accountapi/n/cloudreviews/v1/upvote`;
  const optsPlusMafiaAuthOpts = fetchOpts({
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviewId })
  }, credentials);
  return fetcher(url, optsPlusMafiaAuthOpts);
}

export async function getProductReviewSummary(cloudReviewsUrl: string, credentials: Cookies, productIds: string | string[], fetcher: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response<CloudReviewProductSummary[]>> = timedFetch('getProductReviewSummary') as any): Promise<CloudReviewProductSummary[]> {
  const url = `${cloudReviewsUrl}/accountapi/n/cloudreviews/v1/reviewSummary?productIds=${[productIds].flat().join(',')}`;
  const optsPlusMafiaAuthOpts = fetchOpts({
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  }, credentials);
  return fetcher(url, optsPlusMafiaAuthOpts).then(fetchErrorMiddlewareAllowedErrors([403, 404]));
}
