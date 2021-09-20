import Actions from 'actions';

const defaultState = {
    notificationsPausedCounter: 0,
    activeCustomNotifications: [],
    maintenanceBanner: {
        isEnabled: false,
        message: '',
    },
};

function displayNotification(state, {
    notificationId
}) {
    return {
        ...state,
        activeCustomNotifications: state.activeCustomNotifications.concat([
            notificationId,
        ]),
    };
}

function dismissNotification(state, {
    notificationId
}) {
    return {
        ...state,
        activeCustomNotifications: _.without(
            state.activeCustomNotifications,
            notificationId
        ),
    };
}

export default function(state = defaultState, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.PAUSE_NOTIFICATIONS:
            state = {
                ...state,
                notificationsPausedCounter: state.notificationsPausedCounter + 1,
            };
            break;
        case Actions.Types.RESUME_NOTIFICATIONS:
            state = {
                ...state,
                notificationsPausedCounter: Math.max(
                    0,
                    state.notificationsPausedCounter - 1
                ),
            };
            break;
        case Actions.Types.DISPLAY_CUSTOM_NOTIFICATION:
            state = displayNotification(state, action.payload);
            break;
        case Actions.Types.DISMISS_CUSTOM_NOTIFICATION:
            state = dismissNotification(state, action.payload);
            break;
        case Actions.Types.FETCH_SCHEDULED_MAINTENANCE_COMPLETED:
            state = {
                ...state,
                maintenanceBanner: action.payload,
            };
            break;
    }

    return state;
}