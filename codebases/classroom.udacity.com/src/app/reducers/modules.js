import Actions from 'actions';
import ReducerHelper from 'helpers/reducer-helper';

function getModuleAggregatedStates(nanodegree) {
    var aggregatedStates = ReducerHelper.getModuleAggregatedStatesForNanodegree(
        nanodegree
    );
    return _.map(aggregatedStates, (as) =>
        _.omit(as, 'lesson_aggregated_states')
    );
}

function updateModules(state, modules) {
    var update = _.reduce(
        modules,
        (memo, module) => {
            memo[module.key] = ReducerHelper.mapPropertyCollectionToKeys(
                module,
                'lessons'
            );
            return memo;
        }, {}
    );

    return ReducerHelper.merge({}, state, update);
}

function updateFromNanodegree(state, nanodegree) {
    var modules = ReducerHelper.getModulesForNanodegree(nanodegree);
    state = updateModules(state, modules);
    state = ReducerHelper.mergeAggregatedStates(
        state,
        getModuleAggregatedStates(nanodegree)
    );

    return state;
}

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.CLEAR_CONTENT:
            state = {};
            break;

        case Actions.Types.FETCH_NANODEGREE_COMPLETED:
            var nanodegree = action.payload;
            state = updateFromNanodegree(state, nanodegree);
            break;

        case Actions.Types.FETCH_ME_COMPLETED:
            const {
                nanodegrees
            } = action.payload;
            _.each(nanodegrees, (nanodegree) => {
                const modules = ReducerHelper.getModulesForNanodegree(nanodegree);
                state = updateModules(state, modules);
            });
            break;

        case Actions.Types.UPDATE_CONCEPT_COUNTS:
            const {
                moduleKey,
                lessonKey,
                lastViewedAt,
                increment
            } = action.payload;
            var module = state[moduleKey];
            if (module) {
                const updatedModule = ReducerHelper.updateAggregatedState(
                    module,
                    lessonKey,
                    lastViewedAt,
                    increment
                );
                state = { ...state,
                    [moduleKey]: updatedModule
                };
            }
            break;
    }

    return state;
}