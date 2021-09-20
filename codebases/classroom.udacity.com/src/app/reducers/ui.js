import Actions from 'actions';
import {
    combineReducers
} from 'redux';
import update from 'immutability-helper';

export function createProcessReducer(
    startAction,
    stopAction,
    initialState = false
) {
    return (state = initialState, action) => {
        if (action.type === startAction) {
            return true;
        } else if (action.type === stopAction) {
            return false;
        } else {
            return state;
        }
    };
}

export function createFlagReducer(flagAction) {
    return (state = false, action) => action.type === flagAction || state;
}

export function activeNotificationPreferenceChanges(state = [], action) {
    switch (action.type) {
        case Actions.Types.UPDATE_NOTIFICATION_PREFERENCES:
            return update(state, {
                $push: action.payload
            });

        case Actions.Types.UPDATE_NOTIFICATION_PREFERENCES_COMPLETED:
            {
                return _.reduce(
                    action.payload.categories,
                    (state, category) => {
                        const idx = _.indexOf(state, category);
                        return idx >= 0 ? update(state, {
                            $splice: [
                                [idx, 1]
                            ]
                        }) : state;
                    },
                    state
                );
            }

        default:
            return state;
    }
}

export function isSearchVisible(state = false, action) {
    switch (action.type) {
        case Actions.Types.SHOW_SEARCH:
            return true;

        case Actions.Types.HIDE_SEARCH:
            return false;

        case Actions.Types.TOGGLE_SEARCH:
            return !state;

        default:
            return state;
    }
}

export function isVersionPickerVisible(state = false, action) {
    switch (action.type) {
        case Actions.Types.SHOW_VERSION_PICKER:
            return true;

        case Actions.Types.HIDE_VERSION_PICKER:
            return false;

        default:
            return state;
    }
}

export function isResourcesSidebarVisible(state = false, action) {
    switch (action.type) {
        case Actions.Types.TOGGLE_RESOURCES_SIDEBAR:
            return !state;

        case Actions.Types.FETCH_LESSON:
            return false;

        default:
            return state;
    }
}

export function isStudentHubWelcomeToolTipVisible(state = false, action) {
    switch (action.type) {
        case Actions.Types.SET_STUDENT_HUB_TOOLTIP:
            return true;

        case Actions.Types.DISMISS_STUDENT_HUB_TOOLTIP:
            return false;

        default:
            return state;
    }
}

export default combineReducers({
    activeNotificationPreferenceChanges,
    isFetchingBill: createProcessReducer(
        Actions.Types.FETCH_BILL,
        Actions.Types.FETCH_BILL_COMPLETED
    ),
    isFetchingConnect: createProcessReducer(
        Actions.Types.FETCH_CONNECT_ENROLLMENT,
        Actions.Types.FETCH_CONNECT_ENROLLMENT_COMPLETED
    ),
    isFetchingCourse: createProcessReducer(
        Actions.Types.FETCH_COURSE,
        Actions.Types.FETCH_COURSE_COMPLETED
    ),
    isFetchingLesson: createProcessReducer(
        Actions.Types.FETCH_LESSON,
        Actions.Types.FETCH_LESSON_COMPLETED
    ),
    isFetchingMe: createProcessReducer(
        Actions.Types.FETCH_ME,
        Actions.Types.FETCH_ME_COMPLETED
    ),
    isFetchingNanodegree: createProcessReducer(
        Actions.Types.FETCH_NANODEGREE,
        Actions.Types.FETCH_NANODEGREE_COMPLETED
    ),
    isFetchingNotificationPreferences: createProcessReducer(
        Actions.Types.FETCH_NOTIFICATION_PREFERENCES,
        Actions.Types.FETCH_NOTIFICATION_PREFERENCES_COMPLETED
    ),
    isFetchingSchedules: createProcessReducer(
        Actions.Types.FETCH_SCHEDULES,
        Actions.Types.FETCH_SCHEDULES_COMPLETED
    ),
    isFetchingSubscriptions: createProcessReducer(
        Actions.Types.FETCH_SUBSCRIBED_NANODEGREES,
        Actions.Types.FETCH_SUBSCRIBED_NANODEGREES_COMPLETED
    ),
    isFetchingUserBase: createProcessReducer(
        Actions.Types.FETCH_USER_BASE,
        Actions.Types.FETCH_USER_BASE_COMPLETED
    ),
    isFetchingUserGeoLocation: createProcessReducer(
        Actions.Types.FETCH_USER_GEO_LOCATION,
        Actions.Types.FETCH_USER_GEO_LOCATION_COMPLETED
    ),
    isResourcesSidebarVisible,
    isSearchVisible,
    isVersionPickerVisible,
    isStudentHubWelcomeToolTipVisible,
    isUpdatingLanguage: createProcessReducer(
        Actions.Types.UPDATE_LANGUAGE,
        Actions.Types.UPDATE_LANGUAGE_COMPLETED
    ),
    isUpdatingUser: createProcessReducer(
        Actions.Types.UPDATE_USER,
        Actions.Types.UPDATE_USER_COMPLETED
    ),
    isUserBaseFetched: createFlagReducer(Actions.Types.FETCH_USER_BASE_COMPLETED),
    isSettingProjectDeadlines: createProcessReducer(
        Actions.Types.SET_PROJECT_DEADLINES,
        Actions.Types.SET_PROJECT_DEADLINES_COMPLETED
    ),
    isFetchingConceptCompletionHistory: createProcessReducer(
        Actions.Types.FETCH_CONCEPT_COMPLETION_HISTORY,
        Actions.Types.FETCH_CONCEPT_COMPLETION_HISTORY_COMPLETED
    ),
});