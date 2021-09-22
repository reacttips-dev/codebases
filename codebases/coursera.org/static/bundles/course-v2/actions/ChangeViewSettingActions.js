import user from 'js/lib/user';
import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';
import { getDefaultEnrollableSessionId } from 'bundles/authoring/branches/utils/BranchUtils';

const viewAsLearnerInCourseAPI = API('/api/viewAsLearnerInCourse.v1', { type: 'rest' });

export const changeUserEnrollment = (
  actionContext,
  {
    courseId,
    sessionId,
    groupId,
    userCanSwitchGroups,
    selectDefaultSessionForBranch,
    newWindow,
    onCompleteChangeUserEnrollment = () => {},
    branch,
    skipReloadWindow = false, // in some cases we only want to open a new window AFTER enrollment is done, so we can skip the reload. e.g. <CourseNavigationPreviewButtonV2 />
  }
) => {
  const userId = user.get().id;
  const maybeReloadWindow = () => {
    if (skipReloadWindow) {
      onCompleteChangeUserEnrollment();
      return;
    }

    const windowToUse = newWindow || window;
    windowToUse.location.reload();
    onCompleteChangeUserEnrollment();
  };

  const newSessionId = selectDefaultSessionForBranch && branch ? getDefaultEnrollableSessionId(branch) : sessionId;
  const newGroupIds = userCanSwitchGroups && groupId ? [groupId] : [];
  const data = {
    userId,
    courseId,
    sessionId: newSessionId,
    groupIds: newGroupIds,
  };

  Q(viewAsLearnerInCourseAPI.post(new URI().addQueryParam('action', 'start').toString(), { data }))
    .then(maybeReloadWindow)
    .done();
};

export default { changeUserEnrollment };
