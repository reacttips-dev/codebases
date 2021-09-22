import { DefaultFetchService } from "../../services/fetchService";

const validateWidget = (widget) => !widget.durationObject.raw.isCustom;
const url = (id) => `/api/userdata/dashboards/${id}/subscriptions`;

export default {
    isSubscriptionOn: (dashboard) => dashboard.isSubscribedToNotifications,
    isNotificationAllowed: (dashboard) => {
        if (!dashboard.widgets.length) {
            return false;
        } else return dashboard.widgets.some(validateWidget);
    },
    subscribeToNotification: (id) => {
        return DefaultFetchService.getInstance().post(url(id), {});
    },
    unsubscribeToNotification: (id) => {
        return DefaultFetchService.getInstance().delete(url(id), {});
    },
};
