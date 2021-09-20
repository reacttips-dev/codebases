import Actions from 'actions';
import ActivityHelper from 'helpers/activity-helper';

const initialState = {
    conceptCompletionDatesByNdKey: {},
};

export default function(state = initialState, action) {
    const {
        error,
        payload,
        type
    } = action;
    if (error || !payload) {
        return state;
    }

    switch (type) {
        case Actions.Types.FETCH_CONCEPT_COMPLETION_HISTORY_COMPLETED:
            {
                const completionDates = ActivityHelper.conceptCompletionDatesFromNanodegree(
                    payload
                );
                return {
                    ...state,
                    conceptCompletionDatesByNdKey: {
                        ...state.conceptCompletionDatesByNdKey,
                        [payload.key]: completionDates,
                    },
                };
            }
    }

    return state;
}