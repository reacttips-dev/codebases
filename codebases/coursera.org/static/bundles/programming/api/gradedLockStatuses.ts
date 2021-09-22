import user from 'js/lib/user';
import stringKeyTuple from 'js/lib/stringKeyTuple';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import NaptimeItemClient from 'pages/open-course/common/naptimeItemClient';

const resourceName = 'onDemandProgrammingGradedLockStatuses.v1';

const get = function ({ itemId, courseId, courseSlug }: { itemId: string; courseId: string; courseSlug: string }) {
  const learnerId = user.get().id;
  const userCourseLearnerId = stringKeyTuple.tupleToStringKey([learnerId.toString(), courseId, itemId]);

  const naptimeClient = new NaptimeItemClient({ itemId, courseId, courseSlug });
  const args = {
    fields: [
      'nextPossibleSubmissionTime',
      'submissionsAllowedNowCount',
      'allowedSubmissionsPerInterval',
      'allowedSubmissionsInterval',
      'locksIfSubmittedBefore',
    ],
  };

  return naptimeClient.get(resourceName, userCourseLearnerId, args);
};

export default { get };
