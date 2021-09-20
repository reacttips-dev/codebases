import Actions from 'actions';
import ReducerHelper from 'helpers/reducer-helper';

function getPartAggregatedStates(nanodegree) {
    var aggregatedStates = ReducerHelper.getPartAggregatedStatesForNanodegree(
        nanodegree
    );
    return _.map(aggregatedStates, (as) =>
        _.omit(as, 'module_aggregated_states')
    );
}

function updateParts(state, parts) {
    if (!parts || parts.length === 0) {
        return state;
    }

    var update = _.reduce(
        parts,
        (memo, part) => {
            var reducedPart = ReducerHelper.mapPropertyCollectionToKeys(
                part,
                'modules'
            );
            reducedPart = ReducerHelper.mapPropertiesToKeys(reducedPart, 'project');
            memo[reducedPart.key] = reducedPart;
            return memo;
        }, {}
    );

    return ReducerHelper.merge({}, state, update);
}

function updateFromNanodegree(state, nanodegree) {
    var parts = ReducerHelper.getPartsForNanodegree(nanodegree);
    state = updateParts(state, parts);
    state = ReducerHelper.mergeAggregatedStates(
        state,
        getPartAggregatedStates(nanodegree)
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
            {
                var nanodegree = action.payload;
                state = updateFromNanodegree(state, nanodegree);
                break;
            }

        case Actions.Types.FETCH_ME_COMPLETED:
            {
                const {
                    nanodegrees
                } = action.payload;
                _.each(nanodegrees, (nanodegree) => {
                    const parts = ReducerHelper.getPartsForNanodegree(nanodegree);
                    state = updateParts(state, parts);
                });
                break;
            }

        case Actions.Types.UPDATE_CONCEPT_COUNTS:
            {
                const {
                    partKey,
                    moduleKey,
                    lastViewedAt,
                    increment
                } = action.payload;
                var part = state[partKey];
                if (part) {
                    const updatedPart = ReducerHelper.updateAggregatedState(
                        part,
                        moduleKey,
                        lastViewedAt,
                        increment
                    );
                    state = { ...state,
                        [partKey]: updatedPart
                    };
                }
                break;
            }
    }

    return state;
}