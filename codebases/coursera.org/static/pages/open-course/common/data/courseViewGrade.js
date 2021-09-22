/**
 * Returns a promise for the course grade object from the onDemandCourseViewGrades.v1 API.
 */
import Q from 'q';

import URI from 'jsuri';
import _ from 'underscore';
import api from 'pages/open-course/common/naptimeApi';
import memoize from 'js/lib/memoize';

const VIEW_GRADE_RESOURCE = 'onDemandCourseViewGrades.v1';
const VIEW_ITEM_GRADE_RESOURCE = 'onDemandCourseViewItemGrades.v1';
const ITEM_OUTCOME_OVERRIDE_RESOURCE = 'onDemandCourseGradeItemOutcomeOverrides.v1';
const VIEW_TRACK_ATTAINMENT_RESOURCE = 'onDemandCourseViewTrackAttainments.v1';
const ITEM_GROUP_GRADE_RESOURCE = 'onDemandCourseViewPassableItemGroupGrades.v1';
const GRADED_ASSIGNMENT_GROUP_RESOURCE = 'onDemandCourseViewGradedAssignmentGroupGrades.v1';

const VIEW_GRADE_FIELDS = ['passingState', 'overallGrade', 'verifiedGrade'];

const VIEW_ITEM_GRADE_FIELDS = ['overallOutcome'];

const GRADED_ASSIGNMENT_GROUP_FIELDS = ['droppedItemIds', 'grade', 'gradedAssignmentGroup'];

const ITEM_OUTCOME_OVERRIDE_FIELDS = ['grade', 'isPassed', 'explanation', 'overridenAt', 'overriderId'];

const VIEW_TRACK_ATTAINMENT_FIELDS = ['passingState', 'overallPassedCount', 'verifiedPassedCount'];

const ITEM_GROUP_GRADE_FIELDS = ['passingState', 'overallPassedCount', 'overallGrade'];

const courseViewGradeDataPromise = function (id) {
  const uri = new URI()
    .addQueryParam('includes', 'items,tracks,itemOutcomeOverrides,passableItemGroups,gradedAssignmentGroupGrades')
    .addQueryParam(
      'fields',
      [
        VIEW_GRADE_FIELDS.join(','),
        `${GRADED_ASSIGNMENT_GROUP_RESOURCE}(${GRADED_ASSIGNMENT_GROUP_FIELDS.join(',')})`,
        `${VIEW_ITEM_GRADE_RESOURCE}(${VIEW_ITEM_GRADE_FIELDS.join(',')})`,
        `${ITEM_OUTCOME_OVERRIDE_RESOURCE}(${ITEM_OUTCOME_OVERRIDE_FIELDS.join(',')})`,
        `${VIEW_TRACK_ATTAINMENT_RESOURCE}(${VIEW_TRACK_ATTAINMENT_FIELDS.join(',')})`,
        `${ITEM_GROUP_GRADE_RESOURCE}(${ITEM_GROUP_GRADE_FIELDS.join(',')})`,
      ].join(',')
    );

  return Q(api.get(VIEW_GRADE_RESOURCE + '/' + id + uri.toString())).then(function (response) {
    const modelProps = response.elements[0];
    // Transform itemGrades, itemOutcomeOverrides, and trackAttainments from arrays to id-keyed objects.
    modelProps.itemGrades = _.indexBy(response.linked[VIEW_ITEM_GRADE_RESOURCE], 'itemId');
    modelProps.itemOutcomeOverrides = _.indexBy(response.linked[ITEM_OUTCOME_OVERRIDE_RESOURCE], 'itemId');
    modelProps.trackAttainments = _.indexBy(response.linked[VIEW_TRACK_ATTAINMENT_RESOURCE], 'trackId');
    modelProps.itemGroupGrades = _.indexBy(response.linked[ITEM_GROUP_GRADE_RESOURCE], 'passableItemGroupId');
    modelProps.gradedAssignmentGroups = _.indexBy(response.linked[GRADED_ASSIGNMENT_GROUP_RESOURCE], 'id');
    return modelProps;
  });
};
export default courseViewGradeDataPromise;
export const memoizedCourseViewGradeDataPromise = memoize(courseViewGradeDataPromise);
