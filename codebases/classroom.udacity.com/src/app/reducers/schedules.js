import Actions from 'actions';

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.FETCH_SCHEDULES_COMPLETED:
            {
                const newSchedules = action.payload;
                return {
                    ...state,
                    ...newSchedules,
                };
            }

        case Actions.Types.SET_SCHEDULE:
            {
                const {
                    schedule
                } = action.payload;
                return {
                    ...state,
                    ...{
                        [schedule.node_key]: schedule
                    },
                };
            }

        case Actions.Types.UPDATE_SCHEDULE_COMPLETED:
            {
                const newSchedule = _.get(action, 'payload.data');
                if (newSchedule) {
                    return {
                        ...state,
                        ...{
                            [newSchedule.node_key]: newSchedule
                        },
                    };
                }
            }

        default:
            return state;
    }
}