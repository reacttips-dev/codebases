import { arrayify } from 'helpers';
import { isSupportedMobileDevice } from 'helpers/UserAgentUtils';

/**
 * Returns an entry or nested entry from marketplace. Key can be either an array
 * or a string.
 * @param  {object} marketplace
 * @param  {string} key
 * @return {object}
 */
export const entry = (marketplace, key) => arrayify(key).reduce((acc, key) => acc[key], marketplace);

/**
 * Return the platform for the given marketplace.
 * @param  {string} userAgent
 * @return {string}
 */
export const platform = userAgent => (isSupportedMobileDevice(userAgent) ? 'mobile' : 'desktop');

/**
 * Platform based entry configuration
 * @param  {object} marketplace
 * @param  {string} key
 * @param  {string} userAgent
 * @return {object}
 */
export const platformConfig = (marketplace, key, userAgent) => entry(marketplace, arrayify(key, platform(userAgent)));

/**
 * Return true/false if the given subsiteId is an allowed redirect subsite for
 * the given marketplace.
 * @param  {object}  marketplace
 * @param  {number}  subsiteId
 * @param  {string}  userAgent
 * @return {Boolean}
 */
export const isAllowedPreferredSubsite = (marketplace, subsiteId, userAgent) => platformConfig(marketplace, 'preferredSubsites', userAgent).includes(parseInt(subsiteId));
