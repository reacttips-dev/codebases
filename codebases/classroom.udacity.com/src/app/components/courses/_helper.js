import RouteHelper from 'helpers/route-helper';
import SemanticTypes from 'constants/semantic-types';

export function lastViewedLessonRoute(root, lastViewedLesson) {
    return SemanticTypes.isPart(root) ?
        RouteHelper.paidCourseConceptPath({
            courseKey: root.key,
            lessonKey: lastViewedLesson.key,
            conceptKey: 'last-viewed',
        }) :
        RouteHelper.courseConceptPath({
            courseKey: root.key,
            lessonKey: lastViewedLesson.key,
            conceptKey: 'last-viewed',
        });
}