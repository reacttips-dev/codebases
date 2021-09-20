import Connect from './connect';
import DowntimeNotification from './downtime';
import Login from './login';
import ScheduledMaintenance from './scheduled-maintenance';
import SpeakerSeries from './speaker-series';

const LOGIN_KEY = 'login';
const SCHEDULED_MAINTENANCE_KEY = 'scheduled-maintenance';

/* Ordered list of notifications to show, in descending priority */
const NOTIFICATIONS = [{
        key: LOGIN_KEY,
        component: Login,
        isAvailable: (isAuthenticated) => !isAuthenticated,
    },
    {
        key: 'closed-captioning-unavailable',
        component: DowntimeNotification,
        isAvailable: () => false,
    },
    {
        key: SCHEDULED_MAINTENANCE_KEY,
        component: ScheduledMaintenance,
        isAvailable: (_, isMaintenanceScheduled) => isMaintenanceScheduled,
    },
    {
        key: 'connect',
        component: Connect,
        isAvailable: () => false,
        //isAvailable: (_, isConnectStudent) => i18n.shouldShowConnectAd() && !isConnectStudent
        // temporarily removing this ad until we can fix visibility on a per ND basis
        // this is different from the 'isConnectAvailable' function because it
        // uses regionName, which is less reliable than countryCode, so to ensure
        // that users can sign up for connect, we elect to allow any user in
        // the country to access connect adder cards and modals, but only show the
        // notification mustache to those in the appropriate region so as not to
        // overexpose.
    },
    {
        key: 'speaker-series-eric-darnell',
        component: SpeakerSeries,
        isAvailable: () => false,
    },
];

export default {
    getFirstUnread(
        isAuthenticated,
        maintenanceBannerNotification,
        studentCanSeeNotifications
    ) {
        return _.find(NOTIFICATIONS, (n) => {
            const isUnread = !this.isRead(
                n.key,
                maintenanceBannerNotification.message
            );
            const isAvailable = n.isAvailable(
                isAuthenticated,
                maintenanceBannerNotification.isEnabled
            );
            if (!isUnread || !isAvailable) {
                return false;
            }
            // override studentCanSeeNotifications if maintenance banner is to be shown
            return n.key === SCHEDULED_MAINTENANCE_KEY || studentCanSeeNotifications;
        });
    },

    isRead(key, message = '') {
        const processedKey = this._getKey(key);
        const value = localStorage.getItem(processedKey);

        if (key === SCHEDULED_MAINTENANCE_KEY) {
            return value === message;
        } else {
            return (value || false) && JSON.parse(value);
        }
    },

    setRead(key, isRead, message = '') {
        const processedKey = this._getKey(key);

        try {
            if (key === SCHEDULED_MAINTENANCE_KEY) {
                localStorage.setItem(processedKey, message);
            } else {
                localStorage.setItem(processedKey, isRead);
            }
        } catch (e) {
            // do nothing
        }
    },

    _getKey(key) {
        return `_notification-${key}-read`;
    },
};