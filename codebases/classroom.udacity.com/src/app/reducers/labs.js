import Actions from 'actions';
import ReducerHelper from 'helpers/reducer-helper';

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    let labs;

    switch (action.type) {
        case Actions.Types.FETCH_NANODEGREE_COMPLETED:
            const nanodegree = action.payload;

            labs = ReducerHelper.getLabsForNanodegree(nanodegree);
            state = ReducerHelper.merge({}, state, _.keyBy(labs, 'key'));
            break;

        case Actions.Types.FETCH_COURSE_COMPLETED:
            const {
                partAsCourse
            } = action.payload;
            if (partAsCourse) {
                labs = ReducerHelper.getLabsForPartAsCourse(partAsCourse);
                state = ReducerHelper.merge({}, state, _.keyBy(labs, 'key'));
            }
            break;

        case Actions.Types.UPDATE_LAB_RESULT_COMPLETED:
            const labResult = action.payload;
            const labKey = _.chain(state)
                .find({
                    id: labResult.lab_id
                })
                .get('key')
                .value();

            state = ReducerHelper.merge({}, state, {
                [labKey]: {
                    result: _.omit(labResult, 'lab_id')
                },
            });
            break;

        case Actions.Types.FETCH_LAB_COMPLETED:
            var lab = action.payload;

            state = ReducerHelper.merge({}, state, {
                [lab.key]: lab
            });
            break;
    }

    return state;
}