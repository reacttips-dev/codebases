import FunctionHelper from 'helpers/function-helper';
import StateHelper from 'helpers/state-helper';

const MappingHelper = {
    createAtomsByConceptKeyMap: FunctionHelper.requireAllArgs(function(
        state,
        conceptKeys
    ) {
        return _.reduce(
            conceptKeys,
            (memo, conceptKey) => {
                memo[conceptKey] = StateHelper.getAtomsByConceptKey(state, conceptKey);
                return memo;
            }, {}
        );
    }),

    createLessonsByPartKeyMap: FunctionHelper.requireAllArgs(function(
        state,
        partKeys
    ) {
        return _.reduce(
            partKeys,
            (memo, partKey) => {
                memo[partKey] = StateHelper.getLessonsByPartKey(state, partKey);
                return memo;
            }, {}
        );
    }),

    createProjectByLessonKeyMap: FunctionHelper.requireAllArgs(function(
        state,
        lessonKeys
    ) {
        return _.reduce(
            lessonKeys,
            (memo, lessonKey) => {
                var project = StateHelper.getProjectByLessonKey(state, lessonKey);
                if (project) {
                    memo[lessonKey] = project;
                }
                return memo;
            }, {}
        );
    }),

    createProjectByPartKeyMap: FunctionHelper.requireAllArgs(function(
        state,
        partKeys
    ) {
        return _.reduce(
            partKeys,
            (memo, partKey) => {
                var project = StateHelper.getProjectByPartKey(state, partKey);
                if (project) {
                    memo[partKey] = project;
                }
                return memo;
            }, {}
        );
    }),
};

export default MappingHelper;