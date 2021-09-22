import { UPDATE_COUNT } from "help-widget/store/actionTypes";

interface IRetainCountState {
    count: number;
    previousCount: number | undefined;
}

const initialState: IRetainCountState = {
    count: 0,
    previousCount: undefined,
};

export const retainCount = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_COUNT: {
            const count = state.count + action.payload;

            return {
                ...state,
                count: count >= 0 ? count : 0,
                previousCount: state.count,
            } as IRetainCountState;
        }

        default:
            return state;
    }
};
