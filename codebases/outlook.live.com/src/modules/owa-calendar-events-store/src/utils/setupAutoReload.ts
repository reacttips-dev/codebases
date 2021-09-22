import { reload } from './reload';
import { poll } from 'owa-request-manager';

const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
/**
 * This initializes full reload polling that will happen every 24 hours.
 * This is a catch all for some stale data issues we are having due to bugs in our notifications/ notifications handling logic.
 * It that ensures that we do a full data refresh atleast once every 24 hours.
 * */
export function setupAutoReload() {
    poll(reload, 'RELOAD_CALENDAR_SUBSCRIPTIONS', TWENTY_FOUR_HOURS_IN_MS);
}
