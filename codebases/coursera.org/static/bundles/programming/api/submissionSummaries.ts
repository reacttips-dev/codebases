import _ from 'underscore';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import NaptimeItemClient from 'pages/open-course/common/naptimeItemClient';

const list = ({
  itemId,
  itemTypeName,
  courseId,
  courseSlug,
  userId,
}: {
  itemId: string;
  itemTypeName: string;
  courseId: string;
  courseSlug: string;
  userId: number;
}) => {
  const resourceNameByItemTypeName = {
    gradedProgramming: 'onDemandProgrammingGradedSubmissionSummaries.v1',
    ungradedProgramming: 'onDemandProgrammingUngradedSubmissionSummaries.v1',
  };

  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const resourceName = resourceNameByItemTypeName[itemTypeName];
  if (!resourceName) {
    throw new Error('I do not know the name of the submissionSummaries resource for ' + itemTypeName);
  }

  const naptimeClient = new NaptimeItemClient({ itemId, courseId, courseSlug });
  const finderName = 'list';
  const finderArguments = _(_({ courseId, itemId }).pick('courseId', 'itemId')).extend({
    learnerId: userId,
    fields: [
      'submissionSummary',
      'passingFraction',
      'submittedAt',
      'isBestSubmission',
      'isUsedForGrading',
      'isEvaluationReady',
    ],
  });
  const mightRevealChangedProgress = true;

  return naptimeClient.finder(resourceName, finderName, finderArguments, mightRevealChangedProgress);
};

export default { list };
