import getUserConfiguration from '../actions/getUserConfiguration';
import isConsumer from '../utils/isConsumer';
import { isEdu } from 'owa-nonboot-userconfiguration-manager';
import { getQueryStringParameter } from 'owa-querystring';

// milliseconds in 60 days
const THIRTY_DAYS_TIMESPAN_IN_MS = 1000 * 60 * 60 * 24 * 60;
const IS_NEWUSER_QUERY_OVERRIDE = 'isNewUser';

export function isGetStartedUser(): boolean {
    if (getQueryStringParameter(IS_NEWUSER_QUERY_OVERRIDE) === '1') {
        return true;
    }

    const userConfig = getUserConfiguration();
    const createDateString = userConfig.MailboxCreateDate;
    return (
        !!createDateString &&
        Date.now() - new Date(createDateString).getTime() < THIRTY_DAYS_TIMESPAN_IN_MS &&
        (isConsumer() || isEdu()) &&
        !userConfig.SessionSettings?.IsShadowMailbox
    );
}
