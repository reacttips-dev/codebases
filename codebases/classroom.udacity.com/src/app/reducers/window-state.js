import Actions from 'actions';
import {
    WINDOW_EVENTS
} from 'constants/window-state';

const initialState = {
    windowState: WINDOW_EVENTS.FOCUS,
};

export default function(state = initialState, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.WINDOW_BLUR:
        case Actions.Types.WINDOW_FOCUS:
            const windowState = action.payload.event;
            state = {
                windowState
            };
            break;
    }

    return state;
}