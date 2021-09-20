import Actions from 'actions';
import ReducerHelper from 'helpers/reducer-helper';

function getLessonAggregatedStatesForNanodegree(nanodegree) {
    return ReducerHelper.getLessonAggregatedStatesForNanodegree(nanodegree);
}

function getLessonAggregatedStatesForCourse(concept) {
    return ReducerHelper.getLessonAggregatedStatesForCourse(concept);
}

function getLessonAggregatedStatesForPart(part) {
    return ReducerHelper.getLessonAggregatedStatesForPart(part);
}

function updateLessons(state, lessons) {
    var update = _.reduce(
        lessons,
        (memo, lesson) => {
            var reduced = ReducerHelper.mapPropertyCollectionToKeys(
                lesson,
                'concepts'
            );
            reduced = ReducerHelper.mapPropertiesToKeys(reduced, 'project', 'lab');
            memo[lesson.key] = reduced;
            return memo;
        }, {}
    );

    return ReducerHelper.merge({}, state, update);
}

function updateFromNanodegree(state, nanodegree) {
    var lessons = ReducerHelper.getLessonsForNanodegree(nanodegree);
    state = updateLessons(state, lessons);
    state = ReducerHelper.mergeAggregatedStates(
        state,
        getLessonAggregatedStatesForNanodegree(nanodegree)
    );

    return state;
}

function updateFromCourse(state, course) {
    var lessons = ReducerHelper.getLessonsForCourse(course);
    state = updateLessons(state, lessons);
    state = ReducerHelper.mergeAggregatedStates(
        state,
        getLessonAggregatedStatesForCourse(course)
    );

    return state;
}

function updateFromPartAsCourse(state, part) {
    var lessons = ReducerHelper.getLessonsForPart(part);
    state = updateLessons(state, lessons);
    state = ReducerHelper.mergeAggregatedStates(
        state,
        getLessonAggregatedStatesForPart(part)
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

        case Actions.Types.FETCH_COURSE_COMPLETED:
            var {
                course,
                partAsCourse
            } = action.payload;
            if (course) {
                state = updateFromCourse(state, course);
            }
            if (partAsCourse) {
                state = updateFromPartAsCourse(state, partAsCourse);
            }
            break;

        case Actions.Types.FETCH_ME_COMPLETED:
            const {
                nanodegrees,
                courses,
                current_parts: parts
            } = action.payload;
            _.each(nanodegrees, (nanodegree) => {
                const lessons = ReducerHelper.getLessonsForNanodegree(nanodegree);
                state = updateLessons(state, lessons);
            });
            _.each(courses, (course) => {
                const lessons = ReducerHelper.getLessonsForCourse(course);
                state = updateLessons(state, lessons);
            });
            _.each(parts, (part) => {
                const lessons = ReducerHelper.getLessonsForPart(part);
                state = updateLessons(state, lessons);
            });
            break;

        case Actions.Types.FETCH_LESSON_COMPLETED:
            var lesson = action.payload;
            state = updateLessons(state, [lesson]);
            break;

        case Actions.Types.FETCH_LAB_COMPLETED:
            var lab = action.payload;
            var lessonWithLab = _.find(
                state,
                (lesson) => _.get(lesson, 'lab.lab_id') === lab.id
            );
            state = updateLessons(state, [{ ...lessonWithLab,
                lab
            }]);
            break;

        case Actions.Types.UPDATE_LAB_RESULT_COMPLETED:
            var lab = action.payload;
            var lessonWithLab = _.find(
                state,
                (lesson) => _.get(lesson, 'lab.lab_id') === lab.id
            );
            state = updateLessons(state, [{
                ...lessonWithLab,
                lab: {
                    ...lessonWithLab.lab,
                    result: {
                        skill_confidence_rating_after: lab.skill_confidence_rating_after,
                    },
                },
            }, ]);
            break;

        case Actions.Types.UPDATE_CONCEPT_COUNTS:
            const {
                lessonKey,
                conceptKey,
                lastViewedAt,
                increment
            } = action.payload;
            var lesson = state[lessonKey];
            if (lesson) {
                const updatedLesson = ReducerHelper.updateAggregatedState(
                    lesson,
                    conceptKey,
                    lastViewedAt,
                    increment
                );
                state = { ...state,
                    [lessonKey]: updatedLesson
                };
            }
            break;
    }

    return state;
}