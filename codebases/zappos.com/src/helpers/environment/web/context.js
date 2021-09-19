/**
 * In the web environment
 */
// in web we have no guid, and we just want to expose the same shell/mock api as node's environment/context file (no guid, standard logging)
// if you add exports here you also need to do so for the node version.
import { guid } from 'helpers/guid';
import log, { logDebug, logError } from 'middleware/logger';
export const logger = {
  log: msg => log(msg),
  debug: msg => logDebug(msg),
  error: msg => logError(msg)
};

// client side we never have a guid
export const getRequestGuid = () => guid();
