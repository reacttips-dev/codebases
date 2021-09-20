const UiHelper = {
    State: {
        isUpdatingUser(state) {
            return state.ui.isUpdatingUser;
        },

        isFetchingMe(state) {
            return state.ui.isFetchingMe;
        },

        isFetchingNanodegree(state) {
            return state.ui.isFetchingNanodegree;
        },

        isFetchingNotificationPreferences(state) {
            return state.ui.isFetchingNotificationPreferences;
        },

        isFetchingSchedules(state) {
            return state.ui.isFetchingSchedules;
        },

        isFetchingCourse(state) {
            return state.ui.isFetchingCourse;
        },

        isFetchingLesson(state) {
            return state.ui.isFetchingLesson;
        },

        isFetchingUserBase(state) {
            return state.ui.isFetchingUserBase;
        },

        isFetchingUserGeoLocation(state) {
            return state.ui.isFetchingUserGeoLocation;
        },

        isUserBaseFetched(state) {
            return state.ui.isUserBaseFetched;
        },

        isSearchVisible(state) {
            return state.ui.isSearchVisible;
        },

        isVersionPickerVisible(state) {
            return state.ui.isVersionPickerVisible;
        },

        isResourcesSidebarVisible(state) {
            return state.ui.isResourcesSidebarVisible;
        },

        isRightSidebarVisible(state) {
            return state.ui.isResourcesSidebarVisible;
        },

        isUpdatingLanguage(state) {
            return state.ui.isUpdatingLanguage;
        },

        isFetchingBill(state) {
            return state.ui.isFetchingBill || state.ui.isFetchingSubscriptions;
        },

        isFetchingConnect(state) {
            return state.ui.isFetchingConnect;
        },

        activeNotificationPreferenceChanges(state) {
            return state.ui.activeNotificationPreferenceChanges;
        },
        isStudentHubWelcomeToolTipVisible(state) {
            return state.ui.isStudentHubWelcomeToolTipVisible;
        },
        isSettingProjectDeadlines(state) {
            return state.ui.isSettingProjectDeadlines;
        },
        isFetchingConceptCompletionHistory(state) {
            return state.ui.isFetchingConceptCompletionHistory;
        },
    },
};

export default UiHelper;