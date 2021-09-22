// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'page... Remove this comment to see the full error message
import NaptimeItemClient from 'pages/open-course/common/naptimeItemClient';

const resourceName = 'onDemandProgrammingSubmissionEvaluations.v1';

const get = function ({
  itemId,
  courseId,
  courseSlug,
  submissionId,
}: {
  itemId: string;
  courseId: string;
  courseSlug: string;
  submissionId: string;
}) {
  const naptimeClient = new NaptimeItemClient({ itemId, courseId, courseSlug });
  const args = {
    fields: ['definition'],
  };

  return naptimeClient.get(resourceName, submissionId, args);
};

export default { get };
