const UserHelper = {
    State: {
        getSubscribedCourses(state) {
            return state.user.courses || [];
        },

        getSubscribedNanodegrees(state) {
            return state.user.nanodegrees || [];
        },

        isAuthenticated(state) {
            return state.user.isAuthenticated;
        },

        getPredictions(state) {
            return state.user.predictions;
        },
    },
};

export default UserHelper;