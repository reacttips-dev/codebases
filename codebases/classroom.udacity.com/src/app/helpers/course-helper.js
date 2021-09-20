import CareerCourses from 'constants/career-courses.js';
import FunctionHelper from 'helpers/function-helper';
import NodeHelper from 'helpers/node-helper';
import StateHelper from 'helpers/state-helper';

const CourseHelper = {
    State: {
        getLastViewedLesson: FunctionHelper.requireAllArgs(function(
            state,
            course
        ) {
            return StateHelper.getLesson(
                state,
                NodeHelper.getLastViewedChildKey(course)
            );
        }),
    },
    getProjectDueAt(course, project) {
        const deadline = _.get(course, 'deadline');
        if (_.get(deadline, 'progress_key') === project.progress_key) {
            return new Date(_.get(course, 'deadline.due_at', ''));
        } else {
            return null;
        }
    },
    // HACK: This is to handle the 1 Million Arab Coders courses that were launched without realizing we let any user view any course
    requiresEnrollmentToView(courseKey) {
        const omacCourseKeys = [
            'ud803-track-1mac',
            'ud002-track-1mac',
            'ud001-track-1mac',
            'ud004-track-1mac',
        ];
        return _.includes(omacCourseKeys, courseKey);
    },
    isCareerService(courseKey) {
        return _.includes(CareerCourses, courseKey);
    },
};

export default CourseHelper;