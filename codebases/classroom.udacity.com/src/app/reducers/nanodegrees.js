import Actions from 'actions';
import ProjectsHelper from 'helpers/projects-helper';
import ReducerHelper from 'helpers/reducer-helper';

function updateNanodegrees(state, nanodegrees) {
    var update = _.reduce(
        nanodegrees,
        (memo, nanodegree) => {
            var nanodegreeToMemoize;
            if (nanodegree.parts) {
                nanodegreeToMemoize = ReducerHelper.mapPropertyCollectionToKeys(
                    nanodegree,
                    'parts'
                );
            } else {
                nanodegreeToMemoize = nanodegree;
            }
            memo[nanodegree.key] = _.omit(nanodegreeToMemoize, 'aggregated_state');
            return memo;
        }, {}
    );

    return ReducerHelper.merge({}, state, update);
}

function getAggregatedState(nanodegree) {
    var aggregatedState = ReducerHelper.getAggregatedStateForNanodegree(
        nanodegree
    );
    return _.omit(aggregatedState, 'part_aggregated_states');
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
            state = updateNanodegrees(state, [nanodegree]);
            state = ReducerHelper.mergeAggregatedStates(state, [
                getAggregatedState(nanodegree),
            ]);
            state = {
                ...state,
                [nanodegree.key]: {
                    ...state[nanodegree.key],
                    cloudResources: null,
                },
            };
            break;

        case Actions.Types.FETCH_NANODEGREE_PROJECT_STATES_COMPLETED:
            var nanodegree = action.payload;
            nanodegree = {
                key: nanodegree.key,
                projects: ProjectsHelper.getProjectStates(nanodegree),
            };
            state = updateNanodegrees(state, [nanodegree]);
            break;

        case Actions.Types.FETCH_SUBSCRIBED_NANODEGREES_COMPLETED:
            var nanodegrees = action.payload;
            _.each(nanodegrees, (nanodegree) => {
                nanodegree.projects = ProjectsHelper.getProjectStates(nanodegree);
            });
            state = updateNanodegrees(state, nanodegrees);

            break;

        case Actions.Types.FETCH_DEFAULT_NANODEGREES_COMPLETED:
            var defaultNanodegrees = action.payload;

            _.each(defaultNanodegrees, (defaultNanodegree) => {
                let nanodegree = state[defaultNanodegree.key];
                nanodegree.default_version = defaultNanodegree;
                nanodegree.default_version.projects = ProjectsHelper.getProjects(
                    nanodegree.default_version
                );
                nanodegree.default_version.projectsLostInNewVersion = ProjectsHelper.findCompletedProjectsNotInList(
                    nanodegree.projects,
                    nanodegree.default_version.projects
                );
                state = updateNanodegrees(state, [nanodegree]);
            });
            return state;

        case Actions.Types.FETCH_ME_COMPLETED:
            var {
                nanodegrees
            } = action.payload;
            var all = _.compact(nanodegrees);

            state = updateNanodegrees(state, all);
            break;

        case Actions.Types.UPDATE_NANODEGREE_LAST_VIEWED_AT_COMPLETED:
            var {
                user_state
            } = action.payload;
            if (user_state) {
                state = ReducerHelper.mergeUserState(state, user_state);
            }
            break;

        case Actions.Types.UPDATE_CONCEPT_COUNTS:
            const {
                nanodegreeKey,
                partKey,
                lastViewedAt,
                increment,
            } = action.payload;
            var nanodegree = state[nanodegreeKey];
            if (nanodegree) {
                const updatedNanodegree = ReducerHelper.updateAggregatedState(
                    nanodegree,
                    partKey,
                    lastViewedAt,
                    increment
                );
                state = { ...state,
                    [nanodegreeKey]: updatedNanodegree
                };
            }
            break;

        case Actions.Types.SET_PROJECT_DEADLINES_COMPLETED:
            {
                const {
                    enrollment_id,
                    deadlines
                } = action.payload;
                const nanodegree = Object.values(state).find(
                    (nd) => nd.enrollment.id === enrollment_id
                );
                if (!nanodegree) {
                    break;
                }

                const originalDeadlinesByKey = _.get(
                    nanodegree,
                    'project_deadlines', []
                ).reduce((deadlinesByKey, deadline) => {
                    deadlinesByKey[deadline.progress_key] = deadline.due_at;
                    return deadlinesByKey;
                }, {});
                const newDeadlinesByKey = deadlines.reduce((deadlinesByKey, deadline) => {
                    deadlinesByKey[deadline.progress_key] = deadline.due_at;
                    return deadlinesByKey;
                }, {});
                const mergedDeadlinesByKey = {
                    ...originalDeadlinesByKey,
                    ...newDeadlinesByKey,
                };

                const project_deadlines = Object.keys(mergedDeadlinesByKey).map(
                    (progress_key) => ({
                        progress_key,
                        due_at: mergedDeadlinesByKey[progress_key],
                    })
                );
                state = {
                    ...state,
                    [nanodegree.key]: { ...nanodegree,
                        project_deadlines
                    },
                };
                break;
            }

        case Actions.Types.LAUNCH_CLOUD_RESOURCE:
            {
                const {
                    ndKey
                } = action.payload;
                state = {
                    ...state,
                    [ndKey]: {
                        ...state[ndKey],
                        isLaunchingCloudResource: true,
                        launchedCloudResource: undefined,
                    },
                };
                break;
            }

        case Actions.Types.LAUNCH_CLOUD_RESOURCE_COMPLETED:
            {
                const {
                    ndKey,
                    resource
                } = action.payload;
                state = {
                    ...state,
                    [ndKey]: {
                        ...state[ndKey],
                        isLaunchingCloudResource: false,
                        launchedCloudResource: resource,
                    },
                };
                break;
            }
    }

    return state;
}