const NotificationPreferencesHelper = {
    State: {
        isLoading(state) {
            return state.notificationPreferences.loading;
        },

        preferences(state) {
            return state.notificationPreferences.preferences;
        },
    },
};

export default NotificationPreferencesHelper;