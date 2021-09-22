import { errorActiontype } from "../../actions";
import { Error } from "../../errors";
import { LOCATION_CHANGE } from "react-router-redux";

export interface ErrorState {
    error: Error;
    shouldDisplay: boolean;
    statusCode: number;
}

export const initialErrorState: ErrorState = {
    error: null,
    shouldDisplay: false,
    statusCode: null,
};

export const errors = (state = initialErrorState, action): ErrorState => {

    switch (action.type) {
        case errorActiontype.error:
            return Object.assign({}, state,
                { error: action.error, shouldDisplay: action.shouldDisplay, statusCode: action.statusCode });
        case LOCATION_CHANGE:
            return initialErrorState;
        default:
            return state;
    }
};

export default errors;
