import Actions from 'actions';
import ReducerHelper from 'helpers/reducer-helper';

function updateCourses(state, courses) {
    var update = _.reduce(
        courses,
        (memo, course) => {
            var reducedCourse = ReducerHelper.mapPropertyCollectionToKeys(
                course,
                'lessons'
            );
            var project = reducedCourse.project;
            reducedCourse = _.omit(reducedCourse, 'project');
            reducedCourse._project_key = (project || {}).key;
            memo[course.key] = _.omit(reducedCourse, 'aggregated_state');
            return memo;
        }, {}
    );

    return ReducerHelper.merge({}, state, update);
}

function updatePartsAsCourses(state, parts) {
    // To convert a part to a partAsCourse
    // bring lessons up to level of modules and remove modules
    // SXP-124: Need to add _project_key
    const update = parts.reduce((memo, part) => {
        // eslint-disable-next-line no-unused-vars
        let {
            modules,
            ...partAsCourse
        } = part;
        // destructuring important to not mutate the passed-in part
        // so the next reducer will get a semantically correct part
        partAsCourse.lessons = ReducerHelper.getLessonsForPart(part);
        partAsCourse = ReducerHelper.mapPropertyCollectionToKeys(
            partAsCourse,
            'lessons'
        );
        memo[part.key] = partAsCourse;
        return memo;
    }, {});

    return ReducerHelper.merge({}, state, update);
}

function getAggregatedState(course) {
    var aggregatedState = ReducerHelper.getAggregatedStateForCourse(course);
    return _.omit(aggregatedState, 'lesson_aggregated_states');
}

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.CLEAR_CONTENT:
            state = {};
            break;

        case Actions.Types.FETCH_COURSE_COMPLETED:
            var {
                course,
                partAsCourse
            } = action.payload;
            if (course) {
                state = updateCourses(state, [course]);
                state = ReducerHelper.mergeAggregatedStates(state, [
                    getAggregatedState(course),
                ]);
            }
            if (partAsCourse) {
                state = updatePartsAsCourses(state, [partAsCourse]);
                //SXP-124: getAggregatedState
            }
            break;

        case Actions.Types.FETCH_SUBSCRIBED_COURSES_COMPLETED:
            var courses = action.payload;
            state = updateCourses(state, courses);

            break;

        case Actions.Types.FETCH_ME_COMPLETED:
            var {
                courses,
                current_parts
            } = action.payload;
            state = updateCourses(state, courses);
            state = updatePartsAsCourses(state, current_parts);
            break;

        case Actions.Types.UPDATE_COURSE_LAST_VIEWED_AT_COMPLETED:
            var {
                user_state
            } = action.payload;
            if (user_state) {
                state = ReducerHelper.mergeUserState(state, user_state);
            }
            break;

        case Actions.Types.UPDATE_CONCEPT_COUNTS:
            const {
                courseKey,
                lessonKey,
                lastViewedAt,
                increment
            } = action.payload;
            var course = state[courseKey];
            if (course) {
                const updatedCourse = ReducerHelper.updateAggregatedState(
                    course,
                    lessonKey,
                    lastViewedAt,
                    increment
                );
                state = { ...state,
                    [courseKey]: updatedCourse
                };
            }
            break;
    }

    return state;
}