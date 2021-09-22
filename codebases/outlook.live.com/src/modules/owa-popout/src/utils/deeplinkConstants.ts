import getBasePath from 'owa-url/lib/getBasePath';

const DEEPLINK_PATH = 'deeplink';

export const MAIL_ROUTE = 'mail';
export const CALENDAR_ROUTE = 'calendar';

export const COMPOSE_ROUTE = 'compose';

export const MAIL_READ_ROUTE = 'read';
export const GROUP_READ_ROUTE = 'group';

// $REVIEW(jdferre): Copied from PopoutContainer. Not sure why getMailPath wouldn't work. Will follow up.
export const MAIL_DEEPLINK_URL_BASE =
    '/' + [MAIL_ROUTE, ...getBasePath().split('/').slice(1)].join('/') + DEEPLINK_PATH + '/';
export const CALENDAR_DEEPLINK_URL_BASE =
    '/' + [CALENDAR_ROUTE, ...getBasePath().split('/').slice(1)].join('/') + DEEPLINK_PATH + '/';
