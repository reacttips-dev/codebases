import Actions from 'actions';
import ReducerHelper from 'helpers/reducer-helper';
import moment from 'moment';

function keepUserState(existingConcept, nextConcept) {
    const existingLVA = _.get(existingConcept, ['user_state', 'last_viewed_at']);
    const nextLVA = _.get(nextConcept, ['user_state', 'last_viewed_at']);
    if (existingLVA && !nextLVA) {
        return true;
    }
    if (existingLVA && nextLVA && moment(existingLVA) > moment(nextLVA)) {
        return true;
    }
    return false;
}

function updateConcepts(state, concepts) {
    var update = _.reduce(
        concepts,
        (memo, concept) => {
            const existingUserState = _.get(state, [concept.key, 'user_state']);
            if (_.has(concept, 'atoms')) {
                memo[concept.key] = ReducerHelper.mapPropertyCollectionToKeys(
                    concept,
                    'atoms'
                );
            } else {
                memo[concept.key] = concept;
            }

            if (keepUserState(_.get(state, concept.key), concept)) {
                memo[concept.key].user_state = existingUserState;
            }

            return memo;
        }, {}
    );

    return ReducerHelper.merge({}, state, update);
}

function updateFromNanodegree(state, nanodegree) {
    var concepts = ReducerHelper.getConceptsForNanodegree(nanodegree);
    return updateConcepts(state, concepts);
}

function updateFromPart(state, part) {
    var concepts = ReducerHelper.getConceptsForPart(part);
    return updateConcepts(state, concepts);
}

function updateFromCourse(state, course) {
    var concepts = ReducerHelper.getConceptsForCourse(course);
    return updateConcepts(state, concepts);
}

function updateFromPartAsCourse(state, part) {
    var concepts = ReducerHelper.getConceptsForPart(part);
    return updateConcepts(state, concepts);
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

        case Actions.Types.FETCH_PART_CONCEPTS_USER_STATES_COMPLETED:
            var part = _.first(action.payload);
            state = updateFromPart(state, part);
            break;

        case Actions.Types.FETCH_COURSE_COMPLETED:
            var {
                course,
                partAsCourse
            } = action.payload;
            if (partAsCourse) {
                state = updateFromPartAsCourse(state, partAsCourse);
            }
            if (course) {
                state = updateFromCourse(state, course);
            }
            break;

        case Actions.Types.FETCH_LESSON_COMPLETED:
            var lesson = action.payload;
            var concepts = ReducerHelper.getConceptsForLesson(lesson);
            state = updateConcepts(state, concepts);
            break;

        case Actions.Types.UPDATE_CONCEPT_LAST_VIEWED_AT_COMPLETED:
            var {
                user_state
            } = action.payload;
            state = ReducerHelper.mergeUserState(state, user_state);
            break;
    }

    return state;
}