import Actions from 'actions';
import ReducerHelper from 'helpers/reducer-helper';

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.CLEAR_CONTENT:
            state = {};
            break;

        case Actions.Types.FETCH_LESSON_COMPLETED:
            const lesson = action.payload;
            const atoms = ReducerHelper.getAtomsForLesson(lesson);
            state = ReducerHelper.merge({}, state, _.keyBy(atoms, 'key'));
            break;

        case Actions.Types.UPDATE_UNSTRUCTURED_DATA_COMPLETED:
            const {
                user_state
            } = action.payload;
            state = _.merge({}, state, {
                [user_state.node_key]: {
                    user_state
                }
            });
            break;
    }

    return state;
}