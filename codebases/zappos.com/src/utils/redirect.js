import marketplace from 'cfg/marketplace.json';
import { ABSOLUTE_URL_RE } from 'common/regex';
const { authUrl } = marketplace;

/**
 * Given an express request, generate a base url for redirects
 * @param  {object} req express request object
 * @return {string}     redirect base url
 */
export const baseUrl = req => `${req.protocol}://${req.get('Host')}`;

/**
 * Return the url to redirect to if the request should be redirected.
 * @param  {object}   req       express request object
 * @param  {number}   status    response status
 * @param  {string}   location  location to redirect to
 * @return {boolean}            true if redirect executed, else false
 */
export const redirectLocation = ({ req, status, location }) => {
  if (location && [301, 302].some(statusCode => statusCode === status)) {
    return location.replace('{{applicationBaseUrl}}', baseUrl(req));
  }
};

/**
 * Return a URL to ZAP with the provided redirectPath to take the user to upon successful authentication.
 * @param {String} redirectPath URL to return to upon successful authentication
 * @param {String?} authUrlPrefix optional route to ZAP
 */
export const buildAuthenticationRedirectUrl = (redirectPath, authUrlPrefix = authUrl) => {
  const isAbsoluteUrl = ABSOLUTE_URL_RE.test(redirectPath);
  return `${authUrlPrefix}${isAbsoluteUrl ? '' : '{{applicationBaseUrl}}'}${redirectPath}`;
};
