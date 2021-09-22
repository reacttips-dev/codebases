import React from 'react';
import { SvgEdit } from '@coursera/coursera-ui/svg';
import Action from 'bundles/preview/components/Action';
import type { AuthoringCourseContext } from 'bundles/authoring/common/types/authoringCourseContexts';
import type AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';
import { getContextIdFromContext } from 'bundles/authoring/course-level/utils/contextUtils';
import 'css!bundles/preview/components/__styles__/EditItem';

import _t from 'i18n!nls/preview';

type Props = {
  course: AuthoringCourse;
  matchedContext: AuthoringCourseContext;
  itemId: string;
  currentRouteName: string;
  versionId: string;
  shouldUseContextBasedVaL: boolean;
  groupId?: string;
};

// we don't use consistent route names between the /learn and /teach sides for these item types
const learnToTeachItemRouteMapping = {
  gradedLti: 'lti',
  ungradedLti: 'lti',
  'quiz-cover': 'quiz',
  'practice-quiz-cover': 'quiz',
  'ca-cover': 'project',
  widget: 'plugin',
  reading: 'supplement',
  programmingDefault: 'programming',
  programmingInstructions: 'programming',
  programmingSubmission: 'programming',
  team: 'project',
  'teammate-review-item': 'teammate-review',
  'teammate-review-cover': 'teammate-review',
  'teammate-review-review': 'teammate-review',
  'teammate-review-grades': 'teammate-review',
};

const getTeachItemRouteForLearnItemRoute = (learnItemRouteName: string) => {
  const truncatedRouteName = learnItemRouteName.split('.')[0]; // routes on learn sometimes have subroutes in the form of itemtype.subroute
  return (learnToTeachItemRouteMapping as Record<string, string>)[truncatedRouteName] || truncatedRouteName;
};

const EditItem = ({
  course,
  itemId,
  currentRouteName,
  versionId,
  groupId,
  matchedContext,
  shouldUseContextBasedVaL,
}: Props) => {
  const itemRouteName =
    currentRouteName === 'resourcesWithRefId'
      ? 'resources'
      : 'edit/' + getTeachItemRouteForLearnItemRoute(currentRouteName);

  const contextId = shouldUseContextBasedVaL
    ? getContextIdFromContext(matchedContext)
    : groupId ?? versionId.replace('authoringBranch~', '');

  return (
    <div className="rc-EditItem">
      <Action
        icon={<SvgEdit />}
        label={_t('Edit Item')}
        href={`/teach/${course.slug}/${contextId}/content/${itemRouteName}/${itemId}`}
      />
    </div>
  );
};

export default EditItem;
