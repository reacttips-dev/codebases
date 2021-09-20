import Actions from 'actions';
import AuthenticationService from 'services/authentication-service';

const initialState = {
    isAuthenticated: AuthenticationService.isAuthenticated(),
    courses: [],
    applications: [],
    predictions: [],
};

export default function(state = initialState, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.AUTHENTICATION_COMPLETED:
            state = {
                ...state,
                isAuthenticated: AuthenticationService.isAuthenticated(),
            };
            break;

        case Actions.Types.FETCH_APPLICATIONS_COMPLETED:
            let applications = action.payload;
            state = {
                ...state,
                applications,
            };
            break;

        case Actions.Types.FETCH_PREDICTIONS_COMPLETED:
            state = {
                ...state,
                predictions: action.payload,
            };
            break;
    }

    return state;
}