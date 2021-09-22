/**
 * @module getActionableMessageLogger
 */

import { getLogger } from '../AriaWrapper';

/**
 * @function
 * A method which returns logger for Actionable Message analytics
 * @returns A logger for ACtionable Message analytics
 */

const getActionableMessageLogger = () => {
    const tenantToken =
        '9980fa6132c64747a15beb0e0aa15ac2-3feb1de1-bcba-46f3-8a3b-cd114ae58e62-7055';
    return getLogger(tenantToken);
};

export default getActionableMessageLogger;
