// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import NaptimeItemClient from 'pages/open-course/common/naptimeItemClient';
import { LearnerAssignmentData } from 'bundles/programming/promises/learnerAssignment';

const resourceName = 'onDemandProgrammingLearnerAssignments.v1';

const get = ({
  itemId,
  courseId,
  courseSlug,
}: {
  itemId: string;
  courseId: string;
  courseSlug: string;
}): Q.Promise<LearnerAssignmentData> => {
  const naptimeClient = new NaptimeItemClient({ itemId, courseId, courseSlug });
  const args = {
    fields: [
      'maxScore',
      'passingFraction',
      'passingScore',
      'submissionLearnerSchema',
      'submissionBuilderSchema',
      'versionId',
    ],
  };
  return naptimeClient.getWithCourseItemId(resourceName, args).then((response: $TSFixMe) => response.elements[0]);
};

export default { get };
